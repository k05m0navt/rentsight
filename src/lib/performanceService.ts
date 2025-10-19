// Performance Service for RentSight PWA

interface PerformanceData {
  timestamp: number;
  url: string;
  userAgent: string;
  metrics: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
    memoryUsage?: number;
  };
  customMetrics: Record<string, number>;
  errors: string[];
}

interface PerformanceReport {
  sessionId: string;
  userId?: string;
  data: PerformanceData[];
  summary: {
    averageLoadTime: number;
    averageFCP: number;
    averageLCP: number;
    averageFID: number;
    averageCLS: number;
    performanceScore: number;
    errorCount: number;
  };
}

class PerformanceService {
  private sessionId: string;
  private data: PerformanceData[] = [];
  private customMetrics: Record<string, number> = {};
  private errors: string[] = [];
  private isEnabled = true;
  private maxDataPoints = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
  }

  private generateSessionId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver(): void {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    this.observeNavigationTiming();

    // Observe resource timing
    this.observeResourceTiming();

    // Observe errors
    this.observeErrors();

    // Observe memory usage (if available)
    this.observeMemoryUsage();
  }

  private observeNavigationTiming(): void {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.addMetric('navigation.loadTime', navigation.loadEventEnd - navigation.fetchStart);
        this.addMetric(
          'navigation.domContentLoaded',
          navigation.domContentLoadedEventEnd - navigation.fetchStart,
        );
        this.addMetric('navigation.domComplete', navigation.domComplete - navigation.fetchStart);
        this.addMetric('navigation.firstByte', navigation.responseStart - navigation.fetchStart);
      }
    }
  }

  private observeResourceTiming(): void {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      resources.forEach((resource: PerformanceResourceTiming) => {
        const duration = resource.responseEnd - resource.startTime;
        this.addMetric(`resource.${resource.name.split('/').pop()}`, duration);
      });
    }
  }

  private observeErrors(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.addError(`JavaScript Error: ${event.message} at ${event.filename}:${event.lineno}`);
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.addError(`Unhandled Promise Rejection: ${event.reason}`);
      });
    }
  }

  private observeMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory; // eslint-disable-line @typescript-eslint/no-explicit-any
      this.addMetric('memory.used', memory.usedJSHeapSize);
      this.addMetric('memory.total', memory.totalJSHeapSize);
      this.addMetric('memory.limit', memory.jsHeapSizeLimit);
    }
  }

  /**
   * Add a custom performance metric
   */
  addMetric(name: string, value: number): void {
    if (!this.isEnabled) return;

    this.customMetrics[name] = value;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric: ${name} = ${value.toFixed(2)}ms`);
    }
  }

  /**
   * Add an error to the performance data
   */
  addError(error: string): void {
    if (!this.isEnabled) return;

    this.errors.push(error);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 Performance Error: ${error}`);
    }
  }

  /**
   * Record performance data for the current page
   */
  recordPagePerformance(metrics: PerformanceData['metrics']): void {
    if (!this.isEnabled) return;

    const data: PerformanceData = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics,
      customMetrics: { ...this.customMetrics },
      errors: [...this.errors],
    };

    this.data.push(data);

    // Keep only the last N data points
    if (this.data.length > this.maxDataPoints) {
      this.data = this.data.slice(-this.maxDataPoints);
    }

    // Clear current metrics for next page
    this.customMetrics = {};
    this.errors = [];

    // Log summary in development
    if (process.env.NODE_ENV === 'development') {
      this.logPagePerformance(data);
    }
  }

  /**
   * Log page performance data to console
   */
  private logPagePerformance(data: PerformanceData): void {
    console.group('🚀 Page Performance Report');
    console.log('📄 URL:', data.url);
    console.log('⏱️ Load Time:', `${data.metrics.loadTime.toFixed(2)}ms`);
    console.log('🎨 FCP:', `${data.metrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log('🖼️ LCP:', `${data.metrics.largestContentfulPaint.toFixed(2)}ms`);
    console.log('⚡ FID:', `${data.metrics.firstInputDelay.toFixed(2)}ms`);
    console.log('📐 CLS:', data.metrics.cumulativeLayoutShift.toFixed(4));
    console.log('🔧 TTI:', `${data.metrics.timeToInteractive.toFixed(2)}ms`);

    if (data.metrics.memoryUsage) {
      console.log('💾 Memory:', `${(data.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }

    if (Object.keys(data.customMetrics).length > 0) {
      console.log('📊 Custom Metrics:', data.customMetrics);
    }

    if (data.errors.length > 0) {
      console.log('🚨 Errors:', data.errors);
    }

    console.groupEnd();
  }

  /**
   * Generate performance report
   */
  generateReport(userId?: string): PerformanceReport {
    const summary = this.calculateSummary();

    return {
      sessionId: this.sessionId,
      userId,
      data: [...this.data],
      summary,
    };
  }

  /**
   * Calculate performance summary
   */
  private calculateSummary() {
    if (this.data.length === 0) {
      return {
        averageLoadTime: 0,
        averageFCP: 0,
        averageLCP: 0,
        averageFID: 0,
        averageCLS: 0,
        performanceScore: 0,
        errorCount: 0,
      };
    }

    const totals = this.data.reduce(
      (acc, data) => ({
        loadTime: acc.loadTime + data.metrics.loadTime,
        fcp: acc.fcp + data.metrics.firstContentfulPaint,
        lcp: acc.lcp + data.metrics.largestContentfulPaint,
        fid: acc.fid + data.metrics.firstInputDelay,
        cls: acc.cls + data.metrics.cumulativeLayoutShift,
        errors: acc.errors + data.errors.length,
      }),
      { loadTime: 0, fcp: 0, lcp: 0, fid: 0, cls: 0, errors: 0 },
    );

    const count = this.data.length;
    const averageLoadTime = totals.loadTime / count;
    const averageFCP = totals.fcp / count;
    const averageLCP = totals.lcp / count;
    const averageFID = totals.fid / count;
    const averageCLS = totals.cls / count;

    // Calculate performance score (0-100)
    let score = 100;

    if (averageFCP > 3000) score -= 30;
    else if (averageFCP > 1800) score -= 15;

    if (averageLCP > 4000) score -= 30;
    else if (averageLCP > 2500) score -= 15;

    if (averageFID > 300) score -= 20;
    else if (averageFID > 100) score -= 10;

    if (averageCLS > 0.25) score -= 20;
    else if (averageCLS > 0.1) score -= 10;

    // Deduct points for errors
    score -= Math.min(totals.errors * 2, 20);

    return {
      averageLoadTime,
      averageFCP,
      averageLCP,
      averageFID,
      averageCLS,
      performanceScore: Math.max(0, score),
      errorCount: totals.errors,
    };
  }

  /**
   * Send performance data to analytics service
   */
  async sendToAnalytics(userId?: string): Promise<void> {
    try {
      const report = this.generateReport(userId);

      // In a real implementation, you would send this to your analytics service
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Performance Report:', report);
      }

      // Example: Send to API endpoint
      // await fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report),
      // });
    } catch (error) {
      console.error('Failed to send performance data:', error);
    }
  }

  /**
   * Clear all performance data
   */
  clearData(): void {
    this.data = [];
    this.customMetrics = {};
    this.errors = [];
  }

  /**
   * Enable/disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Get current performance data
   */
  getData(): PerformanceData[] {
    return [...this.data];
  }

  /**
   * Get performance summary
   */
  getSummary() {
    return this.calculateSummary();
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    const summary = this.calculateSummary();
    return (
      summary.averageFCP < 1800 &&
      summary.averageLCP < 2500 &&
      summary.averageFID < 100 &&
      summary.averageCLS < 0.1 &&
      summary.errorCount === 0
    );
  }
}

// Create singleton instance
export const performanceService = new PerformanceService();

// Export convenience functions
export const addPerformanceMetric = (name: string, value: number) =>
  performanceService.addMetric(name, value);
export const addPerformanceError = (error: string) => performanceService.addError(error);
export const recordPagePerformance = (metrics: PerformanceData['metrics']) =>
  performanceService.recordPagePerformance(metrics);
export const generatePerformanceReport = (userId?: string) =>
  performanceService.generateReport(userId);
export const sendPerformanceToAnalytics = (userId?: string) =>
  performanceService.sendToAnalytics(userId);
export const clearPerformanceData = () => performanceService.clearData();
export const setPerformanceMonitoring = (enabled: boolean) =>
  performanceService.setEnabled(enabled);
export const getPerformanceData = () => performanceService.getData();
export const getPerformanceSummary = () => performanceService.getSummary();
export const isPerformanceGood = () => performanceService.isPerformanceGood();
