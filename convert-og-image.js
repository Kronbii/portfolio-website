const sharp = require('sharp');
const fs = require('fs');

const sourceImage = 'public/newogimage.jpeg';

async function convertOGImage() {
  try {
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      console.log('\n💡 Make sure your OG image is named "newogimage.jpeg" in the public folder');
      return;
    }

    console.log(`🔄 Converting ${sourceImage} to OG image formats...\n`);

    // OG image standard size: 1200x630 (1.91:1 aspect ratio)
    console.log('📱 Creating OG images (1200x630 for social sharing)...');
    
    await sharp(sourceImage)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toFile('public/og-image.jpg');
    console.log('   ✅ og-image.jpg created (1200x630)');

    await sharp(sourceImage)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile('public/og-image.webp');
    console.log('   ✅ og-image.webp created (1200x630)');

    console.log('\n✨ OG image conversion complete!');
    console.log('\n📋 Updated files:');
    console.log('   - og-image.jpg (for social sharing)');
    console.log('   - og-image.webp (optimized version)');
    console.log('\n💡 These images will appear when your site is shared on:');
    console.log('   - Twitter/X, Facebook, LinkedIn, Discord, Slack, etc.');

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    console.log('\n💡 Make sure your image file is a valid image format (JPEG, PNG, WebP, etc.)');
  }
}

convertOGImage();

