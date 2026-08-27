// Role-based entitlements (lightweight, local — no real auth).
//
// The SAME underlying scenario/data is used for every role; entitlements only change what
// is *visible*. Two levers:
//   1. allowedKPIs   — which KPIs a role may see on the dashboard / investigation.
//   2. maskedFields  — supplier-sensitive fields that render as ████████ for a role,
//                      with the restriction visibly labelled (PRD Section 16).
//
// This keeps the demo honest: switching role never fabricates or changes numbers, it only
// filters and masks the shared analysis result.

import { Role } from '@/types';

// Redaction glyph shown in place of a masked value (matches the PRD's ████████ example).
export const MASK = '████████';

// Stable field keys for supplier-sensitive data so masking is declarative, not string-matched.
export type SensitiveFieldKey = 'supplier_name' | 'supplier_margin' | 'supplier_pricing';

export interface RoleDefinition {
  role: Role;
  label: string;
  short: string;
  description: string;
  // KPI ids this role may view. 'all' is a convenience for the fully-privileged role.
  allowedKPIs: string[] | 'all';
  // Supplier-sensitive fields hidden from this role.
  maskedFields: SensitiveFieldKey[];
  // Tailwind accent tokens for the role chip / badges.
  accent: { bg: string; text: string; ring: string };
}

// All five KPI ids in the model (kept in one place for the 'all' expansion).
const ALL_KPI_IDS = ['revenue', 'gross_margin', 'units_sold', 'average_selling_price', 'fulfillment_sla'];

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  business_head: {
    role: 'business_head',
    label: 'Business Head',
    short: 'BH',
    description: 'Full access — aggregate KPIs, regional performance, operational evidence, and recommendations.',
    allowedKPIs: 'all',
    maskedFields: [],
    accent: { bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-300' },
  },
  finance_controller: {
    role: 'finance_controller',
    label: 'Finance Controller',
    short: 'FC',
    description: 'Financial view — revenue variance, gross-margin impact, and pricing. Operational SLA / volume detail is de-scoped.',
    // Financial KPIs only: revenue, margin, and price. Units / fulfillment are operational.
    allowedKPIs: ['revenue', 'gross_margin', 'average_selling_price'],
    maskedFields: [],
    accent: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-300' },
  },
  restricted: {
    role: 'restricted',
    label: 'Restricted User',
    short: 'R',
    description: 'Aggregate KPIs only. Supplier-sensitive fields (margin, pricing, supplier identity) are masked for this role.',
    // Aggregate top-line only — no margin or pricing KPI, and supplier detail is masked.
    allowedKPIs: ['revenue', 'units_sold', 'fulfillment_sla'],
    maskedFields: ['supplier_name', 'supplier_margin', 'supplier_pricing'],
    accent: { bg: 'bg-slate-200', text: 'text-slate-600', ring: 'ring-slate-300' },
  },
};

export const ALL_ROLES: Role[] = ['business_head', 'finance_controller', 'restricted'];

export function getRoleDefinition(role: Role): RoleDefinition {
  return ROLE_DEFINITIONS[role] ?? ROLE_DEFINITIONS.business_head;
}

export function roleLabel(role: Role): string {
  return getRoleDefinition(role).label;
}

/** Whether a role may view a given KPI id. */
export function canViewKPI(role: Role, kpiId: string): boolean {
  const def = getRoleDefinition(role);
  return def.allowedKPIs === 'all' || def.allowedKPIs.includes(kpiId);
}

/** The list of KPI ids visible to a role, in the canonical order. */
export function allowedKPIIds(role: Role): string[] {
  const def = getRoleDefinition(role);
  return def.allowedKPIs === 'all' ? [...ALL_KPI_IDS] : def.allowedKPIs.filter((id) => ALL_KPI_IDS.includes(id));
}

/** Whether a supplier-sensitive field is masked for a role. */
export function isFieldMasked(role: Role, field: SensitiveFieldKey): boolean {
  return getRoleDefinition(role).maskedFields.includes(field);
}

/**
 * Resolve a supplier-sensitive value for a role. Returns the redaction glyph (and masked:true)
 * when the field is restricted, otherwise the real value. Never mutates source data.
 */
export function maskField(role: Role, field: SensitiveFieldKey, value: string): { value: string; masked: boolean } {
  return isFieldMasked(role, field) ? { value: MASK, masked: true } : { value, masked: false };
}
