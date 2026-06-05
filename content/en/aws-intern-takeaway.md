---
id: aws-intern-takeaway
title: "AWS SDE internship experience, gains beyond technology"
date: 2025-09-12
tags:
  - Tech
category: posts
---
![](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/BAFC57A2-C3DD-4816-8C19-F67AB17D07E3_1_105_c.jpeg)


Summer really flies by. These four months at AWS in Vancouver can be said to be the most unforgettable and fulfilling summer in my life. In addition to the beautiful climate in Vancouver, the internship projects gave me great challenges and satisfaction. Coupled with the great working atmosphere of the entire team, it was simply a top-notch internship experience.

This blog is not a typical technical sharing. I will not (~~nor can~~) discuss specific technical solutions. Instead, I want to focus on the gains and some inspired places during the entire internship process, and talk about my experience and thinking as an intern when facing large and complex engineering systems.

---
![](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/7E979352-C92D-45BB-B528-974145ED6747_1_105_c.jpeg)

My group is called Ingestion hub, which mainly maintains a service called [vended log](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html). To put it simply, when a user subscribes to an AWS cloud service, he or she can set the generated logs to be sent to other accounts. It is essentially the transmission and distribution of information, and the main challenge is how to efficiently and stably process and forward these log information through an extremely large and complex infra.

What I am responsible for optimizing is a very specific but critical issue: when a user suddenly sends an extremely large amount of logs, for example, when ten times the usual traffic is generated in an instant, a certain module in the system will be "overloaded", thus affecting the stability of the entire system. My task is to design and implement an automated "sideline" mechanism to deal with this situation.

The idea sounds very straightforward, but when the design actually begins, a series of questions emerge:

* **How to define "overload"? ** Which indicators of the monitoring system (CPU? Memory? Queue length?) can be used to accurately judge? How to avoid "false positives"?
* **What algorithm is used for monitoring? ** Is it the volume of monitoring data (byte size) or the rate (TPS)? How to ensure that the algorithm is still effective in various edge cases?
* **How ​​to restart after "on hold"? ** How to design an elegant restart mechanism to ensure that these shelved data can be reprocessed without being confused with normal or errored data?
* **How ​​to ensure the efficiency and stability of the entire process? ** Shelving and restarting themselves cannot become new performance bottlenecks, nor can they introduce new bugs.

---
![](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/66226CAB-2CB3-498D-BDA0-BC60FB20F4AE_1_105_c.jpeg)

On the first day of joining the company, my mentor told me frankly that this project was not easy. If I could complete it independently, it would be at least L5 level (NG level up). Later, when I met mgr 1 on 1 for the first time, she even comforted me: "It's okay, we will fully consider the difficulty of the project when making a return offer." This made me feel both stressed out and inexplicably excited.

Fortunately, the entire group is very supportive. In the first two weeks, my mentor would have a one-hour 1 on 1 with me every day to help me sort out the system and answer my questions.

Despite this, I was still in a "confused" state in the past few weeks when faced with the objective complexity of the system. The scope I'm dealing with is probably only 10% of the entire system, but in order to understand that 10%, I have to understand the context of the remaining 90%. At the beginning, I could only forcefully understand the information I received and the code I read in a low-dimensional, simplified way as a "definition", but this "definition" was often inaccurate or even wrong. And due to differences in understanding, it is difficult to "align" with people who understand the system at this stage (forgive me for using such an Ali-flavored word, but it is really appropriate to use it here...). Communication between the two parties can only be more effective when the level of understanding is close.    
For example, my personal experience is that during the Design Doc review in the fourth week, I really didn’t understand the questions asked by L7 in the group, but I was able to have a decent discussion during the demo at the end of the internship.

![](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/8A74D6F3-362C-415F-AAFF-0ED1C6E97452_1_105_c.jpeg)


Mentor taught me a very effective method: **read code with assumptions**. First, form a preliminary model in your mind about how the system works through documents and architecture diagrams, and then use this model to look for evidence in the code to verify or overturn your assumptions. It is quite effective to turn passive "reading" into an active "detective game".

This process also gave me a deep understanding of the huge difference between engineering practice and student learning. When learning mathematics in middle school, any formula and theorem can be deduced all the way to the lowest axiom (such as 1+1=2). There is no unexplainable "GAP" in the knowledge system. But in large software projects, you can't know all the details. **Every engineer can only stop at a certain abstraction layer and trust that the abstraction of the next layer is reliable. ** You can't go through all the knowledge before starting like you did in school. The only way is to learn by doing, and learn by doing.

For example, to build an airplane, engineers need to understand aerodynamics, materials science, and engine principles, but they do not need to start with Newton's laws and the periodic table of elements. He works on an already constructed layer of abstraction and believes that the underlying physical laws are solid. It is also the engineer's job to build new bridges between these complex abstraction layers.

Halfway through the internship, when I basically completed the core functions, I went back and read a lot of code and documents, and then I felt that I really understood the abstraction needed for the part I was responsible for. I was finally able to understand some of the discussions in the group about existing system issues. This experience of "quantitative change leading to qualitative change" is really wonderful.

---
![](https://raw.githubusercontent.com/Jiaaming/blogImage/main/pic/7573A8B5-1D1A-474C-8F86-5DBE79F60B4E_1_105_c.jpeg)

Unlike many interns who implement it directly based on the mentor's design, my mentor and the entire team strongly encourage me to think and design independently. Mentor pays special attention to training me to understand the project logic: Why do we design like this? What is the root cause behind it?

For the design of intern projects, the team usually already has a preliminary plan. I started with a draft of the design document - which gave me some of the conclusions. If I didn't take the initiative to think about "why this conclusion is reached" and just continued to realize it, it would be easy to "go astray" in the details (I did go astray at the beginning).

This ability to ask "Why" is also a culture that AWS attaches great importance to when reviewing major system events (COE). One of the most classic examples is the story of the "Lincoln Monument" (@chatgpt):

**Background:**
The exterior stone of the Lincoln Memorial has shown significant deterioration and erosion. The management's first reaction is to spend a lot of money to replace the stone with more durable stone or to strengthen repairs.

But by asking “Why” layer by layer, they dug into the root of the problem:

* **Why are the stones of the monument aging seriously? **
    → Because building surfaces are often washed with strong cleaning agents.
* **Why do you need to clean it so frequently? **
    → Because there are a lot of bird droppings on the wall, it affects the appearance.
* **Why are there so many birds here? **
    → Because there are a lot of spiders gathered around the monument, which are a good meal for birds.
* **Why are there so many spiders? **
    → Because a lot of moths and insects gather here at night.
* **Why are there so many insects? **
    → Because the monument's night lighting system is turned on early at dusk, the bright light attracts them.

**Final conclusion:**
The root cause of stone aging is **turning on the lights too early**.

**Solution:**
Instead of spending a huge sum of money to replace the stone, adjust the lighting strategy - delay the lighting time by one hour. There are fewer insects, and with them spiders and birds, cleaning is much less frequent, and the monument's stone is preserved.

This story inspired me a lot. When I encountered a problem during my internship and couldn't unblock myself, and asked the experienced engineers in the team for advice, I could deeply feel their mindset of tracing back to the source. They would not give me a direct answer, but would ask me a few questions to guide me to find the core of the problem myself. This is what I need to practice in the future.
