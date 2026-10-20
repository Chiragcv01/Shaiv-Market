// Path being rendered on the server during prerender (window is unavailable there).
let ssrPath = '/';
export const setSsrPath = (p: string) => { ssrPath = p; };
export const currentPath = () => (typeof window !== 'undefined' ? window.location.pathname : ssrPath);
