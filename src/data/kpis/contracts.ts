// KPI Semantic Contracts
// Lightweight definitions for each KPI

import { KPI } from '@/types';

export const kpiContracts: Record<string, KPI> = {
  revenue: {
    id: 'revenue',
    name: 'Revenue',
    definition: 'Sum of net transaction value across all products and regions',
    calculation: 'Σ(units × net selling price)',
    dimensions: ['Region', 'Product', 'Channel', 'Time'],
    drivers: ['Volume', 'Price', 'Mix', 'Marketing', 'Fulfillment'],
    materialityThreshold: 5, // 5% change is material
    signalThreshold: 70, // Signal score above 70 indicates meaningful movement
    lineage: 'ERP → sales_transactions → revenue aggregation',
    access: ['business_head', 'finance_controller', 'business_analyst'],
  },

  gross_margin: {
    id: 'gross_margin',
    name: 'Gross Margin',
    definition: 'Total gross profit as percentage of revenue',
    calculation: 'Σ(revenue × margin_rate) / Σ(revenue) × 100',
    dimensions: ['Region', 'Product', 'Channel', 'Time'],
    drivers: ['Product Mix', 'Pricing', 'Promotional Discount', 'Supplier Cost'],
    materialityThreshold: 3,
    signalThreshold: 65,
    lineage: 'ERP → sales_transactions → margin calculation',
    access: ['business_head', 'finance_controller'],
  },

  units_sold: {
    id: 'units_sold',
    name: 'Units Sold',
    definition: 'Total quantity of products sold',
    calculation: 'Σ(units)',
    dimensions: ['Region', 'Product', 'Channel', 'Time'],
    drivers: ['Demand', 'Availability', 'Pricing', 'Marketing'],
    materialityThreshold: 8,
    signalThreshold: 70,
    lineage: 'ERP → sales_transactions → units aggregation',
    access: ['business_head', 'business_analyst'],
  },

  average_selling_price: {
    id: 'average_selling_price',
    name: 'Average Selling Price',
    definition: 'Weighted average price per unit sold',
    calculation: 'Σ(revenue) / Σ(units)',
    dimensions: ['Region', 'Product', 'Channel', 'Time'],
    drivers: ['Pricing Strategy', 'Product Mix', 'Promotions', 'Competition'],
    materialityThreshold: 4,
    signalThreshold: 65,
    lineage: 'ERP → sales_transactions → ASP calculation',
    access: ['business_head', 'finance_controller', 'business_analyst'],
  },

  fulfillment_sla: {
    id: 'fulfillment_sla',
    name: 'Fulfillment / Service Level',
    definition: 'Percentage of orders delivered on time',
    calculation: '(On-time deliveries / Total deliveries) × 100',
    dimensions: ['Region', 'Facility', 'Time'],
    drivers: ['Capacity', 'Staffing', 'Inventory', 'Logistics'],
    materialityThreshold: 5,
    signalThreshold: 60,
    lineage: 'Operations → operations_events → SLA calculation',
    access: ['business_head', 'business_analyst'],
  },
};

export const kpiList = Object.values(kpiContracts);
