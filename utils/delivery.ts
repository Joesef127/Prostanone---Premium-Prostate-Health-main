/** Weight per pack in kg (60-tablet bottle including packaging) */
const WEIGHT_PER_PACK = 0.35;

export const NIGERIAN_STATES: string[] = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

/** South West states (excluding Lagos) attract lower delivery rates */
const SOUTH_WEST = new Set(['lagos', 'ogun', 'ondo', 'osun', 'oyo', 'ekiti']);

/** Dropdown option shape used by CustomDropdown */
export type DropdownOption = { value: string; label: string };

/** Zone group shape for the state picker */
export type DeliveryZoneGroup = { label: string; options: DropdownOption[] };

const SW_STATES = ['Lagos', 'Ekiti', 'Ogun', 'Ondo', 'Osun', 'Oyo'];

/**
 * States grouped by delivery zone with fee labels.
 * Used to build the custom-dropdown for state selection across the site.
 */
export const STATE_DELIVERY_ZONES: DeliveryZoneGroup[] = [
  {
    label: 'South West',
    options: SW_STATES.map(s => ({ value: s, label: s })),
  },
  {
    label: 'South East',
    options: ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo']
      .map(s => ({ value: s, label: s })),
  },
  {
    label: 'South South',
    options: ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers']
      .map(s => ({ value: s, label: s })),
  },
  {
    label: 'North Central',
    options: ['Benue', 'FCT (Abuja)', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau']
      .map(s => ({ value: s, label: s })),
  },
  {
    label: 'North West',
    options: ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara']
      .map(s => ({ value: s, label: s })),
  },
  {
    label: 'North East',
    options: ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe']
      .map(s => ({ value: s, label: s })),
  },
];

/** [maxKg, fee] — fee applies when totalWeight ≤ maxKg */
const SW_TIERS: [number, number][] = [
  [1, 5000], [3, 7000], [5, 9000], [7, 11000], [10, 13000],
];
const OTHER_TIERS: [number, number][] = [
  [1, 8000], [3, 9000], [5, 10000], [7, 14000], [10, 16000],
];

function tierLookup(tiers: [number, number][], kg: number): number {
  for (const [max, fee] of tiers) {
    if (kg <= max) return fee;
  }
  return tiers[tiers.length - 1][1];
}

/**
 * Calculate delivery fee.
 * @param state      Nigerian state name (must match an entry in NIGERIAN_STATES)
 * @param locHint    Address / city string — used only to detect Badagry or Epe
 * @param totalPacks Total number of Prostanone packs in the order
 */
export function calcDeliveryFee(
  state: string,
  locHint: string,
  totalPacks: number,
): number {
  const s = state.trim().toLowerCase();
  const loc = locHint.trim().toLowerCase();

  if (s === 'lagos') {
    const isExcluded = loc.includes('badagry') || loc.includes('epe');
    return isExcluded ? 4000 : 0;
  }

  if (totalPacks <= 0) {
    return 0;
  }
  const kg = Math.max(totalPacks * WEIGHT_PER_PACK, 0.1);
  return SOUTH_WEST.has(s)
    ? tierLookup(SW_TIERS, kg)
    : tierLookup(OTHER_TIERS, kg);
}
