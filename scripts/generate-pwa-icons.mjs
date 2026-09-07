import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create SVG Icon with modern executive design
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#090D16"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Subtle inner border -->
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="#334155" stroke-width="4" stroke-opacity="0.6"/>

  <!-- Glowing Accent Hex / Polygon -->
  <path d="M 256 100 L 390 180 L 390 332 L 256 412 L 122 332 L 122 180 Z" fill="none" stroke="url(#accentGrad)" stroke-width="18" stroke-linejoin="round" opacity="0.4"/>

  <!-- High-velocity Brand Chevron / Arrow symbol -->
  <g filter="url(#glow)">
    <!-- Main stylized B / Lightning Flow -->
    <path d="M 180 150 L 300 150 C 350 150 370 180 370 215 C 370 245 350 260 320 268 C 360 276 380 300 380 335 C 380 375 345 390 295 390 L 180 390 Z" fill="none" stroke="url(#accentGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Velocity spark bar -->
    <path d="M 235 210 L 290 210" stroke="#38BDF8" stroke-width="20" stroke-linecap="round"/>
    <path d="M 235 330 L 290 330" stroke="#38BDF8" stroke-width="20" stroke-linecap="round"/>
  </g>
</svg>`;

// Save SVG to public/icon.svg
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

// 2. Generate PNG sizes
async function generateIcons() {
  const svgBuffer = Buffer.from(svgIcon);

  // 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 180x180 apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 3. Maskable icon with 15% safe padding
  // Maskable standard: 80% safe zone inside central circle
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#090D16"/>
      </linearGradient>
      <linearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="100%" stop-color="#2563EB"/>
      </linearGradient>
    </defs>
    <!-- Full bleed background (no border-radius for maskable) -->
    <rect width="512" height="512" fill="url(#bgGrad2)"/>
    <!-- Centered scaled symbol (65% size to guarantee safe zone) -->
    <g transform="translate(90, 90) scale(0.65)">
      <path d="M 180 150 L 300 150 C 350 150 370 180 370 215 C 370 245 350 260 320 268 C 360 276 380 300 380 335 C 380 375 345 390 295 390 L 180 390 Z" fill="none" stroke="url(#accentGrad2)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 235 210 L 290 210" stroke="#38BDF8" stroke-width="24" stroke-linecap="round"/>
      <path d="M 235 330 L 290 330" stroke="#38BDF8" stroke-width="24" stroke-linecap="round"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Also create favicon.ico from 32x32
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA icons:');
  console.log('- public/icon.svg');
  console.log('- public/pwa-192x192.png');
  console.log('- public/pwa-512x512.png');
  console.log('- public/pwa-maskable-512x512.png');
  console.log('- public/apple-touch-icon.png');
  console.log('- public/favicon.ico');
}

generateIcons().catch(console.error);
