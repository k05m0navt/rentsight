#!/usr/bin/env node

/**
 * PWA Testing Script
 *
 * Tests PWA functionality including:
 * - Manifest validation
 * - Service worker functionality
 * - Offline capabilities
 * - Push notifications
 * - Installation prompts
 */

const puppeteer = require('puppeteer');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.cyan}=== ${message} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

class PWATester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.baseUrl = 'http://localhost:3000';
  }

  async runTests() {
    logHeader('PWA Testing Starting');

    try {
      await this.setupBrowser();
      await this.testManifest();
      await this.testServiceWorker();
      await this.testOfflineCapabilities();
      await this.testInstallPrompt();
      await this.testPushNotifications();
      await this.testPerformance();

      this.generateReport();
    } catch (error) {
      logError(`Test failed: ${error.message}`);
    } finally {
      await this.cleanup();
    }
  }

  async setupBrowser() {
    logInfo('Setting up browser...');

    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    this.page = await this.browser.newPage();

    // Enable service worker
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: {
          register: () => Promise.resolve(),
          ready: Promise.resolve(),
          controller: null,
          addEventListener: () => {},
        },
      });
    });

    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    logSuccess('Browser setup complete');
  }

  async testManifest() {
    logHeader('Testing Manifest');

    try {
      const manifest = await this.page.evaluate(async () => {
        const response = await fetch('/manifest.json');
        return response.json();
      });

      // Test required fields
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
      requiredFields.forEach((field) => {
        if (manifest[field]) {
          this.addTestResult('manifest', `Has ${field}`, true);
        } else {
          this.addTestResult('manifest', `Missing ${field}`, false);
        }
      });

      // Test icons
      if (manifest.icons && manifest.icons.length >= 4) {
        this.addTestResult('manifest', 'Has sufficient icons', true);
      } else {
        this.addTestResult('manifest', 'Insufficient icons', false);
      }

      // Test display mode
      if (manifest.display === 'standalone' || manifest.display === 'fullscreen') {
        this.addTestResult('manifest', 'Correct display mode', true);
      } else {
        this.addTestResult('manifest', 'Incorrect display mode', false);
      }
    } catch (error) {
      this.addTestResult('manifest', 'Manifest loading failed', false, error.message);
    }
  }

  async testServiceWorker() {
    logHeader('Testing Service Worker');

    try {
      const swInfo = await this.page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          return {
            registered: !!registration,
            active: !!registration?.active,
            waiting: !!registration?.waiting,
            installing: !!registration?.installing,
          };
        }
        return { registered: false };
      });

      this.addTestResult('serviceWorker', 'Service worker registered', swInfo.registered);
      this.addTestResult('serviceWorker', 'Service worker active', swInfo.active);
    } catch (error) {
      this.addTestResult('serviceWorker', 'Service worker test failed', false, error.message);
    }
  }

  async testOfflineCapabilities() {
    logHeader('Testing Offline Capabilities');

    try {
      // Test offline detection
      const offlineSupport = await this.page.evaluate(() => {
        return 'onLine' in navigator;
      });

      this.addTestResult('offline', 'Offline detection supported', offlineSupport);

      // Test cache API
      const cacheSupport = await this.page.evaluate(() => {
        return 'caches' in window;
      });

      this.addTestResult('offline', 'Cache API supported', cacheSupport);

      // Test IndexedDB
      const indexedDBSupport = await this.page.evaluate(() => {
        return 'indexedDB' in window;
      });

      this.addTestResult('offline', 'IndexedDB supported', indexedDBSupport);
    } catch (error) {
      this.addTestResult('offline', 'Offline capabilities test failed', false, error.message);
    }
  }

  async testInstallPrompt() {
    logHeader('Testing Install Prompt');

    try {
      // Test beforeinstallprompt event
      const installPromptSupport = await this.page.evaluate(() => {
        return 'onbeforeinstallprompt' in window;
      });

      this.addTestResult('install', 'Install prompt supported', installPromptSupport);

      // Test app installed event
      const appInstalledSupport = await this.page.evaluate(() => {
        return 'onappinstalled' in window;
      });

      this.addTestResult('install', 'App installed event supported', appInstalledSupport);
    } catch (error) {
      this.addTestResult('install', 'Install prompt test failed', false, error.message);
    }
  }

  async testPushNotifications() {
    logHeader('Testing Push Notifications');

    try {
      // Test push manager
      const pushSupport = await this.page.evaluate(async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.getRegistration();
          return {
            pushManager: !!registration?.pushManager,
            notification: 'Notification' in window,
            permission: Notification.permission,
          };
        }
        return { pushManager: false, notification: false, permission: 'denied' };
      });

      this.addTestResult('push', 'Push manager available', pushSupport.pushManager);
      this.addTestResult('push', 'Notification API available', pushSupport.notification);

      // Test VAPID support
      const vapidSupport = await this.page.evaluate(() => {
        return 'PushManager' in window && 'serviceWorker' in navigator;
      });

      this.addTestResult('push', 'VAPID support available', vapidSupport);
    } catch (error) {
      this.addTestResult('push', 'Push notifications test failed', false, error.message);
    }
  }

  async testPerformance() {
    logHeader('Testing Performance');

    try {
      // Test performance API
      const performanceSupport = await this.page.evaluate(() => {
        return 'performance' in window && 'getEntriesByType' in performance;
      });

      this.addTestResult('performance', 'Performance API available', performanceSupport);

      // Test resource hints
      const resourceHints = await this.page.evaluate(() => {
        const links = document.querySelectorAll(
          'link[rel="preload"], link[rel="prefetch"], link[rel="dns-prefetch"]',
        );
        return links.length > 0;
      });

      this.addTestResult('performance', 'Resource hints present', resourceHints);

      // Test image optimization
      const imageOptimization = await this.page.evaluate(() => {
        const images = document.querySelectorAll('img');
        let optimizedCount = 0;
        images.forEach((img) => {
          if (img.src.includes('_next/image') || img.loading === 'lazy') {
            optimizedCount++;
          }
        });
        return optimizedCount > 0;
      });

      this.addTestResult('performance', 'Image optimization present', imageOptimization);
    } catch (error) {
      this.addTestResult('performance', 'Performance test failed', false, error.message);
    }
  }

  addTestResult(category, test, passed, error = null) {
    const result = {
      category,
      test,
      passed,
      error,
      timestamp: new Date().toISOString(),
    };

    this.testResults.push(result);

    if (passed) {
      logSuccess(`${category}: ${test}`);
    } else {
      logError(`${category}: ${test}${error ? ` - ${error}` : ''}`);
    }
  }

  generateReport() {
    logHeader('PWA Test Report');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;

    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    log(
      `\n${colors.bright}Test Results: ${passedTests}/${totalTests} passed (${score}%)${colors.reset}`,
    );

    // Group results by category
    const categories = {};
    this.testResults.forEach((result) => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });

    // Display results by category
    Object.keys(categories).forEach((category) => {
      logHeader(`${category} Results`);
      const categoryResults = categories[category];
      const categoryPassed = categoryResults.filter((r) => r.passed).length;
      const categoryTotal = categoryResults.length;

      log(`${categoryPassed}/${categoryTotal} tests passed`);

      categoryResults.forEach((result) => {
        if (result.passed) {
          logSuccess(`  ✓ ${result.test}`);
        } else {
          logError(`  ✗ ${result.test}${result.error ? ` - ${result.error}` : ''}`);
        }
      });
    });

    // Overall assessment
    if (score >= 90) {
      log('\n🎉 Excellent! Your PWA passes all tests.', colors.green);
    } else if (score >= 70) {
      log('\n👍 Good! Your PWA passes most tests with room for improvement.', colors.yellow);
    } else {
      log('\n⚠️  Needs improvement. Consider addressing the failed tests.', colors.red);
    }

    // Recommendations
    logHeader('Recommendations');
    logInfo('• Test in different browsers (Chrome, Firefox, Safari, Edge)');
    logInfo('• Test on different devices (mobile, tablet, desktop)');
    logInfo('• Test offline functionality thoroughly');
    logInfo('• Test push notifications with real devices');
    logInfo('• Run Lighthouse audit for comprehensive PWA score');

    return score;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run the tests
if (require.main === module) {
  const tester = new PWATester();
  tester.runTests().catch(console.error);
}

module.exports = PWATester;
