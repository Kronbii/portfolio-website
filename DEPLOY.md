# Deploying to Vercel

You have two options to deploy your portfolio website to Vercel:

## Option 1: Deploy via Vercel CLI (Quickest - No Git Required)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

### Step 3: Deploy
From your project directory:
```bash
cd /home/kronbii/repos/portfolio-website
vercel
```

### Step 4: Follow the prompts
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → portfolio-website (or your preferred name)
- **In which directory is your code located?** → `./` (current directory)

### Step 5: Production Deployment
After the first deployment, run:
```bash
vercel --prod
```

Your site will be live at: `https://your-project-name.vercel.app`

---

## Option 2: Deploy via GitHub (Recommended - Best for Version Control)

### Step 1: Initialize Git Repository
```bash
cd /home/kronbii/repos/portfolio-website
git init
git add .
git commit -m "Initial commit: Portfolio website"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `portfolio-website`)
3. **Don't** initialize with README, .gitignore, or license (we already have these)

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git
git branch -M main
git push -u origin main
```
(Replace `YOUR_USERNAME` with your GitHub username)

### Step 4: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login (use "Continue with GitHub" for easiest setup)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click **"Deploy"**

### Step 5: Automatic Deployments
- Every push to `main` branch = automatic production deployment
- Every pull request = preview deployment

Your site will be live at: `https://your-project-name.vercel.app`

---

## Custom Domain (Optional)

After deployment:

1. Go to your project on Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `ramikronbi.com`)
4. Follow DNS configuration instructions

---

## Environment Variables (If Needed)

If you add environment variables later:
1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Add your variables
3. Redeploy

---

## Updating Your Site

### If using Vercel CLI:
```bash
vercel --prod
```

### If using GitHub:
```bash
git add .
git commit -m "Update portfolio"
git push
```
Vercel will automatically deploy!

---

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Make sure `node_modules` is in `.gitignore`
- Run `npm run build` locally to test

### Image Issues
- Ensure images are in `public/` folder
- Check image paths in components match file names

### Deployment Fails
- Check Vercel build logs in dashboard
- Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

---

## Quick Checklist Before Deploying

- [ ] Update all placeholder text
- [ ] Add your profile picture (`public/profile.jpg`)
- [ ] Add project images (`public/projects/project1.jpg`, etc.)
- [ ] Update GitHub and LinkedIn links
- [ ] Update email address
- [ ] Test locally with `npm run build`
- [ ] Review all sections for placeholder content

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

