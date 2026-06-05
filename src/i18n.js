export const DEFAULT_LOCALE = 'zh'
export const LOCALE_STORAGE_KEY = 'blog-locale'
export const SUPPORTED_LOCALES = ['zh', 'en']

export const translations = {
  zh: {
    nav: {
      about: 'about',
      posts: 'posts',
      tags: 'tags',
    },
    localeToggle: {
      label: 'english',
      ariaLabel: 'Switch to English',
    },
    common: {
      all: '全部',
      outline: '目录',
      backToPosts: '返回文章',
      postNotFound: '文章未找到。',
      scrollToTop: '返回顶部',
      fallbackNotice: '这篇文章暂时还没有英文版本，当前显示的是中文原文。',
    },
    tags: {
      allPosts: (count) => `全部文章 (${count})`,
      postsTagged: (tag, count) => `标签 “${tag}” (${count})`,
    },
    about: {
      avatarAlt: '头像',
    },
  },
  en: {
    nav: {
      about: 'about',
      posts: 'posts',
      tags: 'tags',
    },
    localeToggle: {
      label: '中文',
      ariaLabel: 'Switch to Chinese',
    },
    common: {
      all: 'All',
      outline: 'Outline',
      backToPosts: 'Back to posts',
      postNotFound: 'Post not found.',
      scrollToTop: 'Back to top',
      fallbackNotice: 'This post has not been translated yet, so the Chinese version is shown.',
    },
    tags: {
      allPosts: (count) => `All posts (${count})`,
      postsTagged: (tag, count) => `Posts tagged "${tag}" (${count})`,
    },
    about: {
      avatarAlt: 'Portrait',
    },
  },
}
