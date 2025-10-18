/**
 * PageTransition Animation Component (T085)
 *
 * Wraps page content with smooth fade-in transition
 * Applied to main content areas for smooth page transitions
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageTransitionVariants } from '@/lib/animation-utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
    >
      {children}
    </motion.div>
  );
}
