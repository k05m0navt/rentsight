/**
 * Motion Provider Component (T092)
 *
 * Wraps the app with Framer Motion configuration
 * Automatically respects prefers-reduced-motion accessibility preference
 */

'use client';

import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
