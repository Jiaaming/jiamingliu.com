import { Link } from 'react-router-dom'
import navItems from '../config/navItems'

const toggleLocale = (locale, onLocaleChange) => {
  onLocaleChange(locale === 'zh' ? 'en' : 'zh')
}

const LanguageSwitch = ({ locale, onLocaleChange, labels, className = '' }) => (
  <button
    type="button"
    className={className}
    onClick={() => toggleLocale(locale, onLocaleChange)}
    aria-label={labels.localeToggle.ariaLabel}
  >
    {labels.localeToggle.label}
  </button>
)

export const Sidebar = ({ currentPath, locale, onLocaleChange, labels }) => (
  <aside className="hidden md:flex flex-col gap-2 w-32 pt-4">
    {navItems.map((item) => {
      const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
      return (
        <Link key={item.key} to={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
          {labels.nav[item.key]}
        </Link>
      )
    })}
    <LanguageSwitch
      locale={locale}
      onLocaleChange={onLocaleChange}
      labels={labels}
      className="sidebar-link mt-2 w-fit appearance-none border-0 bg-transparent p-0 text-left cursor-pointer"
    />
  </aside>
)

export const MobileNav = ({ currentPath, locale, onLocaleChange, labels }) => (
  <div className="md:hidden flex flex-wrap items-center gap-2 mb-4">
    {navItems.map((item) => {
      const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
      return (
        <Link
          key={item.key}
          to={item.path}
          className={`px-3 py-1 rounded-md border text-sm ${
            isActive ? 'bg-ink text-white border-ink' : 'border-border bg-white text-muted'
          }`}
        >
          {labels.nav[item.key]}
        </Link>
      )
    })}
    <LanguageSwitch
      locale={locale}
      onLocaleChange={onLocaleChange}
      labels={labels}
      className="px-3 py-1 rounded-md border border-border bg-white text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
    />
  </div>
)

export default Sidebar
