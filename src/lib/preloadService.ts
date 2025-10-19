// Preload Service for RentSight PWA

interface PreloadOptions {
  priority?: 'high' | 'medium' | 'low';
  type?: 'script' | 'style' | 'image' | 'font' | 'fetch';
  crossorigin?: 'anonymous' | 'use-credentials';
  as?: string;
  media?: string;
}

interface PreloadResource {
  href: string;
  options: PreloadOptions;
}

class PreloadService {
  private preloadedResources = new Set<string>();
  private criticalResources: PreloadResource[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeCriticalResources();
  }

  private initializeCriticalResources(): void {
    // Critical CSS and fonts
    this.criticalResources = [
      {
        href: '/globals.css',
        options: { type: 'style', priority: 'high' },
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        options: { type: 'style', priority: 'high', crossorigin: 'anonymous' },
      },
      {
        href: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
        options: { type: 'font', priority: 'high', crossorigin: 'anonymous', as: 'font' },
      },
    ];

    // Critical JavaScript modules
    this.addCriticalScript('/_next/static/chunks/framework.js');
    this.addCriticalScript('/_next/static/chunks/main.js');
    this.addCriticalScript('/_next/static/chunks/webpack.js');
  }

  private addCriticalScript(href: string): void {
    this.criticalResources.push({
      href,
      options: { type: 'script', priority: 'high' },
    });
  }

  /**
   * Initialize preloading service
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;
    this.preloadCriticalResources();
    this.setupIntersectionObserver();
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    this.criticalResources.forEach((resource) => {
      this.preloadResource(resource.href, resource.options);
    });
  }

  /**
   * Preload a single resource
   */
  preloadResource(href: string, options: PreloadOptions = {}): void {
    if (this.preloadedResources.has(href)) return;

    const { priority = 'medium', type = 'fetch', crossorigin, as, media } = options;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as || this.getDefaultAs(type);

    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }

    if (media) {
      link.media = media;
    }

    // Add priority hint
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    } else if (priority === 'low') {
      link.setAttribute('fetchpriority', 'low');
    }

    // Add to document head
    document.head.appendChild(link);
    this.preloadedResources.add(href);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Preloaded: ${href} (${type}, ${priority})`);
    }
  }

  /**
   * Get default 'as' attribute for resource type
   */
  private getDefaultAs(type: string): string {
    switch (type) {
      case 'script':
        return 'script';
      case 'style':
        return 'style';
      case 'image':
        return 'image';
      case 'font':
        return 'font';
      case 'fetch':
        return 'fetch';
      default:
        return 'fetch';
    }
  }

  /**
   * Preload API endpoint
   */
  preloadAPI(endpoint: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${window.location.origin}${endpoint}`;
    this.preloadResource(fullUrl, { type: 'fetch', priority });
  }

  /**
   * Preload page route
   */
  preloadRoute(route: string, priority: 'high' | 'medium' | 'low' = 'low'): void {
    const fullUrl = `${window.location.origin}${route}`;
    this.preloadResource(fullUrl, { type: 'fetch', priority });
  }

  /**
   * Preload image
   */
  preloadImage(src: string, priority: 'high' | 'medium' | 'low' = 'low'): void {
    this.preloadResource(src, { type: 'image', priority });
  }

  /**
   * Preload font
   */
  preloadFont(href: string, priority: 'high' | 'medium' | 'low' = 'high'): void {
    this.preloadResource(href, {
      type: 'font',
      priority,
      crossorigin: 'anonymous',
      as: 'font',
    });
  }

  /**
   * Preload script
   */
  preloadScript(src: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    this.preloadResource(src, { type: 'script', priority });
  }

  /**
   * Setup intersection observer for lazy preloading
   */
  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const href = element.getAttribute('data-preload-href');
            const type = element.getAttribute('data-preload-type') as PreloadOptions['type'];
            const priority = element.getAttribute(
              'data-preload-priority',
            ) as PreloadOptions['priority'];

            if (href) {
              this.preloadResource(href, { type, priority });
              observer.unobserve(element);
            }
          }
        });
      },
      { rootMargin: '50px' },
    );

    // Observe elements with preload attributes
    document.addEventListener('DOMContentLoaded', () => {
      const preloadElements = document.querySelectorAll('[data-preload-href]');
      preloadElements.forEach((element) => observer.observe(element));
    });
  }

  /**
   * Preload resources based on user behavior
   */
  preloadOnHover(element: HTMLElement, resources: PreloadResource[]): void {
    let hasPreloaded = false;

    const handleMouseEnter = () => {
      if (hasPreloaded) return;

      resources.forEach((resource) => {
        this.preloadResource(resource.href, resource.options);
      });

      hasPreloaded = true;
      element.removeEventListener('mouseenter', handleMouseEnter);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
  }

  /**
   * Preload resources based on user interaction
   */
  preloadOnInteraction(element: HTMLElement, resources: PreloadResource[]): void {
    let hasPreloaded = false;

    const handleInteraction = () => {
      if (hasPreloaded) return;

      resources.forEach((resource) => {
        this.preloadResource(resource.href, resource.options);
      });

      hasPreloaded = true;
      element.removeEventListener('click', handleInteraction);
      element.removeEventListener('touchstart', handleInteraction);
    };

    element.addEventListener('click', handleInteraction);
    element.addEventListener('touchstart', handleInteraction);
  }

  /**
   * Preload dashboard components
   */
  preloadDashboardComponents(): void {
    // Preload critical dashboard APIs
    this.preloadAPI('/api/properties', 'high');
    this.preloadAPI('/api/analytics/summary', 'medium');
    this.preloadAPI('/api/reports/generate', 'low');
  }

  /**
   * Preload property-related resources
   */
  preloadPropertyResources(): void {
    this.preloadAPI('/api/properties', 'high');
    this.preloadAPI('/api/rent_entries', 'medium');
    this.preloadAPI('/api/expense_entries', 'medium');
  }

  /**
   * Preload reports resources
   */
  preloadReportsResources(): void {
    this.preloadAPI('/api/reports/generate', 'high');
    this.preloadAPI('/api/analytics/export', 'medium');
  }

  /**
   * Check if resource is already preloaded
   */
  isPreloaded(href: string): boolean {
    return this.preloadedResources.has(href);
  }

  /**
   * Get preloaded resources count
   */
  getPreloadedCount(): number {
    return this.preloadedResources.size;
  }

  /**
   * Clear preloaded resources (for testing)
   */
  clearPreloaded(): void {
    this.preloadedResources.clear();
  }
}

// Create singleton instance
export const preloadService = new PreloadService();

// Export convenience functions
export const preloadResource = (href: string, options?: PreloadOptions) =>
  preloadService.preloadResource(href, options);

export const preloadAPI = (endpoint: string, priority?: 'high' | 'medium' | 'low') =>
  preloadService.preloadAPI(endpoint, priority);

export const preloadRoute = (route: string, priority?: 'high' | 'medium' | 'low') =>
  preloadService.preloadRoute(route, priority);

export const preloadImage = (src: string, priority?: 'high' | 'medium' | 'low') =>
  preloadService.preloadImage(src, priority);

export const preloadFont = (href: string, priority?: 'high' | 'medium' | 'low') =>
  preloadService.preloadFont(href, priority);

export const preloadScript = (src: string, priority?: 'high' | 'medium' | 'low') =>
  preloadService.preloadScript(src, priority);

export const initializePreloading = () => preloadService.initialize();
export const preloadDashboardComponents = () => preloadService.preloadDashboardComponents();
export const preloadPropertyResources = () => preloadService.preloadPropertyResources();
export const preloadReportsResources = () => preloadService.preloadReportsResources();
