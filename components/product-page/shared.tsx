import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

// ─── Animation variants ───────────────────────────────────────────────────────

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  }),
};

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

export const FadeIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariants}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── StarRating ───────────────────────────────────────────────────────────────

export const StarRating: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 15,
}) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-200'}
      />
    ))}
  </div>
);

// ─── SectionHeader ────────────────────────────────────────────────────────────

export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}> = ({ eyebrow, title, subtitle, light = false }) => (
  <div className="text-center max-w-2xl mx-auto mb-14">
    {eyebrow && (
      <span
        className={`inline-block text-xs font-bold tracking-widest uppercase mb-3 ${
          light ? 'text-accent' : 'text-primary'
        }`}
      >
        {eyebrow}
      </span>
    )}
    <h2
      className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
        light ? 'text-white' : 'text-secondary'
      }`}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg leading-relaxed ${light ? 'text-white/70' : 'text-text-muted'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// ─── CheckItem ────────────────────────────────────────────────────────────────

export const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-3 text-sm text-text">
    <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
    {text}
  </li>
);
