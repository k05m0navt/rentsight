'use client';

import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  memoryUsage?: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0,
    memoryUsage: 0,
  });

  const [isSupported, setIsSupported] = useState(false);

  const measureLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (navigation) {
        return navigation.loadEventEnd - navigation.fetchStart;
      }
    }
    return 0;
  }, []);

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory; // eslint-disable-line @typescript-eslint/no-explicit-any
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  const measureCoreWebVitals = useCallback(() => {
    const newMetrics: Partial<PerformanceMetrics> = {};

    // First Contentful Paint (FCP)
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      newMetrics.firstContentfulPaint = (fcpEntry as any).startTime; // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    // Largest Contentful Paint (LCP)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lcp = lcpEntries[lcpEntries.length - 1] as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      newMetrics.largestContentfulPaint = lcp.startTime;
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsEntries: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value; // eslint-disable-line @typescript-eslint/no-explicit-any
            clsEntries.push(entry);
          }
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      newMetrics.cumulativeLayoutShift = clsValue;
    } catch (error) {
      console.warn('CLS measurement not supported:', error);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          newMetrics.firstInputDelay = (entry as any).processingStart - entry.startTime; // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID measurement not supported:', error);
    }

    return newMetrics;
  }, []);

  const measureTimeToInteractive = useCallback(() => {
    // Simplified TTI measurement
    const navigation = performance.getEntriesByType('navigation')[0] as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (navigation) {
      return navigation.domInteractive - navigation.fetchStart;
    }
    return 0;
  }, []);

  const collectMetrics = useCallback(() => {
    const loadTime = measureLoadTime();
    const memoryUsage = measureMemoryUsage();
    const coreWebVitals = measureCoreWebVitals();
    const timeToInteractive = measureTimeToInteractive();

    setMetrics((prev) => ({
      ...prev,
      loadTime,
      timeToInteractive,
      memoryUsage: memoryUsage?.used || 0,
      ...coreWebVitals,
    }));
  }, [measureLoadTime, measureMemoryUsage, measureCoreWebVitals, measureTimeToInteractive]);

  const logMetrics = useCallback(() => {
    console.group('🚀 Performance Metrics');
    console.log('📊 Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
    console.log('🎨 First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log('🖼️ Largest Contentful Paint:', `${metrics.largestContentfulPaint.toFixed(2)}ms`);
    console.log('⚡ First Input Delay:', `${metrics.firstInputDelay.toFixed(2)}ms`);
    console.log('📐 Cumulative Layout Shift:', metrics.cumulativeLayoutShift.toFixed(4));
    console.log('🔧 Time to Interactive:', `${metrics.timeToInteractive.toFixed(2)}ms`);

    if (metrics.memoryUsage) {
      console.log('💾 Memory Usage:', `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }

    console.groupEnd();
  }, [metrics]);

  const getPerformanceScore = useCallback(() => {
    let score = 100;

    // FCP scoring (good: <1.8s, needs improvement: 1.8s-3s, poor: >3s)
    if (metrics.firstContentfulPaint > 3000) score -= 30;
    else if (metrics.firstContentfulPaint > 1800) score -= 15;

    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (metrics.largestContentfulPaint > 4000) score -= 30;
    else if (metrics.largestContentfulPaint > 2500) score -= 15;

    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (metrics.firstInputDelay > 300) score -= 20;
    else if (metrics.firstInputDelay > 100) score -= 10;

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.cumulativeLayoutShift > 0.25) score -= 20;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 10;

    return Math.max(0, score);
  }, [metrics]);

  const isPerformanceGood = useCallback(() => {
    return (
      metrics.firstContentfulPaint < 1800 &&
      metrics.largestContentfulPaint < 2500 &&
      metrics.firstInputDelay < 100 &&
      metrics.cumulativeLayoutShift < 0.1
    );
  }, [metrics]);

  useEffect(() => {
    // Check if Performance API is supported
    const supported = typeof window !== 'undefined' && 'performance' in window;
    setIsSupported(supported);

    if (supported) {
      // Initial measurement
      const timer = setTimeout(() => {
        collectMetrics();
      }, 1000);

      // Measure again after page is fully loaded
      const handleLoad = () => {
        setTimeout(() => {
          collectMetrics();
        }, 100);
      };

      window.addEventListener('load', handleLoad);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [collectMetrics]);

  return {
    metrics,
    isSupported,
    collectMetrics,
    logMetrics,
    getPerformanceScore,
    isPerformanceGood,
    measureMemoryUsage,
  };
};

// Hook for measuring specific operations
export const usePerformanceTimer = () => {
  const [timings, setTimings] = useState<Record<string, number>>({});

  const startTimer = useCallback((name: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      setTimings((prev) => ({ ...prev, [name]: duration }));
      return duration;
    };
  }, []);

  const measureAsync = useCallback(
    async <T>(name: string, operation: () => Promise<T>): Promise<T> => {
      const endTimer = startTimer(name);
      try {
        const result = await operation();
        endTimer();
        return result;
      } catch (error) {
        endTimer();
        throw error;
      }
    },
    [startTimer],
  );

  const measureSync = useCallback(
    <T>(name: string, operation: () => T): T => {
      const endTimer = startTimer(name);
      try {
        const result = operation();
        endTimer();
        return result;
      } catch (error) {
        endTimer();
        throw error;
      }
    },
    [startTimer],
  );

  const clearTimings = useCallback(() => {
    setTimings({});
  }, []);

  const logTimings = useCallback(() => {
    console.group('⏱️ Performance Timings');
    Object.entries(timings).forEach(([name, duration]) => {
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    });
    console.groupEnd();
  }, [timings]);

  return {
    timings,
    startTimer,
    measureAsync,
    measureSync,
    clearTimings,
    logTimings,
  };
};
