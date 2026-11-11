import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgPath = path.resolve('public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('✓ Generated public/pwa-192x192.png');

  // 2. 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('✓ Generated public/pwa-512x512.png');

  // 3. Apple Touch Icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('✓ Generated public/apple-touch-icon.png');

  // 4. Maskable 512x512 (with 15% safe padding on solid background)
  const innerIcon = await sharp(svgBuffer)
    .resize(384, 384)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: '#0f172a',
    },
  })
    .composite([
      {
        input: innerIcon,
        top: 64,
        left: 64,
      },
    ])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('✓ Generated public/pwa-maskable-512x512.png');

  // 5. Favicon
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.resolve('public/favicon.ico'));
  console.log('✓ Generated public/favicon.ico');
}

generateIcons().catch(console.error);
