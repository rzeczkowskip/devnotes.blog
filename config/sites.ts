import { Site, SiteConfig } from '@/types/SiteConfig';

const pl: Site = {
  title: 'Notatki Deva',
  contentDir: 'content/pl',
  nav: [
    { url: '/', label: 'Blog' },
    { url: '/o-mnie', label: 'O mnie' },
  ],
  taxonomyCollections: {
    categories: '/kategorie',
    tags: '/tagi',
  },
};

const en: Site = {
  title: 'Dev Notes',
  contentDir: 'content/en',
  nav: [
    { url: '/', label: 'Blog' },
    { url: '/about-me', label: 'About me' },
  ],
  taxonomyCollections: {
    categories: '/categories',
    tags: '/tags',
  },
};

export default {
  sites: {
    default: pl,
    en,
  },
} as SiteConfig;
