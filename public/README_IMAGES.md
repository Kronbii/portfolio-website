# Image Setup Guide

## Profile Picture

**Location**: `public/profile.jpg`

**Format**: JPG, PNG, or WebP (NOT SVG - SVG is for icons, not photos)

**Recommended size**: 800x800px or larger (square aspect ratio works best)

**What it should be**: A professional headshot or photo of yourself

---

## Project Images

**Location**: `public/projects/` folder

**Required file names**:
- `project1.jpg` (for your first project)
- `project2.jpg` (for your second project)
- `project3.jpg` (for your third project)

**Format**: JPG, PNG, or WebP (NOT SVG - these should be screenshots/photos of your projects)

**Recommended size**: 1200x800px or larger (16:9 aspect ratio works well)

**What they should be**: 
- Screenshots of your project in action
- UI/interface photos
- Demo images showing what the project does
- Screenshots from your GitHub repository or live demo

**Note**: If you have more than 3 projects, you can add more images and update the `projects` array in `components/Projects.tsx` with additional entries.

## Quick Setup

1. Add your profile picture:
   ```bash
   # Copy your image to public folder
   cp /path/to/your/photo.jpg public/profile.jpg
   ```

2. Add project images:
   ```bash
   # Copy your project images
   cp /path/to/project1.jpg public/projects/project1.jpg
   cp /path/to/project2.jpg public/projects/project2.jpg
   cp /path/to/project3.jpg public/projects/project3.jpg
   ```

## Alternative: Using Different Image Names

If you want to use different file names, update the paths in:
- `components/Hero.tsx` - line 54: `src="/profile.jpg"`
- `components/Projects.tsx` - lines 27, 36, 45: `image: '/projects/project1.jpg'`

## Note

Next.js Image component requires images to be in the `public` folder. The paths should start with `/` (e.g., `/profile.jpg` not `profile.jpg`).

