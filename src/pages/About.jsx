import { useOutletContext } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import aboutContentEn from '../content/about.en.md?raw'
import aboutContentZh from '../content/about.md?raw'

const ABOUT_CONTENT = {
  zh: aboutContentZh,
  en: aboutContentEn,
}

const About = () => {
  const { locale, labels } = useOutletContext()
  const aboutContent = ABOUT_CONTENT[locale] ?? ABOUT_CONTENT.zh

  return (
    <div className="p-1 sm:p-2 space-y-6">
      <div className="flex flex-col items-start">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-white">
          <img
            src="avatar.jpg"
            alt={labels.about.avatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="markdown text-base leading-7">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
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
            }}
          >
            {aboutContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default About
