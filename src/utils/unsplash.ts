// Unsplash photos are served from Unsplash's own CDN (hotlinking is what Unsplash asks for).
export const unsplash = (id: string, w: number, h: number, fm: 'auto' | 'jpg' = 'auto') =>
  `https://images.unsplash.com/${id}?${fm === 'auto' ? 'auto=format' : 'fm=jpg'}&fit=crop&w=${w}&h=${h}&q=75`;

export const unsplashSrcSet = (id: string, w: number, h: number) =>
  [1, 2].map((k) => `${unsplash(id, w * k, h * k)} ${w * k}w`).join(', ');

/** Credit link back to the photo page, as Unsplash's guidelines suggest. */
export const unsplashCreditUrl = (link: string) => `${link}?utm_source=shaiv_market&utm_medium=referral`;
