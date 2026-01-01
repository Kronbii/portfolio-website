# How to Update Your Favicon & Profile Image

## Quick Steps

1. **Place your new image** in the `public` folder
   - Name it anything (e.g., `my-new-icon.jpg`, `profile-photo.png`)
   - Supported formats: JPEG, PNG, WebP, etc.

2. **Run the conversion script:**
   ```bash
   npm run convert-favicon public/your-image.jpg
   ```
   
   Or if you name it `newicon.jpeg`:
   ```bash
   npm run convert-favicon
   ```

3. **Clear browser cache** to see the new favicon:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

4. **Restart dev server** if running:
   ```bash
   npm run dev
   ```

## What Gets Created

The script automatically creates all required sizes:

- ✅ **Profile images**: `profile.jpg`, `profile.webp` (800x800)
- ✅ **Favicons**: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`
- ✅ **App icons**: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`
- ⚠️ **OG images**: NOT updated (kept separate for social sharing banners)

## Examples

```bash
# Using a specific image file
npm run convert-favicon public/my-photo.jpg

# Using newicon.jpeg (default)
npm run convert-favicon

# Or directly with node
node convert-favicon.js public/any-image.png
```

## Tips

- **Best image size**: At least 800x800 pixels for best quality
- **Square images work best**: The script will crop to center if needed
- **File size**: Keep source image under 5MB for faster processing
- **Format**: JPEG, PNG, or WebP all work fine

## Troubleshooting

If you get an error:
- Make sure the image file exists in the `public` folder
- Check that the file is a valid image format
- Ensure `sharp` is installed: `npm install --save-dev sharp`

