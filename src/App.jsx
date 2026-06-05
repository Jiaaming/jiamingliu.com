import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shell from './layouts/Shell'
import About from './pages/About'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import Tags from './pages/Tags'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, translations } from './i18n'
import { postsByLocale } from './data/posts'

const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return SUPPORTED_LOCALES.includes(storedLocale) ? storedLocale : DEFAULT_LOCALE
}

function App() {
  const [locale, setLocale] = useState(getInitialLocale)

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const labels = translations[locale]

  const localizedPosts = useMemo(
    () => postsByLocale[locale] ?? postsByLocale[DEFAULT_LOCALE] ?? [],
    [locale],
  )

  const orderedPosts = useMemo(
    () => [...localizedPosts].sort((a, b) => b.date.localeCompare(a.date)),
    [localizedPosts],
  )

  return (
    <Routes>
      <Route
        path="/"
        element={<Shell posts={orderedPosts} locale={locale} onLocaleChange={setLocale} labels={labels} />}
      >
        <Route index element={<About />} />
        <Route path="posts" element={<PostList posts={orderedPosts} />} />
        <Route path="tags" element={<Tags />} />
        <Route path="posts/:postId" element={<PostDetail />} />
        <Route path="about" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
