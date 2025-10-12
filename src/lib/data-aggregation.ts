/**
 * Data Aggregation Utilities
 *
 * Helper functions for aggregating large datasets for visualization.
 * When rendering 10,000+ entries, charts benefit from data aggregation
 * to reduce complexity and improve rendering performance.
 *
 * Per FR-019: Efficient aggregation for enterprise-scale datasets
 */

export interface DataPoint {
  value: number;
  label?: string;
  date?: string;
}

/**
 * Aggregate data into time buckets for chart visualization
 *
 * Reduces 10,000 data points into ~100 aggregated points for smooth chart rendering
 *
 * @param data - Array of data points with values
 * @param bucketSize - Number of items per bucket (default: 100)
 * @returns Aggregated data points
 */
export function aggregateIntoBuckets<T extends { value: number }>(
  data: T[],
  bucketSize: number = 100,
): number[] {
  if (data.length === 0) return [];

  const buckets: number[] = [];
  const numBuckets = Math.ceil(data.length / bucketSize);

  for (let i = 0; i < numBuckets; i++) {
    const start = i * bucketSize;
    const end = Math.min(start + bucketSize, data.length);
    const bucketData = data.slice(start, end);
    const sum = bucketData.reduce((acc, item) => acc + item.value, 0);
    buckets.push(sum);
  }

  return buckets;
}

/**
 * Aggregate data by time period (day, week, month)
 *
 * @param data - Array with date and value
 * @param period - Time period for aggregation
 * @returns Aggregated data by period
 */
export function aggregateByTimePeriod<T extends { date: string; value: number }>(
  data: T[],
  period: 'day' | 'week' | 'month' = 'month',
): Record<string, number> {
  const aggregated: Record<string, number> = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        // Get week number
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        break;
    }

    aggregated[key] = (aggregated[key] || 0) + item.value;
  });

  return aggregated;
}

/**
 * Group data by category and sum values
 *
 * Useful for category breakdowns and pie charts
 *
 * @param data - Array with category and value
 * @returns Object with category totals
 */
export function aggregateByCategory<T extends { category: string; value: number }>(
  data: T[],
): Record<string, number> {
  const aggregated: Record<string, number> = {};

  data.forEach((item) => {
    aggregated[item.category] = (aggregated[item.category] || 0) + item.value;
  });

  return aggregated;
}

/**
 * Sample large datasets for visualization
 *
 * When you have 10,000+ points, sampling provides better performance
 * while maintaining visual accuracy
 *
 * @param data - Large dataset to sample
 * @param targetSize - Target number of points (default: 100)
 * @returns Sampled data
 */
export function sampleData<T>(data: T[], targetSize: number = 100): T[] {
  if (data.length <= targetSize) return data;

  const step = data.length / targetSize;
  const sampled: T[] = [];

  for (let i = 0; i < targetSize; i++) {
    const index = Math.floor(i * step);
    sampled.push(data[index]);
  }

  return sampled;
}

/**
 * Calculate summary statistics
 *
 * @param data - Array of numbers
 * @returns Object with sum, average, min, max, count
 */
export function calculateStats(data: number[]): {
  sum: number;
  average: number;
  min: number;
  max: number;
  count: number;
} {
  if (data.length === 0) {
    return { sum: 0, average: 0, min: 0, max: 0, count: 0 };
  }

  const sum = data.reduce((acc, val) => acc + val, 0);
  const average = sum / data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);

  return {
    sum,
    average,
    min,
    max,
    count: data.length,
  };
}

/**
 * Export all utilities as default
 */
export default {
  aggregateIntoBuckets,
  aggregateByTimePeriod,
  aggregateByCategory,
  sampleData,
  calculateStats,
};
