import { next } from '@vercel/edge';

const PAGES = {
  '/': {
    title: 'Yasiru — Macro-Financial Research & Sri Lankan Markets',
    description: 'Portfolio of Yasiru — macro-financial research, Sri Lankan markets, and investment analysis from Colombo.',
    image: 'https://yasiru.elfbane.com/assets/hero.jpg',
    type: 'website',
  },
  '/about': {
    title: 'About — Yasiru',
    description: 'Yasiru is a 21-year-old researcher at the DAV Lab, University of Colombo, building macro-financial models with Central Bank data.',
    image: 'https://yasiru.elfbane.com/assets/hero.jpg',
    type: 'profile',
  },
  '/blog/sri-lankan-banking-thesis': {
    title: 'The Sri Lankan Banking Thesis: A Closer Look',
    description: 'Examining the viral investment thesis around HNB and COMB on the Colombo Stock Exchange — credit expansion, low multiples, and the case for patient capital.',
    image: 'https://yasiru.elfbane.com/assets/og-banking-thesis.jpg',
    type: 'article',
    authors: ['Yasiru'],
    publishedTime: '2026-03-15T09:00:00+05:30',
  },
  '/blog/forecasting-foreign-reserves': {
    title: 'Forecasting Foreign Reserves Under a Sovereign Default: What Worked',
    description: 'A like-for-like comparison of classical, Bayesian, regime-switching, and machine-learning models on Sri Lankan reserves — MS-VAR cuts RMSE by 76.7% over a random walk, and architecture beats more data.',
    image: 'https://yasiru.elfbane.com/assets/og-forecasting-reserves.jpg',
    type: 'article',
    authors: ['Yasiru', 'Samantha Mathara Aracchi'],
    publishedTime: '2026-04-22T09:00:00+05:30',
  },
  '/blog/building-slepi': {
    title: 'How and Why I Built SLEPI',
    description: 'A first-person build note on turning CBSL external-sector releases into a live Sri Lanka External Pressure Index with freshness logic, backfilled history, and object-storage publishing.',
    image: 'https://yasiru.elfbane.com/assets/slepi-cover.svg',
    type: 'article',
    authors: ['Yasiru'],
    publishedTime: '2026-04-23T09:00:00+05:30',
  },
};

const CRAWLER_UA = /linkedinbot|twitterbot|facebookexternalhit|slackbot|discordbot|telegrambot|whatsapp/i;

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';

  if (!CRAWLER_UA.test(ua)) {
    return next();
  }

  const url = new URL(request.url);
  const page = PAGES[url.pathname] || PAGES['/'];
  const canonical = `https://yasiru.elfbane.com${url.pathname}`;

  const articleMeta = page.type === 'article'
    ? [
        page.publishedTime ? `<meta property="article:published_time" content="${page.publishedTime}" />` : '',
        ...(page.authors || []).map((a) => `<meta property="article:author" content="${a}" />`),
        ...(page.authors || []).map((a) => `<meta name="author" content="${a}" />`),
      ].filter(Boolean).join('\n  ')
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="${page.type}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${page.image}" />
  <meta property="og:site_name" content="Yasiru" />
  ${articleMeta}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  <meta name="twitter:image" content="${page.image}" />
</head>
<body></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: ['/', '/about', '/blog/:path*'],
};
