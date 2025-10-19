#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple 1x1 PNG in base64 (orange color #f97316)
const simplePNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Convert base64 to buffer
const iconBuffer = Buffer.from(simplePNG, 'base64');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, iconBuffer);
  console.log(`Created ${filename}`);
});

// Create apple-window-icon
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), iconBuffer);
console.log('Created apple-touch-icon.png');

console.log('Simple icons created successfully!');
