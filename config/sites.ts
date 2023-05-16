import { Site, SiteConfig } from '@/types/SiteConfig';

const itemsPerPage = 10;
const baseUrl = process.env.VERCEL_URL || `http://localhost:${process.env.PORT || 3000}`;

const pl: Site = {
  title: 'Notatki Deva',
  baseUrl,
  contentDir: 'content/pl',
  nav: [
    { url: '/', label: 'Blog' },
    { url: '/o-mnie', label: 'O mnie' },
  ],
  taxonomyCollections: {
    categories: '/kategorie',
    tags: '/tagi',
  },
  pagination: {
    pageUrlPart: 'strona',
    itemsPerPage,
  },
};

const en: Site = {
  title: 'Dev Notes',
  baseUrl,
  contentDir: 'content/en',
  nav: [
    { url: '/', label: 'Blog' },
    { url: '/about-me', label: 'About me' },
  ],
  taxonomyCollections: {
    categories: '/categories',
    tags: '/tags',
  },
  pagination: {
    pageUrlPart: 'page',
    itemsPerPage,
  },
};

export default {
  sites: {
    default: pl,
    en,
  },
} as SiteConfig;
