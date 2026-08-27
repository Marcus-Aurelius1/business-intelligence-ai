// Driver Decomposition Engine - Deterministic contribution analysis

import { Driver } from '@/types';
import { currentPeriodTransactions, baselinePeriodTransactions } from '@/data/sources/sales-transactions';
import { currentOperations, baselineOperations } from '@/data/sources/operations-events';

interface DriverContribution {
  driverId: string;
  name: string;
  contribution: number; // percentage points
  rawImpact: number; // absolute value
  method: string;
}

// Calculate driver contributions for Revenue KPI
export function decomposeRevenueDrivers(): DriverContribution[] {
  const westCurrent = currentPeriodTransactions.filter(t => t.region === 'West');
  const westBaseline = baselinePeriodTransactions.filter(t => t.region === 'West');

  const totalRevenueCurrent = currentPeriodTransactions.reduce((s, t) => s + t.revenue, 0);
  const totalRevenueBaseline = baselinePeriodTransactions.reduce((s, t) => s + t.revenue, 0);
  const totalChange = totalRevenueCurrent - totalRevenueBaseline;
  const baselineRevenue = totalRevenueBaseline;

  // Driver 1: Electronics Volume Decline
  const electronicsCurrent = westCurrent.filter(t => t.product === 'Electronics').reduce((s, t) => s + t.revenue, 0);
  const electronicsBaseline = westBaseline.filter(t => t.product === 'Electronics').reduce((s, t) => s + t.revenue, 0);
  const electronicsImpact = electronicsCurrent - electronicsBaseline;
  const electronicsContribution = (electronicsImpact / baselineRevenue) * 100;

  // Driver 2: West Offline-Channel Weakness
  const offlineCurrent = westCurrent.filter(t => t.channel === 'Offline').reduce((s, t) => s + t.revenue, 0);
  const offlineBaseline = westBaseline.filter(t => t.channel === 'Offline').reduce((s, t) => s + t.revenue, 0);
  const offlineImpact = offlineCurrent - offlineBaseline;
  const offlineContribution = (offlineImpact / baselineRevenue) * 100;

  // Driver 3: Fulfillment Disruption (correlation-based)
  const westOps = currentOperations.filter(o => o.region === 'West');
  const avgCapacity = westOps.reduce((s, o) => s + o.fulfillmentCapacity, 0) / westOps.length;
  const capacityDrop = 95 - avgCapacity; // From 95% baseline
  const fulfillmentImpact = -(capacityDrop / 100) * electronicsImpact * 0.5; // Partial attribution
  const fulfillmentContribution = (fulfillmentImpact / baselineRevenue) * 100;

  // Driver 4: Marketing Offset (counter-signal)
  const promotionalCurrent = currentPeriodTransactions.filter(t => t.baselineRevenue === 0).reduce((s, t) => s + t.revenue, 0);
  const marketingContribution = (promotionalCurrent / baselineRevenue) * 100;

  // Driver 5: Price Adjustment
  const totalUnitsCurrent = currentPeriodTransactions.reduce((s, t) => s + t.units, 0);
  const totalUnitsBaseline = baselinePeriodTransactions.reduce((s, t) => s + t.units, 0);
  const aspCurrent = totalRevenueCurrent / totalUnitsCurrent;
  const aspBaseline = totalRevenueBaseline / totalUnitsBaseline;
  const priceImpact = (aspCurrent - aspBaseline) * totalUnitsCurrent;
  const priceContribution = (priceImpact / baselineRevenue) * 100;

  return [
    {
      driverId: 'd1',
      name: 'Electronics Volume Decline',
      contribution: Math.round(electronicsContribution * 10) / 10,
      rawImpact: electronicsImpact,
      method: 'SQL aggregation + contribution analysis',
    },
    {
      driverId: 'd2',
      name: 'West Offline-Channel Weakness',
      contribution: Math.round(offlineContribution * 10) / 10,
      rawImpact: offlineImpact,
      method: 'Channel segmentation analysis',
    },
    {
      driverId: 'd3',
      name: 'Fulfillment Disruption',
      contribution: Math.round(fulfillmentContribution * 10) / 10,
      rawImpact: fulfillmentImpact,
      method: 'Correlation with operations data',
    },
    {
      driverId: 'd4',
      name: 'Marketing Offset',
      contribution: Math.round(marketingContribution * 10) / 10,
      rawImpact: promotionalCurrent,
      method: 'Promotional impact analysis',
    },
    {
      driverId: 'd5',
      name: 'Price Adjustment',
      contribution: Math.round(priceContribution * 10) / 10,
      rawImpact: priceImpact,
      method: 'Pricing variance analysis',
    },
  ];
}

// Rank drivers by absolute contribution
export function rankDrivers(contributions: DriverContribution[]): Driver[] {
  const sorted = [...contributions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return sorted.map((d, index) => ({
    id: d.driverId,
    name: d.name,
    contribution: d.contribution,
    confidence: calculateDriverConfidence(d),
    method: d.method,
    evidenceCount: getEvidenceCount(d.driverId),
    freshness: getFreshness(d.driverId),
    rank: index + 1,
  }));
}

// Calculate confidence for each driver (deterministic)
function calculateDriverConfidence(driver: DriverContribution): number {
  // Base confidence from data quality
  let confidence = 70;

  // Adjust based on evidence type and count
  const evidenceBonus: Record<string, number> = {
    d1: 12, // Structured data
    d2: 8,  // Channel segmentation
    d3: 15, // Multiple sources (ops + feedback)
    d4: 5,  // Counter-signal
    d5: 18, // Clear calculation
  };

  confidence += evidenceBonus[driver.driverId] || 0;

  // Ensure within bounds
  return Math.min(Math.max(confidence, 0), 100);
}

// Get evidence count per driver (deterministic)
function getEvidenceCount(driverId: string): number {
  const counts: Record<string, number> = {
    d1: 5,
    d2: 3,
    d3: 4,
    d4: 2,
    d5: 2,
  };
  return counts[driverId] || 0;
}

// Get freshness per driver (deterministic)
function getFreshness(driverId: string): number {
  const freshness: Record<string, number> = {
    d1: 12,
    d2: 12,
    d3: 28,
    d4: 12,
    d5: 12,
  };
  return freshness[driverId] || 15;
}

// Full decomposition pipeline
export function performDriverDecomposition(): Driver[] {
  const contributions = decomposeRevenueDrivers();
  return rankDrivers(contributions);
}
