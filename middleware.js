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
  },
};

const CRAWLER_UA = /linkedinbot|twitterbot|facebookexternalhit|slackbot|discordbot|telegrambot|whatsapp|googlebot|bingbot|yandexbot|duckduckbot/i;

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!CRAWLER_UA.test(ua)) return;

  const url = new URL(request.url);
  const page = PAGES[url.pathname] || PAGES['/'];
  const canonical = `https://yasiru.elfbane.com${url.pathname}`;

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
