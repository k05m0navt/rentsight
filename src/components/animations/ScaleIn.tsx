/**
 * ScaleIn Animation Component (T083)
 *
 * Wraps content with a scale-in animation (for modals/dialogs)
 * Respects prefers-reduced-motion accessibility preference
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { scaleInVariants } from '@/lib/animation-utils';

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={scaleInVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
