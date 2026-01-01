const sharp = require('sharp');
const fs = require('fs');

// Try different possible filenames
const possibleFiles = [
  'public/black-hole.png',
  'public/blackhole.png',
  'public/blackhole.jpg',
  'public/blackhole.jpeg',
];

const sourceImage = possibleFiles.find(file => fs.existsSync(file)) || 'public/black-hole.png';

async function convertBlackholeFavicon() {
  try {
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Blackhole icon not found.`);
      console.log('\n💡 Please place your blackhole icon in the public folder as:');
      console.log('   - black-hole.png');
      console.log('   - blackhole.png');
      console.log('   - blackhole.jpg');
      return;
    }

    console.log(`🔄 Converting ${sourceImage} to all favicon formats...\n`);

    // Favicon sizes
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

    // Create favicon.ico
    console.log('\n🔷 Creating favicon.ico...');
    await sharp(sourceImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile('public/favicon.ico');
    console.log('   ✅ favicon.ico created (32x32 PNG format)');

    console.log('\n✨ Blackhole favicon conversion complete!');
    console.log('\n📋 Updated favicon files:');
    console.log('   - favicon.ico (browser tab icon)');
    console.log('   - favicon-16x16.png, favicon-32x32.png, favicon-48x48.png');
    console.log('   - icon-192.png, icon-512.png (PWA icons)');
    console.log('   - apple-touch-icon.png (iOS)');
    console.log('\n💡 Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R) to see the new blackhole icon!');

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
  }
}

convertBlackholeFavicon();
