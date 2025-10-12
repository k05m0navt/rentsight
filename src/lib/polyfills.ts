/**
 * Polyfills for IE11 and older browsers
 *
 * This file provides polyfills for modern browser APIs that are not available
 * in IE11 or older Edge versions. These polyfills ensure the redesigned
 * application functions correctly across enterprise browsers.
 *
 * Note: Core polyfills (Promise, fetch) are handled by Next.js automatically.
 * This file provides additional polyfills for intersection and resize observers.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ResizeObserver polyfill (if not available)
// Used for responsive components and virtualization
if (typeof window !== 'undefined' && typeof ResizeObserver === 'undefined') {
  (window as any).ResizeObserver = class ResizeObserver {
    private callback: ResizeObserverCallback;
    private resizeHandler: () => void;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      // Fallback: use window resize event
      this.resizeHandler = () => {
        this.callback([], this);
      };
      window.addEventListener('resize', this.resizeHandler);
    }

    observe() {
      // Trigger initial callback
      setTimeout(() => this.callback([], this), 0);
    }

    unobserve() {
      // No-op in polyfill
    }

    disconnect() {
      window.removeEventListener('resize', this.resizeHandler);
    }
  };
}

// IntersectionObserver polyfill (if not available)
// Used for lazy loading images and content
if (typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined') {
  (window as any).IntersectionObserver = class IntersectionObserver {
    private callback: IntersectionObserverCallback;
    root: Element | Document | null = null;
    rootMargin: string = '0px';
    thresholds: ReadonlyArray<number> = [0];

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element) {
      // Fallback: assume everything is visible immediately
      setTimeout(() => {
        this.callback(
          [
            {
              target,
              isIntersecting: true,
              intersectionRatio: 1,
            } as IntersectionObserverEntry,
          ],
          this as any,
        );
      }, 0);
    }

    unobserve() {
      // No-op in polyfill
    }

    disconnect() {
      // No-op in polyfill
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// Export empty object to make this a module
export {};
