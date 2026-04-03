import { useEffect } from 'react';

const BASE_TITLE = 'Prostanone | Premium Prostate Health';

/**
 * Sets the browser tab title to `{title} | {suffix}` while the component
 * is mounted, then restores the default site title on unmount.
 *
 * Pass `undefined` to skip setting a title (useful before async data loads).
 *
 * @param title  - Page-specific title. If omitted, no change is made.
 * @param suffix - Text after the separator. Defaults to 'Prostanone'.
 *
 * @example
 * // Static page
 * useDynamicTitle('About Us');
 * // -> "About Us | Prostanone"
 *
 * // Dynamic page (post data arrives asynchronously)
 * useDynamicTitle(post?.title, 'Prostanone Blog');
 * // -> "Article Title | Prostanone Blog"
 */
export function useDynamicTitle(title?: string, suffix = 'Prostanone'): void {
  useEffect(() => {
    if (!title) return;
    document.title = title + ' | ' + suffix;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, suffix]);
}
