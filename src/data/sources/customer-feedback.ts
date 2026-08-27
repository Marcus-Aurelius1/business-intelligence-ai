// Source B: Customer Voice / CRM - Feedback and sentiment data
// Grain: feedback / customer / region / day
// Refresh: 45-60 minutes

export interface CustomerFeedback {
  id: string;
  timestamp: string;
  product: 'Electronics' | 'Appliances' | 'Consumer Devices';
  region: 'West' | 'North' | 'South' | 'East';
  issueType: 'delivery' | 'quality' | 'price' | 'availability' | 'service' | 'other';
  sentiment: 'negative' | 'neutral' | 'positive';
  deliveryIssue: boolean;
  text: string;
}

// Current period feedback - West region delivery issues (supports primary scenario)
export const currentFeedback: CustomerFeedback[] = [
  // West Electronics delivery complaints (supporting evidence)
  { id: 'f1', timestamp: '2026-08-26T14:30:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Order delayed by 5 days. No update on tracking.' },
  { id: 'f2', timestamp: '2026-08-26T15:45:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Promised delivery was 3 days ago, still waiting.' },
  { id: 'f3', timestamp: '2026-08-26T16:20:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Fulfillment center says capacity reduced, no timeline.' },
  { id: 'f4', timestamp: '2026-08-26T17:00:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Cancelled order due to excessive delay.' },
  { id: 'f5', timestamp: '2026-08-26T18:15:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Store pickup not available, had to wait for shipping.' },
  { id: 'f6', timestamp: '2026-08-26T19:30:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Second time this month delivery is late.' },
  { id: 'f7', timestamp: '2026-08-26T20:00:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Frustrated with the delays, considering competitor.' },
  { id: 'f8', timestamp: '2026-08-26T20:45:00', product: 'Electronics', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Capacity issues affecting multiple orders.' },
  { id: 'f9', timestamp: '2026-08-26T21:00:00', product: 'Appliances', region: 'West', issueType: 'delivery', sentiment: 'negative', deliveryIssue: true, text: 'Large appliance delivery postponed twice.' },
  { id: 'f10', timestamp: '2026-08-26T21:30:00', product: 'Electronics', region: 'West', issueType: 'availability', sentiment: 'negative', deliveryIssue: false, text: 'Product shows in stock but unable to ship.' },

  // Additional delivery complaints to reach 37
  ...Array.from({ length: 27 }, (_, i) => ({
    id: `f${11 + i}`,
    timestamp: `2026-08-26T${10 + (i % 12)}:${i % 60}:00`,
    product: 'Electronics' as const,
    region: 'West' as const,
    issueType: 'delivery' as const,
    sentiment: 'negative' as const,
    deliveryIssue: true,
    text: `Delivery issue reported - delayed shipment #${1000 + i}`
  })),

  // North region - normal feedback
  { id: 'f38', timestamp: '2026-08-26T14:00:00', product: 'Electronics', region: 'North', issueType: 'quality', sentiment: 'positive', deliveryIssue: false, text: 'Great product quality, fast delivery.' },
  { id: 'f39', timestamp: '2026-08-26T15:00:00', product: 'Appliances', region: 'North', issueType: 'price', sentiment: 'neutral', deliveryIssue: false, text: 'Price could be more competitive.' },
  { id: 'f40', timestamp: '2026-08-26T16:30:00', product: 'Electronics', region: 'North', issueType: 'service', sentiment: 'positive', deliveryIssue: false, text: 'Excellent customer service experience.' },

  // South region - positive sentiment
  { id: 'f41', timestamp: '2026-08-26T13:00:00', product: 'Electronics', region: 'South', issueType: 'quality', sentiment: 'positive', deliveryIssue: false, text: 'Very satisfied with the purchase.' },
  { id: 'f42', timestamp: '2026-08-26T17:00:00', product: 'Consumer Devices', region: 'South', issueType: 'delivery', sentiment: 'positive', deliveryIssue: false, text: 'Arrived earlier than expected.' },

  // East region - mixed
  { id: 'f43', timestamp: '2026-08-26T12:00:00', product: 'Electronics', region: 'East', issueType: 'price', sentiment: 'neutral', deliveryIssue: false, text: 'Standard pricing, good value.' },
  { id: 'f44', timestamp: '2026-08-26T18:00:00', product: 'Appliances', region: 'East', issueType: 'availability', sentiment: 'negative', deliveryIssue: false, text: 'Out of stock for preferred model.' },

  // Marketing promotion feedback (counter-signal)
  { id: 'f45', timestamp: '2026-08-26T19:00:00', product: 'Electronics', region: 'West', issueType: 'price', sentiment: 'positive', deliveryIssue: false, text: 'Great promotional discount on electronics!' },
  { id: 'f46', timestamp: '2026-08-26T19:30:00', product: 'Electronics', region: 'West', issueType: 'price', sentiment: 'positive', deliveryIssue: false, text: 'Took advantage of the 5% marketing offer.' },
];

// Source metadata
export const crmSourceMeta = {
  id: 'customer_voice',
  name: 'Customer Voice / CRM',
  type: 'crm' as const,
  grain: 'feedback / customer / region / day',
  refreshMinutes: 45,
  freshnessMinutes: 41, // deterministic age since last refresh
  lastUpdated: new Date(Date.now() - 41 * 60 * 1000), // 41 minutes ago
};
