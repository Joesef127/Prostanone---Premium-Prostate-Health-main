import { describe, it, expect } from 'vitest';
import { calcDeliveryFee } from '../../utils/delivery';

describe('calcDeliveryFee', () => {
  // ── Lagos rules ──────────────────────────────────────────────────────────
  it('returns 0 for Lagos (standard area, any pack count)', () => {
    expect(calcDeliveryFee('Lagos', 'Victoria Island', 3)).toBe(0);
  });

  it('returns 0 for Lagos with 1 pack', () => {
    expect(calcDeliveryFee('Lagos', 'Ikeja', 1)).toBe(0);
  });

  it('returns 4000 for Badagry (Lagos exclusion zone)', () => {
    expect(calcDeliveryFee('Lagos', 'Badagry', 1)).toBe(4000);
  });

  it('returns 4000 for Epe (Lagos exclusion zone)', () => {
    expect(calcDeliveryFee('Lagos', 'Epe road, Lagos', 1)).toBe(4000);
  });

  it('Badagry/Epe detection is case-insensitive', () => {
    expect(calcDeliveryFee('Lagos', 'BADAGRY AREA', 2)).toBe(4000);
    expect(calcDeliveryFee('Lagos', 'Near EPE markets', 2)).toBe(4000);
  });

  // ── 0 packs edge case ────────────────────────────────────────────────────
  it('returns 0 for 0 packs (non-Lagos)', () => {
    expect(calcDeliveryFee('Rivers', '', 0)).toBe(0);
  });

  // ── South-West tier pricing (Ogun, Ondo, Osun, Oyo, Ekiti) ──────────────
  it('Ogun 1 pack (0.35 kg ≤ 1 kg) → SW tier ₦5,000', () => {
    expect(calcDeliveryFee('Ogun', 'Abeokuta', 1)).toBe(5000);
  });

  it('Oyo 3 packs (1.05 kg ≤ 3 kg) → SW tier ₦7,000', () => {
    expect(calcDeliveryFee('Oyo', 'Ibadan', 3)).toBe(7000);
  });

  it('Ondo 10 packs (3.5 kg ≤ 5 kg) → SW tier ₦9,000', () => {
    expect(calcDeliveryFee('Ondo', 'Akure', 10)).toBe(9000);
  });

  it('Ekiti 20 packs (7.0 kg = boundary of ≤ 7 kg) → SW tier ₦11,000', () => {
    expect(calcDeliveryFee('Ekiti', 'Ado-Ekiti', 20)).toBe(11000);
  });

  // ── Other-state tier pricing ─────────────────────────────────────────────
  it('FCT 1 pack → other tier ₦8,000', () => {
    expect(calcDeliveryFee('FCT (Abuja)', 'Garki', 1)).toBe(8000);
  });

  it('Rivers 3 packs (1.05 kg ≤ 3 kg) → other tier ₦9,000', () => {
    expect(calcDeliveryFee('Rivers', 'Port Harcourt', 3)).toBe(9000);
  });

  it('Kano 10 packs (3.5 kg ≤ 5 kg) → other tier ₦10,000', () => {
    expect(calcDeliveryFee('Kano', 'Kano city', 10)).toBe(10000);
  });

  // ── State name normalisation ──────────────────────────────────────────────
  it('trims and lower-cases state name to identify Lagos correctly', () => {
    expect(calcDeliveryFee('  Lagos  ', 'Lekki', 2)).toBe(0);
  });
});
