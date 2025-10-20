'use client';

/**
 * Loading Overlay Wrapper
 * 
 * Wrapper component that connects the global loading overlay to the navigation context
 */

import { LoadingOverlay } from './LoadingOverlay';
import { useNavigation } from '@/context/NavigationContext';

export function LoadingOverlayWrapper() {
  const { isNavigating } = useNavigation();
  
  return (
    <LoadingOverlay 
      isLoading={isNavigating} 
      message="Navigating..." 
    />
  );
}
