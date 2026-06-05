---
id: ms-intern-summary
title: "Microsoft Intern Summary: Optimizing VSCode Gradle Extension"
date: 2024-08-06
tags:
  - tech
category: posts
---
## Project Background

![Project Image](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240803213701.png)

During my internship at Microsoft, I worked on the [VSCode Gradle Extension](https://github.com/microsoft/vscode-gradle). This extension was initially divided into three components:

1. **Gradle Task Server:** Runs in the background, providing project and task information, and executing Gradle tasks.
2. **Gradle Language Server:** Offers language features such as code completion and diagnostics for Gradle script files.
3. **Gradle Project Importer:** Imports Gradle projects detected by the **Gradle Build Server** into the workspace.

My role was to merge these servers into a single process, with each component running in a separate thread, thereby reducing memory usage. This consolidation is crucial for integrating the extension into the [VSCode Java Pack](https://github.com/microsoft/vscode-java-pack), which is widely used by VSCode Java developers.

### Communication Between Servers

| Server                | Client                  | Communication Method                                                                                           |
|-----------------------|-------------------------|----------------------------------------------------------------------------------------------------------------|
| Task Server: Java     | Task Client: TypeScript | [gRPC](https://grpc.io/): TCP socket                                                                           |
| Language Server: Java | Language Client: TypeScript | [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), [JSON-RPC](https://www.jsonrpc.org/specification): Stdio |
| Build Server: Java    | Build Client: Java      | [Build Server Protocol](https://build-server-protocol.github.io/): Stdio                                       |

### Architecture Before the Merge

![Architecture Before Merge](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240803233221.png)

## Why Merge?

Originally, the extension started three separate Java processes:

1. **Task Server:** Previously called the Gradle Server, this component was adopted by Microsoft from [Richard Willis](https://github.com/badsyntax) and was the initial server.
2. **Language Server:** Also developed by Richard Willis, providing language features.
3. **Build Server:** Added by Microsoft to support project importing. More details can be found [here](https://github.com/microsoft/build-server-for-gradle).

This setup incurred significant overhead due to running three separate processes, as shown below:

![Process Overhead](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/bfm.png)

Since our goal is to include this extension in the VSCode Java Pack, which is used by many Java developers, reducing memory consumption was essential.

Initially, the Task Server and Language Server would start when the extension was loaded, whereas the Build Server, being an external dependency, would start on-demand when the importer was loaded.

## How to Merge

Since the three servers are independent and do not share data, modifying the startup logic to launch them simultaneously using Java multithreading was a suitable solution.

### Architecture After the Merge

![Architecture After Merge](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240804104905.png)

### Step 1: Merging Task Server and Build Server

#### Challenges

1. **Standard I/O Issues:** After merging, using standard input/output was no longer feasible due to conflicts between multiple threads. TCP sockets couldn't be used due to security concerns, so [Named Pipes](https://en.wikipedia.org/wiki/Named_pipe) were employed as a compliant solution.

2. **Windows Compatibility:** Java's support for named pipes on Windows is not very user-friendly, requiring complex OS-level handling. While Unix systems use Unix Domain Sockets, Windows uses AsynchronousFileChannel. 


```Java
// Connection between Build Server and Build Client
org.eclipse.lsp4j.jsonrpc.Launcher<BuildClient> launcher = new 
    org.eclipse.lsp4j.jsonrpc.Launcher.Builder<BuildClient>()
    .setOutput(outputStream)
    .setInput(inputStream)
    .setLocalService(gradleBuildServer)
    .setRemoteInterface(BuildClient.class)
    .setExecutorService(Executors.newCachedThreadPool())
    .create();
buildTargetService.setClient(launcher.getRemoteProxy());
```

3. **Named Pipe Creation:** The solution required creating and listening to named pipes. In the Node.js environment, libraries like [net.Socket](https://nodejs.org/api/net.html#netcreateserveroptions-connectionlistener) handle this directly, enabling listening on named pipes. 

To bridge the gap, I implemented an additional [BspProxy](https://github.com/microsoft/vscode-gradle/blob/b71fcb2e1e4c8aeafc9ece92a13659f47e5c6009/extension/src/bs/BspProxy.ts#L16) layer. This proxy establishes named pipe connections between the Build Server and Build Client during startup, facilitating indirect communication.

4. **Named Pipe Path Generation:** 

   - **Build Server and BspProxy:** Since the Build Server can start with the extension, the extension generates a random file name upon startup, passing it to the Build Server, which then listens on that named pipe.

   - **Build Client and BspProxy:** The Build Client's startup is tied to the Gradle project import process, controlled by the Java Language Server. The challenge was how the Build Client could generate and pass the named pipe path to the VSCode Extension's BspProxy.


Luckily, the `JavaLanguageServerPlugin` is able to send a notification to VSCode, informing it of the named pipe path, and the extension can then pass this information to the BspProxy.
```java
// Send message to VSCode
private void sendImporterPipeName(String pipeName) {
    JavaLanguageServerPlugin.getInstance().getClientConnection()
        .sendNotification("gradle.onWillImporterConnect", pipeName);
}
```
```typescript
// Receive message from Java
private registerCommand(): void {
    this.context.subscriptions.push(
        vscode.commands.registerCommand("gradle.onWillImporterConnect", (pipeName: string) => {
            this._onImporterReady.fire(path.resolve(pipeName));
        })
    );
}
```
Since the import process controls initialization, communication is one-way, using notifications. The Java side cannot receive feedback from VSCode. Therefore, polling was used to establish the connection once VSCode was ready.

#### Connection Workflow

The entire connection process is illustrated below:

![Connection Workflow](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/20240804110358.png)

This was the most complex part of the project, but it successfully merged the Build Server and Task Server.

### Step 2: Merging Language Server to Gradle Server

This step was more straightforward. The VSCode Language Server and Client libraries support various connection methods.  

By packaging the Language Server as a local dependency and using named pipes for communication, I was able to merge it with the Gradle Server seamlessly.

**Dependency Management:** 

The primary challenge was handling shared dependencies between the Gradle Server and Gradle Language Server. By creating a [fat JAR](https://stackoverflow.com/questions/19150811/what-is-a-fat-jar) for the Language Server and placing it at the end of the Gradle Server's classpath, dependency conflicts were resolved.

## Performance After Merge
After Merge, it only got one single Java process `GradleServer`.
![af-merge](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/af-merge.png)
### How Was Performance Measured?

Memory consumption was the primary focus after the merge. Before the merge, we could determine total memory usage by monitoring the memory consumption of each of the three separate processes. I developed a Python script to automate this process.

#### Pre-Merge Memory Monitoring

1. **Polling for Process IDs**: The script first polls the system to find the process IDs (PIDs) of the three servers based on their class names.

2. **Monitoring Memory Usage**: Using the `psutil` library, the script captures the [Resident Set Size (RSS)](https://www.baeldung.com/linux/resident-set-vs-virtual-memory-size) usage of each process individually and then sums them up to obtain the total memory usage. 

This script runs before starting VSCode to monitor memory consumption when opening a Gradle project. It outputs memory usage data every second.

>What is **RSS Monitoring**? :  
>
>Resident Set Size (RSS), a measure provided by the operating system that indicates the actual amount of physical memory occupied by a process. 
>
>For Java programs, RSS includes not only the Java heap memory but also Metaspace, code cache, memory used by the JVM itself, and JVM stack space.

#### Post-Merge Memory Monitoring

After merging the processes into a single thread, I used `Plotly` to visualize the memory usage:

- **Plotting Memory Usage**: I plotted the sum of memory usage for the three pre-merge servers against the single merged process over time. This line chart illustrates real-time memory changes as a Gradle project is opened.

- **Version Comparison**: Between versions 3.13.5 (before the merge) and 3.16.2 (after the merge).


### Performance Results
To Test the performance, I used the four different size of project:

| Project Size  | Description       | Number of Gradle Tasks |
|---------------|--------------------|------------------------|
| Small         | Basic project initialized with `Gradle init` command             | 34                     |
| Medium        | [microsoft/vscode-gradle](https://github.com/microsoft/vscode-gradle) project    | ~380                   |
| Large         | [apache/lucene](https://github.com/apache/lucene) project                      | ~3,300                 |
| Super Large   | [gradle/gradle](https://github.com/gradle/gradle) project                      | ~42,000                |

#### Small
![small2](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/small2.png)

#### Medium
![medium](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/newplot.png)

#### Large
![large](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/large-copy.png)
#### Super Large

![super-large](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/Screenshot%202024-08-13%20at%2012.01.35.png)

The results showed significant memory savings, especially with smaller projects, demonstrating the efficiency of the merged architecture.
