const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Get arguments from command line
const sourceImage = process.argv[2];
const targetColor = process.argv[3]; // Hex color like #FF0000 or #ff0000

if (!sourceImage || !targetColor) {
  console.error('❌ Missing required arguments');
  console.log('\n💡 Usage: node change-favicon-color.js <source-image> <target-color>');
  console.log('   Example: node change-favicon-color.js public/favicon-32x32.png #FF5733');
  console.log('   Example: node change-favicon-color.js public/black-hole.png #00FF00');
  process.exit(1);
}

// Validate hex color format
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
if (!hexColorRegex.test(targetColor)) {
  console.error(`❌ Invalid color format: ${targetColor}`);
  console.log('   Color must be in hex format: #RRGGBB or #RGB');
  console.log('   Examples: #FF0000, #00FF00, #0000FF, #FFF, #000');
  process.exit(1);
}

// Parse hex color to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

async function changeFaviconColor() {
  try {
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      return;
    }

    console.log(`🔄 Changing color of ${sourceImage} to ${targetColor}...\n`);

    // Get image metadata
    const metadata = await sharp(sourceImage).metadata();
    console.log(`   📐 Image size: ${metadata.width}x${metadata.height}`);
    console.log(`   🎨 Target color: ${targetColor}`);

    // Read image data
    const { data, info } = await sharp(sourceImage)
      .ensureAlpha() // Ensure alpha channel exists
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { r: targetR, g: targetG, b: targetB } = hexToRgb(targetColor);
    const channels = info.channels; // Should be 4 (RGBA) after ensureAlpha

    // Process each pixel
    for (let i = 0; i < data.length; i += channels) {
      const alpha = data[i + 3]; // Alpha channel
      
      // Only change color if pixel is not fully transparent
      if (alpha > 0) {
        // Preserve the original alpha, but change RGB to target color
        data[i] = targetR;     // Red
        data[i + 1] = targetG; // Green
        data[i + 2] = targetB; // Blue
        // data[i + 3] stays as alpha (transparency preserved)
      }
    }

    // Create output filename
    const dir = path.dirname(sourceImage);
    const ext = path.extname(sourceImage);
    const basename = path.basename(sourceImage, ext);
    const outputPath = path.join(dir, `${basename}-colored${ext}`);

    // Write the modified image
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: channels,
      },
    })
      .png()
      .toFile(outputPath);

    console.log(`\n✅ Success! Colored favicon saved to: ${outputPath}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review the new image: ${outputPath}`);
    console.log(`   2. If you like it, replace the original:`);
    console.log(`      mv ${outputPath} ${sourceImage}`);
    console.log(`   3. Clear browser cache to see changes`);

  } catch (error) {
    console.error('❌ Error during color change:', error.message);
    console.log('\n💡 Make sure your image file is a valid PNG with transparency');
  }
}

changeFaviconColor();

