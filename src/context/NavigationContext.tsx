'use client';

/**
 * Navigation Context
 * 
 * Manages global navigation state including loading states and transitions
 * Provides smooth navigation experience across the app
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  navigateWithTransition: (href: string) => void;
  setNavigating: (loading: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const navigateWithTransition = useCallback((href: string) => {
    setIsNavigating(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      router.push(href);
      // Reset loading state after navigation
      setTimeout(() => setIsNavigating(false), 100);
    }, 150);
  }, [router]);

  const setNavigating = useCallback((loading: boolean) => {
    setIsNavigating(loading);
  }, []);

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      navigateWithTransition,
      setNavigating,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
