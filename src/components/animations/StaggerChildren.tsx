/**
 * StaggerChildren Animation Component (T084)
 *
 * Animates children with a stagger effect
 * Used for lists and grids
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerChildrenVariants, staggerItemVariants } from '@/lib/animation-utils';

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.05,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerChildrenVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item for stagger animation
 * Wrap each child with this component
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}
