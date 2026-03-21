import EleventyFetch from '@11ty/eleventy-fetch';

const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|svg|avif|ico|bmp|tiff?)(\?.*)?$/i;

export function isInternalUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === 'flohgro.com' || hostname.endsWith('.flohgro.com');
  } catch {
    return false;
  }
}

export function isImageUrl(url) {
  try {
    return IMAGE_EXTS.test(new URL(url).pathname);
  } catch {
    return IMAGE_EXTS.test(url);
  }
}

export async function fetchOgData(url) {
  let domain;
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    domain = url;
  }

  try {
    const raw = await EleventyFetch(url, {
      duration: '30d',
      type: 'text',
      fetchOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Eleventy-LinkPreview/1.0)',
        },
      },
    });
    const html = typeof raw === 'string' ? raw : raw.toString('utf-8');

    const getOg = (prop) => {
      const m = html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${prop}["']`, 'i'));
      return m ? decode(m[1]) : null;
    };

    const getMeta = (name) => {
      const m = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
      return m ? decode(m[1]) : null;
    };

    let title = getOg('og:title');
    if (!title) {
      const tm = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      title = tm ? decode(tm[1].trim()) : null;
    }

    let description = getOg('og:description') || getMeta('description');
    let image = getOg('og:image');

    // Resolve relative og:image URLs
    if (image && !image.startsWith('http')) {
      try { image = new URL(image, url).href; } catch {}
    }

    return { title, description, image, domain };
  } catch (err) {
    console.warn(`[link-preview] Failed to fetch ${url}: ${err.message}`);
    return { title: null, description: null, image: null, domain };
  }
}

function decode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function esc(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderPreviewCard(url, og) {
  if (!og) og = {};
  const title = og.title || og.domain || url;
  const desc = og.description
    ? `<span class="link-preview-desc">${esc(og.description)}</span>` : '';
  const img = og.image
    ? `<img src="${esc(og.image)}" alt="" class="link-preview-img" loading="lazy">` : '';
  const domain = og.domain || '';

  return `<a href="${esc(url)}" class="link-preview-card" target="_blank" rel="noopener noreferrer">
  ${img}
  <span class="link-preview-text">
    <span class="link-preview-title">${esc(title)}</span>
    ${desc}
    <span class="link-preview-domain">${esc(domain)}</span>
  </span>
</a>`;
}
