const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Get the source image from command line argument
const sourceImage = process.argv[2];

if (!sourceImage) {
  console.error('❌ Missing source image argument');
  console.log('\n💡 Usage: node convert-favicons-only.js <path-to-image>');
  console.log('   Example: node convert-favicons-only.js public/black-hole.png');
  console.log('\n⚠️  This script ONLY updates favicons, NOT profile images!');
  process.exit(1);
}

async function convertFaviconsOnly() {
  try {
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      return;
    }

    console.log(`🔄 Converting ${sourceImage} to favicon formats only...\n`);
    console.log('⚠️  Profile images will NOT be updated by this script.\n');

    // Favicon sizes only
    console.log('🎯 Creating favicon sizes...');
    
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

    // Create favicon.ico (32x32 PNG format - most browsers accept this)
    console.log('\n🔷 Creating favicon.ico...');
    await sharp(sourceImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile('public/favicon.ico');
    console.log('   ✅ favicon.ico created (32x32 PNG format)');

    console.log('\n✨ Favicon conversion complete!');
    console.log('\n📋 Updated favicon files:');
    console.log('   - favicon.ico');
    console.log('   - favicon-16x16.png, favicon-32x32.png, favicon-48x48.png');
    console.log('   - icon-192.png, icon-512.png');
    console.log('   - apple-touch-icon.png');
    console.log('\n💡 Profile images (profile.jpg, profile.webp) were NOT changed.');
    console.log('💡 Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R) to see changes');

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    console.log('\n💡 Make sure your image file is a valid image format (JPEG, PNG, WebP, etc.)');
  }
}

convertFaviconsOnly();

