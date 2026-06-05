import { useMemo } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import TagFilter from '../components/TagFilter'
import PostRow from '../components/PostRow'

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-ink">{children}</h2>
)

const Tags = () => {
  const { posts, labels } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = searchParams.get('tag')

  const tags = useMemo(() => {
    const counts = posts.reduce((acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {})
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts
    return posts.filter((post) => post.tags.includes(activeTag))
  }, [activeTag, posts])

  const handleSelectTag = (tag) => {
    if (tag) {
      setSearchParams({ tag })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="mt-4">
          <TagFilter tags={tags} activeTag={activeTag} onSelect={handleSelectTag} allLabel={labels.common.all} />
        </div>
      </div>

      <div className="p-1 sm:p-2 border-t border-border">
        <SectionTitle>
          {activeTag
            ? labels.tags.postsTagged(activeTag, filteredPosts.length)
            : labels.tags.allPosts(filteredPosts.length)}
        </SectionTitle>
        <div className="mt-4 divide-y divide-border">
          {filteredPosts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tags
