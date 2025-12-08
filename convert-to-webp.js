const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images to convert
const imagesToConvert = [
  // Profile image
  { src: 'public/profile.jpg', dest: 'public/profile.webp', quality: 85 },
  
  // Project images
  { src: 'public/projects/nasa-space-apps.jpeg', dest: 'public/projects/nasa-space-apps.webp', quality: 85 },
  { src: 'public/projects/nasna.jpeg', dest: 'public/projects/nasna.webp', quality: 85 },
  { src: 'public/projects/thermal-sr.png', dest: 'public/projects/thermal-sr.webp', quality: 90 },
  { src: 'public/projects/race-car.png', dest: 'public/projects/race-car.webp', quality: 90 },
  { src: 'public/projects/smart-desk.png', dest: 'public/projects/smart-desk.webp', quality: 90 },
  { src: 'public/projects/physics-day-1.jpg', dest: 'public/projects/physics-day-1.webp', quality: 85 },
  { src: 'public/projects/physics-day-2.jpg', dest: 'public/projects/physics-day-2.webp', quality: 85 },
  { src: 'public/projects/project1.jpg', dest: 'public/projects/project1.webp', quality: 85 },
  { src: 'public/projects/project2.jpg', dest: 'public/projects/project2.webp', quality: 85 },
  { src: 'public/projects/project3.jpg', dest: 'public/projects/project3.webp', quality: 85 },
  
  // OG image
  { src: 'public/og-image.jpg', dest: 'public/og-image.webp', quality: 85 },
];

async function convertImage({ src, dest, quality }) {
  try {
    if (!fs.existsSync(src)) {
      console.log(`⚠️  Skipping ${src} - file not found`);
      return;
    }

    const stats = fs.statSync(src);
    const originalSize = (stats.size / 1024).toFixed(2);

    await sharp(src)
      .webp({ quality })
      .toFile(dest);

    const newStats = fs.statSync(dest);
    const newSize = (newStats.size / 1024).toFixed(2);
    const savings = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);

    console.log(`✅ ${path.basename(src)} → ${path.basename(dest)}`);
    console.log(`   ${originalSize} KB → ${newSize} KB (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error converting ${src}:`, error.message);
  }
}

async function convertAll() {
  console.log('🔄 Converting images to WebP...\n');
  
  for (const image of imagesToConvert) {
    await convertImage(image);
  }
  
  console.log('\n✨ Conversion complete!');
}

convertAll().catch(console.error);

