/**
 * Deterministic category color palette.
 * Hash-based: same category string always maps to the same color pair.
 */
const PALETTE: { bg: string; text: string }[] = [
  { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  { bg: 'bg-green-100',  text: 'text-green-700'  },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  { bg: 'bg-rose-100',   text: 'text-rose-700'   },
  { bg: 'bg-teal-100',   text: 'text-teal-700'   },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-cyan-100',   text: 'text-cyan-700'   },
  { bg: 'bg-pink-100',   text: 'text-pink-700'   },
];

function hashIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % PALETTE.length;
}

/**
 * Returns a `bg-* text-*` Tailwind class pair for any category string.
 * The result is deterministic — identical inputs always produce identical output.
 */
export function getCategoryColor(category: string): string {
  const pair = PALETTE[hashIndex(category)];
  return `${pair.bg} ${pair.text}`;
}
