#!/usr/bin/env node

/**
 * PWA Chrome Testing Script
 * 
 * This script helps test PWA features with Chrome
 * Run with: node scripts/test-pwa-chrome.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PWA_URL = 'http://localhost:3000';
const REPORT_DIR = 'pwa-test-reports';

async function testPWAWithChrome() {
  console.log('🚀 Starting PWA Chrome Testing...\n');

  // Create reports directory
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR);
  }

  const browser = await puppeteer.launch({
    headless: false, // Show browser for visual testing
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    console.log('📱 Testing PWA Features...\n');

    // 1. Test Manifest
    console.log('1️⃣ Testing Web App Manifest...');
    await testManifest(page);
    
    // 2. Test Service Worker
    console.log('2️⃣ Testing Service Worker...');
    await testServiceWorker(page);
    
    // 3. Test Offline Functionality
    console.log('3️⃣ Testing Offline Functionality...');
    await testOfflineFunctionality(page);
    
    // 4. Test Install Prompt
    console.log('4️⃣ Testing Install Prompt...');
    await testInstallPrompt(page);
    
    // 5. Test Push Notifications
    console.log('5️⃣ Testing Push Notifications...');
    await testPushNotifications(page);
    
    // 6. Test Performance
    console.log('6️⃣ Testing Performance...');
    await testPerformance(page);

    console.log('✅ PWA Chrome Testing Complete!');
    console.log(`📊 Reports saved to: ${REPORT_DIR}/`);

  } catch (error) {
    console.error('❌ PWA Testing Failed:', error);
  } finally {
    await browser.close();
  }
}

async function testManifest(page) {
  try {
    await page.goto(PWA_URL, { waitUntil: 'networkidle0' });
    
    // Check if manifest exists
    const manifest = await page.evaluate(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      return manifestLink ? manifestLink.href : null;
    });

    if (manifest) {
      console.log('   ✅ Manifest link found:', manifest);
      
      // Fetch and validate manifest
      const manifestResponse = await page.goto(manifest);
      const manifestContent = await manifestResponse.json();
      
      const manifestReport = {
        timestamp: new Date().toISOString(),
        url: manifest,
        content: manifestContent,
        validation: {
          hasName: !!manifestContent.name,
          hasShortName: !!manifestContent.short_name,
          hasIcons: !!manifestContent.icons && manifestContent.icons.length > 0,
          hasStartUrl: !!manifestContent.start_url,
          hasDisplay: !!manifestContent.display,
          hasThemeColor: !!manifestContent.theme_color,
          hasBackgroundColor: !!manifestContent.background_color
        }
      };

      fs.writeFileSync(
        path.join(REPORT_DIR, 'manifest-test.json'),
        JSON.stringify(manifestReport, null, 2)
      );

      console.log('   ✅ Manifest validation complete');
      console.log('   📊 Manifest report saved');
    } else {
      console.log('   ❌ No manifest link found');
    }
  } catch (error) {
    console.log('   ❌ Manifest test failed:', error.message);
  }
}

async function testServiceWorker(page) {
  try {
    await page.goto(PWA_URL, { waitUntil: 'networkidle0' });
    
    // Check service worker registration
    const swInfo = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            resolve({
              hasServiceWorker: registrations.length > 0,
              registrations: registrations.map(reg => ({
                scope: reg.scope,
                active: !!reg.active,
                installing: !!reg.installing,
                waiting: !!reg.waiting
              }))
            });
          });
        } else {
          resolve({ hasServiceWorker: false, error: 'Service Worker not supported' });
        }
      });
    });

    if (swInfo.hasServiceWorker) {
      console.log('   ✅ Service Worker registered');
      console.log('   📍 Scope:', swInfo.registrations[0].scope);
      console.log('   🔄 Active:', swInfo.registrations[0].active);
    } else {
      console.log('   ❌ No Service Worker found');
    }

    const swReport = {
      timestamp: new Date().toISOString(),
      url: PWA_URL,
      serviceWorkerInfo: swInfo
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, 'service-worker-test.json'),
      JSON.stringify(swReport, null, 2)
    );

    console.log('   📊 Service Worker report saved');
  } catch (error) {
    console.log('   ❌ Service Worker test failed:', error.message);
  }
}

async function testOfflineFunctionality(page) {
  try {
    await page.goto(PWA_URL, { waitUntil: 'networkidle0' });
    
    // Go offline
    await page.setOfflineMode(true);
    console.log('   🔌 Set offline mode');
    
    // Try to navigate
    await page.reload({ waitUntil: 'networkidle0' });
    const offlineContent = await page.content();
    
    // Check for offline indicator
    const hasOfflineIndicator = await page.evaluate(() => {
      return document.querySelector('[data-offline-indicator]') !== null ||
             document.body.textContent.includes('offline') ||
             document.body.textContent.includes('Offline');
    });

    if (hasOfflineIndicator) {
      console.log('   ✅ Offline functionality working');
    } else {
      console.log('   ⚠️  Offline indicator not found');
    }

    // Go back online
    await page.setOfflineMode(false);
    console.log('   🔌 Restored online mode');

    const offlineReport = {
      timestamp: new Date().toISOString(),
      url: PWA_URL,
      offlineTest: {
        hasOfflineIndicator,
        contentLength: offlineContent.length
      }
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, 'offline-test.json'),
      JSON.stringify(offlineReport, null, 2)
    );

    console.log('   📊 Offline test report saved');
  } catch (error) {
    console.log('   ❌ Offline test failed:', error.message);
  }
}

async function testInstallPrompt(page) {
  try {
    await page.goto(PWA_URL, { waitUntil: 'networkidle0' });
    
    // Check for install prompt elements
    const installElements = await page.evaluate(() => {
      const installButton = document.querySelector('[data-install-button]');
      const installPrompt = document.querySelector('[data-install-prompt]');
      
      return {
        hasInstallButton: !!installButton,
        hasInstallPrompt: !!installPrompt,
        installButtonText: installButton ? installButton.textContent : null
      };
    });

    if (installElements.hasInstallButton || installElements.hasInstallPrompt) {
      console.log('   ✅ Install prompt elements found');
      if (installElements.installButtonText) {
        console.log('   📝 Install button text:', installElements.installButtonText);
      }
    } else {
      console.log('   ⚠️  No install prompt elements found');
    }

    const installReport = {
      timestamp: new Date().toISOString(),
      url: PWA_URL,
      installPromptTest: installElements
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, 'install-prompt-test.json'),
      JSON.stringify(installReport, null, 2)
    );

    console.log('   📊 Install prompt report saved');
  } catch (error) {
    console.log('   ❌ Install prompt test failed:', error.message);
  }
}

async function testPushNotifications(page) {
  try {
    await page.goto(PWA_URL, { waitUntil: 'networkidle0' });
    
    // Check notification permission
    const notificationSupport = await page.evaluate(() => {
      return {
        hasNotificationAPI: 'Notification' in window,
        permission: 'Notification' in window ? Notification.permission : 'not supported',
        hasServiceWorker: 'serviceWorker' in navigator
      };
    });

    console.log('   📱 Notification API support:', notificationSupport.hasNotificationAPI);
    console.log('   🔔 Notification permission:', notificationSupport.permission);

    // Navigate to settings page to test notification settings
    try {
      await page.goto(`${PWA_URL}/settings`, { waitUntil: 'networkidle0' });
      
      const notificationSettings = await page.evaluate(() => {
        const pushSettings = document.querySelector('[data-push-settings]');
        const notificationSettings = document.querySelector('[data-notification-settings]');
        
        return {
          hasPushSettings: !!pushSettings,
          hasNotificationSettings: !!notificationSettings
        };
      });

      if (notificationSettings.hasPushSettings || notificationSettings.hasNotificationSettings) {
        console.log('   ✅ Notification settings page found');
      } else {
        console.log('   ⚠️  No notification settings found');
      }
    } catch (error) {
      console.log('   ⚠️  Could not test notification settings page');
    }

    const pushReport = {
      timestamp: new Date().toISOString(),
      url: PWA_URL,
      pushNotificationTest: {
        ...notificationSupport,
        ...(await page.evaluate(() => {
          try {
            return {
              hasPushSettings: !!document.querySelector('[data-push-settings]'),
              hasNotificationSettings: !!document.querySelector('[data-notification-settings]')
            };
          } catch {
            return { hasPushSettings: false, hasNotificationSettings: false };
          }
        }))
      }
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, 'push-notifications-test.json'),
      JSON.stringify(pushReport, null, 2)
    );

    console.log('   📊 Push notifications report saved');
  } catch (error) {
    console.log('   ❌ Push notifications test failed:', error.message);
  }
}

async function testPerformance(page) {
  try {
    await page.goto(PWA_URL, { waitUntil: 'networkidle0' });
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        transferSize: navigation ? navigation.transferSize : 0,
        encodedBodySize: navigation ? navigation.encodedBodySize : 0
      };
    });

    console.log('   ⚡ Performance Metrics:');
    console.log('   📊 Load Time:', performanceMetrics.loadTime.toFixed(2), 'ms');
    console.log('   📊 DOM Content Loaded:', performanceMetrics.domContentLoaded.toFixed(2), 'ms');
    console.log('   📊 First Paint:', performanceMetrics.firstPaint.toFixed(2), 'ms');
    console.log('   📊 First Contentful Paint:', performanceMetrics.firstContentfulPaint.toFixed(2), 'ms');
    console.log('   📊 Transfer Size:', (performanceMetrics.transferSize / 1024).toFixed(2), 'KB');

    const performanceReport = {
      timestamp: new Date().toISOString(),
      url: PWA_URL,
      performanceMetrics
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, 'performance-test.json'),
      JSON.stringify(performanceReport, null, 2)
    );

    console.log('   📊 Performance report saved');
  } catch (error) {
    console.log('   ❌ Performance test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testPWAWithChrome().catch(console.error);
}

module.exports = { testPWAWithChrome };
