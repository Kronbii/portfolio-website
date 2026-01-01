const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Get the source image from command line argument or use default
const sourceImage = process.argv[2] || 'public/newicon.jpeg';

async function convertImage() {
  try {
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      console.log('\n💡 Usage: node convert-favicon.js <path-to-image>');
      console.log('   Example: node convert-favicon.js public/my-new-icon.jpg');
      console.log('   Or place your image as "newicon.jpeg" in the public folder');
      return;
    }

    console.log(`🔄 Converting ${sourceImage} to all required formats...\n`);

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

    // 3. Create favicon.ico (32x32 PNG format - most browsers accept this)
    console.log('\n🔷 Creating favicon.ico...');
    await sharp(sourceImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile('public/favicon.ico');
    console.log('   ✅ favicon.ico created (32x32 PNG format)');

    console.log('\n✨ All conversions complete!');
    console.log('\n📋 Summary:');
    console.log('   - Profile images: profile.jpg, profile.webp');
    console.log('   - Favicons: favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-48x48.png');
    console.log('   - App icons: icon-192.png, icon-512.png, apple-touch-icon.png');
    console.log('\n💡 Note: OG images (og-image.jpg/webp) are NOT updated - they remain separate for social sharing');
    console.log('\n💡 To see changes:');
    console.log('   1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)');
    console.log('   2. Restart dev server if running');

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    console.log('\n💡 Make sure your image file is a valid image format (JPEG, PNG, WebP, etc.)');
  }
}

convertImage();

