const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = 'public/newicon.jpeg';

async function convertImage() {
  try {
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      return;
    }

    console.log('🔄 Converting newicon to all required formats...\n');

    // 1. Profile image - WebP and JPG (high quality, large size)
    console.log('📸 Creating profile images...');
    await sharp(sourceImage)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile('public/profile.webp');
    console.log('   ✅ profile.webp created');

    await sharp(sourceImage)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toFile('public/profile.jpg');
    console.log('   ✅ profile.jpg created');

    // 2. Favicon sizes
    console.log('\n🎯 Creating favicon sizes...');
    
    const faviconSizes = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 48, name: 'favicon-48x48.png' },
      { size: 192, name: 'icon-192.png' },
      { size: 512, name: 'icon-512.png' },
      { size: 180, name: 'apple-touch-icon.png' },
    ];

    for (const { size, name } of faviconSizes) {
      await sharp(sourceImage)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .png()
        .toFile(`public/${name}`);
      console.log(`   ✅ ${name} created (${size}x${size})`);
    }

    // 3. Create favicon.ico (multi-size ICO file)
    console.log('\n🔷 Creating favicon.ico...');
    const icoSizes = [16, 32, 48];
    const icoImages = await Promise.all(
      icoSizes.map(size =>
        sharp(sourceImage)
          .resize(size, size, { fit: 'cover', position: 'center' })
          .png()
          .toBuffer()
      )
    );

    // For ICO, we'll create a simple 32x32 version
    // Note: sharp doesn't directly support ICO, so we'll use PNG and rename
    // Most modern browsers accept PNG as favicon.ico
    await sharp(sourceImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile('public/favicon.ico');
    console.log('   ✅ favicon.ico created (32x32 PNG format)');

    // 4. OG image (for social sharing)
    console.log('\n📱 Creating OG image...');
    await sharp(sourceImage)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toFile('public/og-image.jpg');
    console.log('   ✅ og-image.jpg created');

    await sharp(sourceImage)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile('public/og-image.webp');
    console.log('   ✅ og-image.webp created');

    console.log('\n✨ All conversions complete!');
    console.log('\n📋 Summary:');
    console.log('   - Profile images: profile.jpg, profile.webp');
    console.log('   - Favicons: favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-48x48.png');
    console.log('   - App icons: icon-192.png, icon-512.png, apple-touch-icon.png');
    console.log('   - OG images: og-image.jpg, og-image.webp');

  } catch (error) {
    console.error('❌ Error during conversion:', error);
  }
}

convertImage();

