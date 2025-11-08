# Local Development Setup Guide

## Step 1: Install Node.js and npm

Since you're on Linux, here are the installation options:

### Option A: Using NodeSource (Recommended - Latest LTS)
```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Option B: Using nvm (Node Version Manager - Recommended for developers)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

### Option C: Using apt (Ubuntu/Debian - May have older version)
```bash
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

## Step 2: Install Project Dependencies

Once Node.js is installed, navigate to the project directory and install dependencies:

```bash
cd /home/kronbii/repos/portfolio-website
npm install
```

This will install all required packages (Next.js, React, Tailwind CSS, Framer Motion, etc.)

## Step 3: Run the Development Server

Start the local development server:

```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

## Step 4: View Your Website

Open your web browser and navigate to:
```
http://localhost:3000
```

The development server will:
- ✅ Hot reload automatically when you make changes
- ✅ Show error messages in the browser
- ✅ Provide fast refresh for React components

## Step 5: Stop the Server

Press `Ctrl + C` in the terminal to stop the development server.

## Troubleshooting

### Port 3000 already in use?
If port 3000 is busy, Next.js will automatically try the next available port (3001, 3002, etc.)

### Permission errors?
Make sure you have write permissions in the project directory.

### Module not found errors?
Delete `node_modules` and `package-lock.json`, then run `npm install` again:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Customize your content (replace all `[Placeholder: ...]` text)
2. Update social media links
3. Add your projects and skills
4. Test the contact form
5. When ready, deploy to Vercel!

