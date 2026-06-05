import { useEffect, useMemo } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import Outline from '../components/Outline'
import Pill from '../components/Pill'
import slugify from '../utils/slugify'

const buildOutline = (content) => {
  if (!content) return []
  return content
    .split('\n')
    .map((line) => line.match(/^(#{1,3})\s+(.*)$/))
    .filter(Boolean)
    .map(([, hashes, text]) => ({
      level: hashes.length,
      text: text.trim(),
      id: slugify(text),
    }))
}

const PostDetail = () => {
  const navigate = useNavigate()
  const { postId } = useParams()
  const { posts, labels } = useOutletContext()
  const post = useMemo(() => posts.find((p) => p.id === postId), [posts, postId])

  useEffect(() => {

    const fullHash = window.location.hash 
    const hashParts = fullHash.split('#') 

    // hashParts[0] = ""
    // hashParts[1] = "/posts/2023-summary"
    // hashParts[2] = "header" 

    const anchorHash = hashParts.length > 2 ? hashParts[2] : null

    if (anchorHash) {

      setTimeout(() => {
        const element = document.getElementById(decodeURIComponent(anchorHash))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [postId])

  if (!post) {
    return (
      <div className="p-1 sm:p-2">
        <p className="text-sm text-muted">{labels.common.postNotFound}</p>
        <button className="underline mt-2" onClick={() => navigate('/posts')}>
          {labels.common.backToPosts}
        </button>
      </div>
    )
  }

  const headings = buildOutline(post.content || post.excerpt)

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <button className="underline underline-offset-2 hover:text-accent" onClick={() => navigate('/posts')}>
            {labels.common.backToPosts}
          </button>
          <span aria-hidden="true">•</span>
          <span className="font-mono text-ink">{post.date}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink mt-2">{post.title}</h1>
        {post.isFallback ? (
          <p className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted">
            {labels.common.fallbackNotice}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>

        <div className="lg:hidden">
          <Outline headings={headings} title={labels.common.outline} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2.5fr)_1fr] gap-8 lg:gap-12 mt-4">
        <div className="space-y-4">
          <div className="markdown text-base leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ node, children, ...rest }) => {
                  const text =
                    node?.children?.map((child) => child.value || '').join(' ') ||
                    children?.[0] ||
                    ''
                  const id = slugify(text)
                  return (
                    <h1 id={id} {...rest}>
                      {children}
                    </h1>
                  )
                },
                h2: ({ node, children, ...rest }) => {
                  const text =
                    node?.children?.map((child) => child.value || '').join(' ') ||
                    children?.[0] ||
                    ''
                  const id = slugify(text)
                  return (
                    <h2 id={id} {...rest}>
                      {children}
                    </h2>
                  )
                },
                h3: ({ node, children, ...rest }) => {
                  const text =
                    node?.children?.map((child) => child.value || '').join(' ') ||
                    children?.[0] ||
                    ''
                  const id = slugify(text)
                  return (
                    <h3 id={id} {...rest}>
                      {children}
                    </h3>
                  )
                },
                a: ({ children, ...props }) => {
                  return (
                    <a {...props} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  )
                },
                ul: ({ children }) => {
                  return <ul className="list-disc list-outside ml-6 space-y-2">{children}</ul>
                },
                ol: ({ children }) => {
                  return <ol className="list-decimal list-outside ml-6 space-y-2">{children}</ol>
                },
                li: ({ children }) => {
                  return <li className="text-ink">{children}</li>
                },
                img: ({ node, ...props }) => {
                  const alt = node?.properties?.alt || ''
                  return (
                    <figure className="my-6 space-y-2">
                      <img {...props} alt={alt} className="w-full rounded-lg" />
                      {alt ? <figcaption className="text-sm text-muted italic text-center">{alt}</figcaption> : null}
                    </figure>
                  )
                },
              }}
            >
              {post.content || post.excerpt}
            </ReactMarkdown>
          </div>
        </div>
        <aside className="hidden lg:block sticky top-16 self-start">
          <Outline headings={headings} title={labels.common.outline} />
        </aside>
      </div>

      <button
        type="button"
        className="fixed bottom-4 right-4 lg:right-80 md:bottom-8 inline-flex items-center gap-2 rounded-full border border-border bg-white/90 backdrop-blur px-3 py-2 text-sm text-ink shadow-soft hover:border-accent hover:text-accent transition-colors duration-150"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={labels.common.scrollToTop}
      >
        ↑ {labels.common.scrollToTop}
      </button>
    </>
  )
}

export default PostDetail
