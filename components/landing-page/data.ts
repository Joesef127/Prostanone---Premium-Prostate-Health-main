import { ShieldCheck, Leaf, Award, Truck, CheckCircle2, Zap, FlaskConical, Users, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { images } from '@/lib';

export const SYMPTOMS = [
  { icon: '🌙', text: 'Waking up 3–5 times per night to urinate' },
  { icon: '💧', text: 'Weak, slow or dribbling urine stream' },
  { icon: '⏳', text: 'Feeling bladder never fully empties' },
  { icon: '🚨', text: 'Sudden, uncontrollable urge to go' },
  { icon: '🔥', text: 'Burning or pain when urinating' },
  { icon: '😔', text: 'Embarrassment at work, travel, or social events' },
];

export const BENEFITS: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: Zap,
    title: 'Shrinks Enlarged Prostate',
    desc: 'Targeted herbal compounds reduce prostate volume and relieve pressure on the bladder — addressing the root cause.',
  },
  {
    icon: Leaf,
    title: '100% Natural Formula',
    desc: 'No synthetic chemicals, no steroids. Pure herbal actives with no reported sexual side effects.',
  },
  {
    icon: FlaskConical,
    title: 'Clinically Formulated',
    desc: 'Developed in collaboration with Alpha Organics, Great Britain — produced in GMP-certified facilities.',
  },
  {
    icon: Award,
    title: 'NAFDAC Certified',
    desc: "Fully approved by Nigeria's National Agency for Food and Drug Administration. Reg. No. A7-4976L.",
  },
  {
    icon: Users,
    title: 'Thousands of Men Helped',
    desc: 'From Lagos to Kano — Nigerian men are reclaiming their nights and their confidence with Prostanone.',
  },
  {
    icon: Clock,
    title: 'Results in 4–6 Weeks',
    desc: 'Most users report measurable improvement in the first month. Optimal results at 8–12 weeks of consistent use.',
  },
];

export const INGREDIENTS = [
  {
    name: 'Saw Palmetto',
    dose: '300mg',
    desc: 'The gold standard of prostate support — blocks DHT conversion to reduce enlargement and improve urine flow.',
  },
  {
    name: 'Chimaphila Umbellata',
    dose: '50mg',
    desc: 'Traditional remedy for prostate congestion and irritation. Relieves burning and feelings of fullness.',
  },
  {
    name: 'Pareira Brava',
    dose: '25mg',
    desc: 'Soothes the urinary tract and eases difficult, straining urination — especially at night.',
  },
  {
    name: 'Hydrangea Arborescens',
    dose: '15mg',
    desc: 'Anti-inflammatory root extract that helps dissolve gravel deposits in the prostate and kidneys.',
  },
];

export const STATS = [
  { value: '5,000+', label: 'Men Helped' },
  { value: '4–6 wks', label: 'To First Results' },
  { value: '96%', label: 'Satisfaction Rate' },
  { value: 'NAFDAC', label: 'Reg. A7-4976L' },
];

export const TRUST_BADGES: Array<{ icon: LucideIcon; label: string }> = [
  { icon: ShieldCheck, label: 'NAFDAC Certified' },
  { icon: Leaf, label: '100% Natural' },
  { icon: Award, label: 'GMP Manufactured' },
  { icon: Truck, label: 'Nationwide Delivery' },
  { icon: CheckCircle2, label: 'No Side Effects Reported' },
];

export const PACKAGE_IMAGES: Record<number, string> = {
  1: images.single_box,
  3: images.box_and_nylon,
  9: images.boxed_up,
};
