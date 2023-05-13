import { Site } from '@/types/SiteConfig';

export default {
  default: {
    title: 'Notatki Deva',
    contentPath: 'pl',
    locale: 'pl',
    nav: [
      { label: 'Blog', url: '/' },
      { label: 'Kategorie', url: '/kategorie' },
      { label: 'O mnie', url: '/o-mnie' },
    ],
    routingPrefixes: {
      categories: '/kategorie',
      tags: '/tagi',
      posts: '/posty',
    },
  },
  en: {
    title: 'Dev Notes',
    contentPath: 'en',
    locale: 'en',
    nav: [
      { label: 'Blog', url: '/' },
      { label: 'Categories', url: '/categories' },
      { label: 'About me', url: '/about-me' },
    ],
    routingPrefixes: {
      categories: '/categories',
      tags: '/tags',
      posts: '/posts',
    },
  },
} as Record<'default' | string, Site>;
