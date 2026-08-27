// Source A: ERP / Finance - Transaction-level data
// Grain: transaction / product / region / channel / day
// Refresh: 15 minutes

export interface SalesTransaction {
  id: string;
  date: string;
  product: 'Electronics' | 'Appliances' | 'Consumer Devices';
  region: 'West' | 'North' | 'South' | 'East';
  channel: 'Online' | 'Offline';
  units: number;
  price: number;
  revenue: number;
  grossMargin: number;
  baselineRevenue: number;
}

// Current period data (showing decline)
export const currentPeriodTransactions: SalesTransaction[] = [
  // West region - Electronics decline (primary scenario)
  { id: 't1', date: '2026-08-26', product: 'Electronics', region: 'West', channel: 'Offline', units: 420, price: 8500, revenue: 3570000, grossMargin: 0.32, baselineRevenue: 4680000 },
  { id: 't2', date: '2026-08-26', product: 'Electronics', region: 'West', channel: 'Online', units: 280, price: 8200, revenue: 2296000, grossMargin: 0.35, baselineRevenue: 2520000 },
  { id: 't3', date: '2026-08-26', product: 'Appliances', region: 'West', channel: 'Offline', units: 180, price: 12000, revenue: 2160000, grossMargin: 0.28, baselineRevenue: 2100000 },
  { id: 't4', date: '2026-08-26', product: 'Consumer Devices', region: 'West', channel: 'Online', units: 350, price: 4500, revenue: 1575000, grossMargin: 0.38, baselineRevenue: 1600000 },

  // North region - stable
  { id: 't5', date: '2026-08-26', product: 'Electronics', region: 'North', channel: 'Offline', units: 520, price: 8600, revenue: 4472000, grossMargin: 0.33, baselineRevenue: 4500000 },
  { id: 't6', date: '2026-08-26', product: 'Electronics', region: 'North', channel: 'Online', units: 340, price: 8300, revenue: 2822000, grossMargin: 0.36, baselineRevenue: 2800000 },
  { id: 't7', date: '2026-08-26', product: 'Appliances', region: 'North', channel: 'Offline', units: 220, price: 12500, revenue: 2750000, grossMargin: 0.29, baselineRevenue: 2700000 },

  // South region - slight growth
  { id: 't8', date: '2026-08-26', product: 'Electronics', region: 'South', channel: 'Online', units: 380, price: 8400, revenue: 3192000, grossMargin: 0.34, baselineRevenue: 3000000 },
  { id: 't9', date: '2026-08-26', product: 'Consumer Devices', region: 'South', channel: 'Offline', units: 290, price: 4600, revenue: 1334000, grossMargin: 0.37, baselineRevenue: 1300000 },

  // East region - stable
  { id: 't10', date: '2026-08-26', product: 'Electronics', region: 'East', channel: 'Offline', units: 450, price: 8500, revenue: 3825000, grossMargin: 0.32, baselineRevenue: 3800000 },
  { id: 't11', date: '2026-08-26', product: 'Appliances', region: 'East', channel: 'Online', units: 260, price: 12200, revenue: 3172000, grossMargin: 0.30, baselineRevenue: 3200000 },

  // Marketing offset (counter-signal)
  { id: 't12', date: '2026-08-26', product: 'Electronics', region: 'West', channel: 'Online', units: 50, price: 8000, revenue: 400000, grossMargin: 0.25, baselineRevenue: 0, /* Promotional boost */ },
];

// Baseline period data (comparison reference)
export const baselinePeriodTransactions: SalesTransaction[] = [
  // West region baseline (healthy performance)
  { id: 'b1', date: '2026-07-26', product: 'Electronics', region: 'West', channel: 'Offline', units: 550, price: 8500, revenue: 4675000, grossMargin: 0.32, baselineRevenue: 4675000 },
  { id: 'b2', date: '2026-07-26', product: 'Electronics', region: 'West', channel: 'Online', units: 310, price: 8200, revenue: 2542000, grossMargin: 0.35, baselineRevenue: 2542000 },
  { id: 'b3', date: '2026-07-26', product: 'Appliances', region: 'West', channel: 'Offline', units: 175, price: 12000, revenue: 2100000, grossMargin: 0.28, baselineRevenue: 2100000 },
  { id: 'b4', date: '2026-07-26', product: 'Consumer Devices', region: 'West', channel: 'Online', units: 360, price: 4500, revenue: 1620000, grossMargin: 0.38, baselineRevenue: 1620000 },

  // North region baseline
  { id: 'b5', date: '2026-07-26', product: 'Electronics', region: 'North', channel: 'Offline', units: 525, price: 8600, revenue: 4515000, grossMargin: 0.33, baselineRevenue: 4515000 },
  { id: 'b6', date: '2026-07-26', product: 'Electronics', region: 'North', channel: 'Online', units: 335, price: 8300, revenue: 2780500, grossMargin: 0.36, baselineRevenue: 2780500 },

  // South region baseline
  { id: 'b7', date: '2026-07-26', product: 'Electronics', region: 'South', channel: 'Online', units: 365, price: 8400, revenue: 3066000, grossMargin: 0.34, baselineRevenue: 3066000 },

  // East region baseline
  { id: 'b8', date: '2026-07-26', product: 'Electronics', region: 'East', channel: 'Offline', units: 450, price: 8500, revenue: 3825000, grossMargin: 0.32, baselineRevenue: 3825000 },
];

// Source metadata
export const erpSourceMeta = {
  id: 'erp_finance',
  name: 'ERP / Finance',
  type: 'erp' as const,
  grain: 'transaction / product / region / channel / day',
  refreshMinutes: 15,
  freshnessMinutes: 12, // deterministic age since last refresh (matches deck)
  lastUpdated: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
};
