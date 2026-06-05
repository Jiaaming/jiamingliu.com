const TagFilter = ({ tags, activeTag, onSelect, allLabel }) => (
  <div className="flex flex-wrap gap-2">
    <button
      className={`px-3 py-1 rounded-md border text-sm transition-colors duration-150 ${
        !activeTag
          ? 'bg-ink text-white border-ink shadow-sm'
          : 'border-border bg-panel text-muted hover:border-accent hover:text-accent'
      }`}
      onClick={() => onSelect(null)}
    >
      {allLabel}
    </button>
    {tags.map((tag) => (
      <button
        key={tag.name}
        className={`px-3 py-1 rounded-md border text-sm transition-colors duration-150 ${
          activeTag === tag.name
            ? 'bg-ink text-white border-ink shadow-sm'
            : 'border-border bg-panel text-muted hover:border-accent hover:text-accent'
        }`}
        onClick={() => onSelect(tag.name)}
      >
        {tag.name} <span className="text-xs opacity-70 ml-1">{tag.count}</span>
      </button>
    ))}
  </div>
)

export default TagFilter
