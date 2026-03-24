/** Weight per pack in kg (60-tablet bottle including packaging) */
const WEIGHT_PER_PACK = 0.35;

export const NIGERIAN_STATES: string[] = [
  'Lagos',
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

/** South West states (excluding Lagos) attract lower delivery rates */
const SOUTH_WEST = new Set(['ogun', 'ondo', 'osun', 'oyo', 'ekiti']);

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
