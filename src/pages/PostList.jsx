import { useMemo } from 'react'
import PostRow from '../components/PostRow'

const extractYear = (dateStr) => {
  if (!dateStr) return 'Unknown'
  const normalized = dateStr.toString().replace(/\./g, '-')
  const year = normalized.split('-')[0]
  return year || 'Unknown'
}

const PostList = ({ posts }) => {
  const visible = useMemo(() => {
    return posts.filter((post) => post.category === 'posts')
  }, [posts])

  const grouped = useMemo(() => {
    return visible.reduce((acc, post) => {
      const year = extractYear(post.date)
      if (!acc[year]) acc[year] = []
      acc[year].push(post)
      return acc
    }, {})
  }, [visible])

  const years = useMemo(
    () =>
      Object.keys(grouped)
        .sort((a, b) => b.localeCompare(a)),
    [grouped],
  )

  return (
    <div className="p-1 sm:p-2 border-t border-border">
      <div className="space-y-4">
        {years.map((year) => (
          <div key={year} className="space-y-2">
            <h3 className="text-base font-semibold text-ink">{year}</h3>
            <div className="divide-y divide-border">
              {grouped[year]
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList
