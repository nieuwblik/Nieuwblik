/**
 * Performance monitoring utilities
 * Track and log Core Web Vitals metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Log Core Web Vitals to console (in development)
 */
export const logWebVitals = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // First Contentful Paint (FCP)
  const fcpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fcp = entry.startTime;
      console.log(`FCP: ${fcp.toFixed(2)}ms`, getRating('FCP', fcp));
    }
  });

  try {
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // Not supported
  }

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcp = lastEntry.startTime;
    console.log(`LCP: ${lcp.toFixed(2)}ms`, getRating('LCP', lcp));
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // Not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        console.log(`CLS: ${clsValue.toFixed(4)}`, getRating('CLS', clsValue));
      }
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fid = (entry as any).processingStart - entry.startTime;
      console.log(`FID: ${fid.toFixed(2)}ms`, getRating('FID', fid));
    }
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // Not supported
  }
};

/**
 * Get performance rating based on metric thresholds
 */
function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
  };

  const threshold = thresholds[metric];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report to analytics (placeholder - integrate with your analytics service)
 */
export const reportWebVitals = (metric: PerformanceMetric) => {
  // Example: send to Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     metric_rating: metric.rating,
  //   });
  // }
  
  // For now, just log in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, `(${metric.rating})`);
  }
};
