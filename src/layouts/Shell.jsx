import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MobileNav, Sidebar } from '../components/Nav'

const Shell = ({ posts, locale, onLocaleChange, labels }) => {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen px-4 md:px-10 py-6 md:py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[140px,1px,1fr] gap-6 md:gap-12 items-start">
        <Sidebar currentPath={location.pathname} locale={locale} onLocaleChange={onLocaleChange} labels={labels} />
        <div className="hidden md:block w-px bg-border min-h-screen translate-x-[-1px]" aria-hidden="true" />
        <main className="space-y-6">
          <MobileNav currentPath={location.pathname} locale={locale} onLocaleChange={onLocaleChange} labels={labels} />
          <Outlet context={{ posts, locale, labels }} />
        </main>
      </div>
    </div>
  )
}

export default Shell
