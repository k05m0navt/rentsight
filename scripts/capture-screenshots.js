#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshots() {
  console.log('Starting screenshot capture...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for desktop screenshot
    await page.setViewport({ width: 1280, height: 720 });
    
    // Navigate to the app
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take desktop screenshot (viewport only)
    const desktopPath = path.join(__dirname, '..', 'public', 'screenshots', 'desktop-dashboard.png');
    await page.screenshot({ 
      path: desktopPath, 
      fullPage: false  // Viewport only for consistent dimensions
    });
    console.log('✓ Desktop screenshot captured');
    
    // Set viewport for mobile screenshot
    await page.setViewport({ width: 390, height: 844 });
    
    // Wait for mobile layout to adjust
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take mobile screenshot (viewport only to maintain proper aspect ratio)
    const mobilePath = path.join(__dirname, '..', 'public', 'screenshots', 'mobile-dashboard.png');
    await page.screenshot({ 
      path: mobilePath, 
      fullPage: false  // Viewport only to maintain 390x844 ratio (2.16:1, under 2.3 limit)
    });
    console.log('✓ Mobile screenshot captured');
    
    // Try to navigate to dashboard if it exists
    try {
      await page.goto('http://localhost:3000/dashboard', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take dashboard screenshot (viewport only)
      const dashboardPath = path.join(__dirname, '..', 'public', 'screenshots', 'desktop-dashboard-detailed.png');
      await page.setViewport({ width: 1280, height: 720 });
      await page.screenshot({ 
        path: dashboardPath, 
        fullPage: false  // Viewport only for consistent dimensions
      });
      console.log('✓ Dashboard screenshot captured');
    } catch (error) {
      console.log('Dashboard page not accessible, skipping...');
    }
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
  
  console.log('Screenshot capture completed!');
}

captureScreenshots().catch(console.error);
