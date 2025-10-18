/**
 * FadeIn Animation Component (T082)
 *
 * Wraps content with a fade-in animation using Framer Motion
 * Respects prefers-reduced-motion accessibility preference
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInVariants } from '@/lib/animation-utils';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, className, delay = 0, duration = 0.3 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
