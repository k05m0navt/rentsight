// Install Service for RentSight PWA

import { InstallPromptEvent } from '@/types/pwa';

class InstallService {
  private installPrompt: InstallPromptEvent | null = null;
  private listeners: Set<(prompt: InstallPromptEvent | null) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as InstallPromptEvent;
      this.notifyListeners();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.notifyListeners();
    });

    // Listen for visibility change to refresh install prompt
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.installPrompt) {
        // Try to refresh install prompt after page becomes visible
        this.refreshInstallPrompt();
      }
    });
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.installPrompt));
  }

  /**
   * Subscribe to install prompt changes
   */
  subscribe(listener: (prompt: InstallPromptEvent | null) => void) {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener(this.installPrompt);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Check if app can be installed
   */
  canInstall(): boolean {
    return this.installPrompt !== null;
  }

  /**
   * Check if app is already installed
   */
  isInstalled(): boolean {
    if (typeof window === 'undefined') return false;

    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<{ outcome: 'accepted' | 'dismissed' }> {
    if (!this.installPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      // Clear the prompt after use
      this.installPrompt = null;
      this.notifyListeners();
      return choiceResult;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      throw error;
    }
  }

  /**
   * Refresh install prompt (useful after page visibility changes)
   */
  private refreshInstallPrompt() {
    // The browser will fire beforeinstallprompt again if conditions are met
    // This is a passive refresh - we don't actively request it
  }

  /**
   * Get install prompt analytics
   */
  getInstallAnalytics() {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isInstalled(),
      promptAvailable: this.installPrompt !== null,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Track install events for analytics
   */
  trackInstallEvent(
    event: 'prompt_shown' | 'prompt_accepted' | 'prompt_dismissed' | 'app_installed',
  ) {
    const analytics = {
      event,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      ...this.getInstallAnalytics(),
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for analytics
    try {
      const existing = JSON.parse(localStorage.getItem('pwa_install_analytics') || '[]');
      existing.push(analytics);
      localStorage.setItem('pwa_install_analytics', JSON.stringify(existing.slice(-50))); // Keep last 50 events
    } catch (error) {
      console.error('Failed to track install event:', error);
    }

    console.log('PWA Install Event:', analytics);
  }

  /**
   * Get install analytics history
   */
  getInstallHistory() {
    try {
      return JSON.parse(localStorage.getItem('pwa_install_analytics') || '[]');
    } catch (error) {
      console.error('Failed to get install history:', error);
      return [];
    }
  }
}

// Create singleton instance
export const installService = new InstallService();

// Export convenience functions
export const canInstall = () => installService.canInstall();
export const isInstalled = () => installService.isInstalled();
export const showInstallPrompt = () => installService.showInstallPrompt();
export const subscribeToInstallPrompt = (listener: (prompt: InstallPromptEvent | null) => void) =>
  installService.subscribe(listener);
export const trackInstallEvent = (
  event: 'prompt_shown' | 'prompt_accepted' | 'prompt_dismissed' | 'app_installed',
) => installService.trackInstallEvent(event);
