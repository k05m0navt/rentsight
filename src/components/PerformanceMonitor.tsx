'use client';

import { useEffect, useRef } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import { recordPagePerformance, addPerformanceMetric } from '@/lib/performanceService';

interface PerformanceMonitorProps {
  pageName: string;
  userId?: string;
  enableLogging?: boolean;
  enableAnalytics?: boolean;
}

export const PerformanceMonitor = ({
  pageName,
  userId,
  enableLogging = process.env.NODE_ENV === 'development',
  enableAnalytics = true,
}: PerformanceMonitorProps) => {
  const { metrics, isSupported, logMetrics } = usePerformance();
  const hasRecorded = useRef(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!isSupported) return;

    // Record initial page load metrics
    const recordMetrics = () => {
      if (hasRecorded.current) return;
      hasRecorded.current = true;

      const pageLoadTime = Date.now() - startTime.current;
      addPerformanceMetric(`${pageName}.pageLoadTime`, pageLoadTime);

      // Record Core Web Vitals
      recordPagePerformance({
        loadTime: metrics.loadTime || pageLoadTime,
        firstContentfulPaint: metrics.firstContentfulPaint,
        largestContentfulPaint: metrics.largestContentfulPaint,
        firstInputDelay: metrics.firstInputDelay,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift,
        timeToInteractive: metrics.timeToInteractive,
        memoryUsage: metrics.memoryUsage,
      });

      if (enableLogging) {
        logMetrics();
      }

      if (enableAnalytics) {
        // Send to analytics service
        import('@/lib/performanceService').then(({ sendPerformanceToAnalytics }) => {
          sendPerformanceToAnalytics(userId);
        });
      }
    };

    // Record metrics after a short delay to ensure all metrics are collected
    const timer = setTimeout(recordMetrics, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [metrics, pageName, userId, enableLogging, enableAnalytics, isSupported, logMetrics]);

  // Monitor user interactions
  useEffect(() => {
    if (!isSupported) return;

    const interactionStartTimes = new Map<string, number>();

    const handleInteractionStart = (event: Event) => {
      const target = event.target as HTMLElement;
      const interactionType = target.tagName.toLowerCase();
      const interactionId = `${interactionType}_${Date.now()}`;

      interactionStartTimes.set(interactionId, performance.now());
      addPerformanceMetric(`${pageName}.interaction.start`, performance.now());
    };

    const handleInteractionEnd = (event: Event) => {
      const target = event.target as HTMLElement;
      const interactionType = target.tagName.toLowerCase();
      const endTime = performance.now();

      // Find the most recent interaction of this type
      const recentInteraction = Array.from(interactionStartTimes.entries())
        .filter(([key]) => key.startsWith(interactionType))
        .sort((a, b) => b[1] - a[1])[0];

      if (recentInteraction) {
        const [interactionId, startTime] = recentInteraction;
        const duration = endTime - startTime;

        addPerformanceMetric(`${pageName}.interaction.${interactionType}`, duration);
        interactionStartTimes.delete(interactionId);
      }
    };

    // Monitor clicks
    document.addEventListener('click', handleInteractionStart, true);
    document.addEventListener('click', handleInteractionEnd, true);

    // Monitor form submissions
    document.addEventListener('submit', handleInteractionStart, true);
    document.addEventListener('submit', handleInteractionEnd, true);

    // Monitor navigation
    const handleNavigation = () => {
      addPerformanceMetric(`${pageName}.navigation`, performance.now());
    };

    window.addEventListener('beforeunload', handleNavigation);

    return () => {
      document.removeEventListener('click', handleInteractionStart, true);
      document.removeEventListener('click', handleInteractionEnd, true);
      document.removeEventListener('submit', handleInteractionStart, true);
      document.removeEventListener('submit', handleInteractionEnd, true);
      window.removeEventListener('beforeunload', handleNavigation);
    };
  }, [pageName, isSupported]);

  // Monitor API calls
  useEffect(() => {
    if (!isSupported) return;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0] as string;

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        addPerformanceMetric(`${pageName}.api.${url}`, duration);

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        addPerformanceMetric(`${pageName}.api.${url}.error`, duration);

        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [pageName, isSupported]);

  // Monitor memory usage periodically
  useEffect(() => {
    if (!isSupported) return;

    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory; // eslint-disable-line @typescript-eslint/no-explicit-any
        addPerformanceMetric(`${pageName}.memory.used`, memory.usedJSHeapSize);
        addPerformanceMetric(`${pageName}.memory.total`, memory.totalJSHeapSize);
      }
    };

    const interval = setInterval(monitorMemory, 30000); // Every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [pageName, isSupported]);

  // This component doesn't render anything
  return null;
};

// Higher-order component for adding performance monitoring to pages
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  pageName: string,
  options: Omit<PerformanceMonitorProps, 'pageName'> = {},
) {
  return function WrappedComponent(props: P) {
    return (
      <>
        <PerformanceMonitor pageName={pageName} {...options} />
        <Component {...props} />
      </>
    );
  };
}

// Hook for measuring specific operations
export const useOperationTimer = (operationName: string) => {
  const startTime = useRef<number>(0);

  const start = () => {
    startTime.current = performance.now();
  };

  const end = () => {
    if (startTime.current > 0) {
      const duration = performance.now() - startTime.current;
      addPerformanceMetric(`operation.${operationName}`, duration);
      startTime.current = 0;
      return duration;
    }
    return 0;
  };

  const measure = async <T,>(operation: () => Promise<T>): Promise<T> => {
    start();
    try {
      const result = await operation();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  };

  return { start, end, measure };
};
