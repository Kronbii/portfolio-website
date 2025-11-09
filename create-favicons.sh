#!/bin/bash

# Script to create favicons
# You'll need to install ImageMagick first: sudo apt install imagemagick

cd /home/kronbii/repos/portfolio-website/public

# Create 192x192 icon
convert og-image.jpg -resize 192x192 icon-192.png

# Create 512x512 icon
convert og-image.jpg -resize 512x512 icon-512.png

# Create apple touch icon (180x180)
convert og-image.jpg -resize 180x180 apple-touch-icon.png

# Create favicon.ico (16x16, 32x32, 48x48 multi-size)
convert og-image.jpg -resize 48x48 -define icon:auto-resize=48,32,16 favicon.ico

echo "✅ Favicons created successfully!"
ls -lh favicon.ico icon-*.png apple-touch-icon.png
