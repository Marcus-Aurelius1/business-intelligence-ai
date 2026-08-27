// Source C: Product / Operations - Fulfillment and capacity data
// Grain: event / facility / region / day
// Refresh: 30 minutes

export interface OperationsEvent {
  id: string;
  timestamp: string;
  facility: string;
  region: 'West' | 'North' | 'South' | 'East';
  fulfillmentCapacity: number; // percentage
  inventoryAvailability: number; // percentage
  deliverySLA: number; // percentage on-time
  incidentType: 'capacity_reduction' | 'staffing_issue' | 'system_outage' | 'weather' | 'none';
  description: string;
}

// Current period operations events - West fulfillment issues (supports primary scenario)
export const currentOperations: OperationsEvent[] = [
  // West region fulfillment center issues
  {
    id: 'o1',
    timestamp: '2026-08-25T08:00:00',
    facility: 'West Distribution Hub',
    region: 'West',
    fulfillmentCapacity: 65, // Reduced from baseline 95%
    inventoryAvailability: 72,
    deliverySLA: 78, // Below target of 95%
    incidentType: 'capacity_reduction',
    description: 'Warehouse capacity reduced due to facility maintenance and staffing constraints'
  },
  {
    id: 'o2',
    timestamp: '2026-08-25T14:00:00',
    facility: 'West Distribution Hub',
    region: 'West',
    fulfillmentCapacity: 62,
    inventoryAvailability: 68,
    deliverySLA: 75,
    incidentType: 'staffing_issue',
    description: 'Seasonal staffing shortage affecting order processing speed'
  },
  {
    id: 'o3',
    timestamp: '2026-08-26T09:00:00',
    facility: 'West Distribution Hub',
    region: 'West',
    fulfillmentCapacity: 60,
    inventoryAvailability: 70,
    deliverySLA: 76,
    incidentType: 'capacity_reduction',
    description: 'Capacity remains constrained; recovery expected in 5-7 days'
  },

  // North region - normal operations
  {
    id: 'o4',
    timestamp: '2026-08-26T09:00:00',
    facility: 'North Fulfillment Center',
    region: 'North',
    fulfillmentCapacity: 92,
    inventoryAvailability: 95,
    deliverySLA: 96,
    incidentType: 'none',
    description: 'Operations running smoothly'
  },

  // South region - normal operations
  {
    id: 'o5',
    timestamp: '2026-08-26T09:00:00',
    facility: 'South Logistics Hub',
    region: 'South',
    fulfillmentCapacity: 88,
    inventoryAvailability: 91,
    deliverySLA: 94,
    incidentType: 'none',
    description: 'Standard operations with slight capacity headroom'
  },

  // East region - minor issues
  {
    id: 'o6',
    timestamp: '2026-08-26T09:00:00',
    facility: 'East Distribution Center',
    region: 'East',
    fulfillmentCapacity: 85,
    inventoryAvailability: 90,
    deliverySLA: 91,
    incidentType: 'none',
    description: 'Minor inventory gaps being addressed'
  },
];

// Baseline operations (normal state)
export const baselineOperations: OperationsEvent[] = [
  {
    id: 'bo1',
    timestamp: '2026-07-26T09:00:00',
    facility: 'West Distribution Hub',
    region: 'West',
    fulfillmentCapacity: 95,
    inventoryAvailability: 92,
    deliverySLA: 94,
    incidentType: 'none',
    description: 'Normal operations'
  },
  {
    id: 'bo2',
    timestamp: '2026-07-26T09:00:00',
    facility: 'North Fulfillment Center',
    region: 'North',
    fulfillmentCapacity: 93,
    inventoryAvailability: 94,
    deliverySLA: 95,
    incidentType: 'none',
    description: 'Normal operations'
  },
];

// Source metadata
export const opsSourceMeta = {
  id: 'product_operations',
  name: 'Product / Operations',
  type: 'operations' as const,
  grain: 'event / facility / region / day',
  refreshMinutes: 30,
  freshnessMinutes: 28, // deterministic age since last refresh
  lastUpdated: new Date(Date.now() - 28 * 60 * 1000), // 28 minutes ago
};
