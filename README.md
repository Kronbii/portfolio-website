# Portfolio Website

A modern, dark-themed portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Dark theme with muted green accents
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🚀 Optimized for performance
- 🎯 All sections: About, Projects, Skills, Services, Certifications, Standout Features, and Contact

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Update Your Information

1. **Hero Section** (`components/Hero.tsx`):
   - Update GitHub and LinkedIn links
   - Modify the introduction text

2. **About Section** (`components/About.tsx`):
   - Replace placeholder text with your bio

3. **Projects Section** (`components/Projects.tsx`):
   - Update the `projects` array with your actual projects
   - Add GitHub links and descriptions

4. **Skills Section** (`components/Skills.tsx`):
   - Modify the `skillCategories` array to match your skills

5. **Services Section** (`components/Services.tsx`):
   - Update the `services` array with your offerings

6. **Certifications Section** (`components/Certifications.tsx`):
   - Replace placeholder certifications with your actual ones

7. **Standout Section** (`components/Standout.tsx`):
   - Add what makes you unique in the market

8. **Contact Section** (`components/Contact.tsx`):
   - Update email address
   - Set up a form handler (Formspree, EmailJS, or API route)
   - Update social media links

### Setting Up Contact Form

The contact form currently has placeholder functionality. To make it work, you can:

1. **Use Formspree**: Sign up at [formspree.io](https://formspree.io) and update the form action
2. **Use EmailJS**: Set up EmailJS and configure it
3. **Create an API Route**: Create a Next.js API route to handle form submissions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icons

## License

This project is open source and available under the MIT License.

