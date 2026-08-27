// KPI Calculation Engine - Deterministic calculations from mock data

import { currentPeriodTransactions, baselinePeriodTransactions } from '@/data/sources/sales-transactions';
import { currentOperations, baselineOperations } from '@/data/sources/operations-events';
import { currentFeedback } from '@/data/sources/customer-feedback';
import { KPIMovement } from '@/types';

export function calculateRevenue(current: typeof currentPeriodTransactions, baseline: typeof baselinePeriodTransactions): {
  total: number;
  byRegion: Record<string, number>;
  byProduct: Record<string, number>;
  byChannel: Record<string, number>;
} {
  const total = current.reduce((sum, t) => sum + t.revenue, 0);
  const baselineTotal = baseline.reduce((sum, t) => sum + t.revenue, 0);

  const byRegion = current.reduce((acc, t) => {
    acc[t.region] = (acc[t.region] || 0) + t.revenue;
    return acc;
  }, {} as Record<string, number>);

  const byProduct = current.reduce((acc, t) => {
    acc[t.product] = (acc[t.product] || 0) + t.revenue;
    return acc;
  }, {} as Record<string, number>);

  const byChannel = current.reduce((acc, t) => {
    acc[t.channel] = (acc[t.channel] || 0) + t.revenue;
    return acc;
  }, {} as Record<string, number>);

  return { total, byRegion, byProduct, byChannel };
}

export function calculateGrossMargin(current: typeof currentPeriodTransactions): {
  total: number;
  percentage: number;
} {
  const marginSum = current.reduce((sum, t) => sum + (t.revenue * t.grossMargin), 0);
  const revenueSum = current.reduce((sum, t) => sum + t.revenue, 0);
  const percentage = revenueSum > 0 ? (marginSum / revenueSum) * 100 : 0;

  return { total: marginSum, percentage };
}

export function calculateUnitsSold(current: typeof currentPeriodTransactions): number {
  return current.reduce((sum, t) => sum + t.units, 0);
}

export function calculateAverageSellingPrice(current: typeof currentPeriodTransactions): number {
  const totalRevenue = current.reduce((sum, t) => sum + t.revenue, 0);
  const totalUnits = current.reduce((sum, t) => sum + t.units, 0);
  return totalUnits > 0 ? totalRevenue / totalUnits : 0;
}

export function calculateFulfillmentSLA(operations: typeof currentOperations): {
  averageSLA: number;
  byRegion: Record<string, number>;
} {
  const byRegion = operations.reduce((acc, o) => {
    if (!acc[o.region]) {
      acc[o.region] = { sum: 0, count: 0 };
    }
    acc[o.region].sum += o.deliverySLA;
    acc[o.region].count += 1;
    return acc;
  }, {} as Record<string, { sum: number; count: number }>);

  const result: Record<string, number> = {};
  for (const [region, data] of Object.entries(byRegion)) {
    result[region] = data.sum / data.count;
  }

  const averageSLA = operations.reduce((sum, o) => sum + o.deliverySLA, 0) / operations.length;

  return { averageSLA, byRegion: result };
}

// Calculate all KPIs
export function calculateAllKPIs(): {
  revenue: ReturnType<typeof calculateRevenue>;
  grossMargin: ReturnType<typeof calculateGrossMargin>;
  unitsSold: number;
  averageSellingPrice: number;
  fulfillmentSLA: ReturnType<typeof calculateFulfillmentSLA>;
} {
  return {
    revenue: calculateRevenue(currentPeriodTransactions, baselinePeriodTransactions),
    grossMargin: calculateGrossMargin(currentPeriodTransactions),
    unitsSold: calculateUnitsSold(currentPeriodTransactions),
    averageSellingPrice: calculateAverageSellingPrice(currentPeriodTransactions),
    fulfillmentSLA: calculateFulfillmentSLA(currentOperations),
  };
}

// Calculate KPI movements for comparison
export function calculateKPIMovement(
  kpiId: string,
  currentValue: number,
  baselineValue: number,
  signalScore: number,
  materiality: 'low' | 'medium' | 'high',
  status: 'stable' | 'investigate' | 'action_required',
  freshness: number
): KPIMovement {
  const absoluteChange = currentValue - baselineValue;
  const percentageChange = baselineValue > 0 ? ((currentValue - baselineValue) / baselineValue) * 100 : 0;

  return {
    kpiId,
    currentValue,
    baselineValue,
    percentageChange,
    absoluteChange,
    signalScore,
    materiality,
    status,
    freshness,
  };
}

// West-specific calculations (for primary scenario)
export function calculateWestRegionMetrics(): {
  electronicsRevenue: { current: number; baseline: number; change: number };
  offlineRevenue: { current: number; baseline: number; change: number };
  deliveryComplaints: number;
  fulfillmentCapacity: { current: number; baseline: number };
} {
  const westCurrent = currentPeriodTransactions.filter(t => t.region === 'West');
  const westBaseline = baselinePeriodTransactions.filter(t => t.region === 'West');

  const electronicsCurrent = westCurrent.filter(t => t.product === 'Electronics').reduce((s, t) => s + t.revenue, 0);
  const electronicsBaseline = westBaseline.filter(t => t.product === 'Electronics').reduce((s, t) => s + t.revenue, 0);

  const offlineCurrent = westCurrent.filter(t => t.channel === 'Offline').reduce((s, t) => s + t.revenue, 0);
  const offlineBaseline = westBaseline.filter(t => t.channel === 'Offline').reduce((s, t) => s + t.revenue, 0);

  const deliveryComplaints = currentFeedback.filter(f => f.region === 'West' && f.deliveryIssue).length;

  const westOps = currentOperations.filter(o => o.region === 'West');
  const avgCapacity = westOps.reduce((s, o) => s + o.fulfillmentCapacity, 0) / westOps.length;

  return {
    electronicsRevenue: {
      current: electronicsCurrent,
      baseline: electronicsBaseline,
      change: electronicsCurrent - electronicsBaseline,
    },
    offlineRevenue: {
      current: offlineCurrent,
      baseline: offlineBaseline,
      change: offlineCurrent - offlineBaseline,
    },
    deliveryComplaints,
    fulfillmentCapacity: {
      current: avgCapacity,
      baseline: 95,
    },
  };
}
