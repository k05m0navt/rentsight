#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple SVG icon for RentSight (house with chart)
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="8" fill="#f97316"/>
  <rect x="8" y="16" width="20" height="16" rx="2" fill="white"/>
  <rect x="10" y="18" width="4" height="4" fill="#f97316"/>
  <rect x="16" y="18" width="4" height="4" fill="#f97316"/>
  <rect x="22" y="18" width="4" height="4" fill="#f97316"/>
  <rect x="10" y="24" width="4" height="6" fill="#f97316"/>
  <rect x="16" y="20" width="4" height="10" fill="#f97316"/>
  <rect x="22" y="22" width="4" height="8" fill="#f97316"/>
  <polygon points="18,8 24,14 12,14" fill="white"/>
</svg>
`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // For now, we'll create a placeholder file
  // In a real implementation, you'd convert SVG to PNG
  fs.writeFileSync(filepath, '');
  console.log(`Created placeholder for ${filename}`);
});

// Create apple-touch-icon
const appleTouchIcon = createIconSVG(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), '');

console.log('Icon generation completed!');
console.log('Note: These are placeholder files. For production, use proper PNG icons.');
