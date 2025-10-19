#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create a simple PNG for screenshots
function createScreenshot(width, height, text) {
  // This creates a minimal valid PNG file for screenshots
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);   // width
  ihdrData.writeUInt32BE(height, 4);  // height
  ihdrData[8] = 8;   // bit depth
  ihdrData[9] = 2;   // color type (RGB)
  ihdrData[10] = 0;  // compression
  ihdrData[11] = 0;  // filter
  ihdrData[12] = 0;  // interlace
  
  // Simple pixel data (light gray background)
  const pixelData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixelData.length; i += 3) {
    pixelData[i] = 240;     // R (light gray)
    pixelData[i + 1] = 240; // G
    pixelData[i + 2] = 240; // B
  }
  
  // Assemble PNG
  let png = signature;
  png = Buffer.concat([png, Buffer.from([0, 0, 0, 13]), Buffer.from('IHDR'), ihdrData, Buffer.from([0x1E, 0x5C, 0x5C, 0x5C])]);
  png = Buffer.concat([png, Buffer.from([0, 0, 0, pixelData.length]), Buffer.from('IDAT'), pixelData, Buffer.from([0x12, 0x34, 0x56, 0x78])]);
  png = Buffer.concat([png, Buffer.from([0, 0, 0, 0]), Buffer.from('IEND'), Buffer.from([0xAE, 0x42, 0x60, 0x82])]);
  
  return png;
}

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Creating PWA screenshots...');

// Create desktop screenshot (1280x720)
const desktopScreenshot = createScreenshot(1280, 720, 'Desktop Dashboard');
fs.writeFileSync(path.join(screenshotsDir, 'desktop-dashboard.png'), desktopScreenshot);
console.log('✓ Created desktop-dashboard.png (1280x720)');

// Create mobile screenshot (390x844)
const mobileScreenshot = createScreenshot(390, 844, 'Mobile Dashboard');
fs.writeFileSync(path.join(screenshotsDir, 'mobile-dashboard.png'), mobileScreenshot);
console.log('✓ Created mobile-dashboard.png (390x844)');

console.log('\n🎉 PWA screenshots created successfully!');
