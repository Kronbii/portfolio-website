# Contact Form Setup Guide

Your contact form is now connected to a Next.js API route. Choose one of the following methods to receive emails:

## Option 1: Resend (Recommended - Easiest & Best for Vercel)

**Pros:** Modern, reliable, great free tier, works perfectly with Vercel
**Cons:** Requires API key

### Setup Steps:

1. **Sign up for Resend:**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Free tier: 3,000 emails/month

2. **Get your API key:**
   - Go to [API Keys](https://resend.com/api-keys)
   - Create a new API key
   - Copy the key

3. **Add to Vercel Environment Variables:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `your-api-key-here`
   - Redeploy your site

4. **Update the API route:**
   - Open `app/api/contact/route.ts`
   - Uncomment the Resend code (lines 25-40)
   - Install Resend: `npm install resend`
   - Update the `from` email (use your verified domain or `onboarding@resend.dev` for testing)
   - Update the `to` email to `ramykronby@gmail.com`

5. **Verify your domain (optional but recommended):**
   - In Resend dashboard, add your domain `ramikronbi.com`
   - Add DNS records as instructed
   - This allows you to send from `contact@ramikronbi.com`

## Option 2: Nodemailer with Gmail (Free but requires Gmail App Password)

**Pros:** Free, uses your existing Gmail
**Cons:** Requires Gmail App Password setup, less reliable

### Setup Steps:

1. **Enable 2-Factor Authentication on Gmail:**
   - Go to your Google Account settings
   - Enable 2FA if not already enabled

2. **Create an App Password:**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to Vercel Environment Variables:**
   - `SMTP_USER` = `ramykronby@gmail.com`
   - `SMTP_PASS` = `your-16-char-app-password`

4. **Update the API route:**
   - Open `app/api/contact/route.ts`
   - Uncomment the Nodemailer code (lines 43-66)
   - Install Nodemailer: `npm install nodemailer @types/nodemailer`

5. **Redeploy your site**

## Option 3: Formspree (Easiest - No Backend Code)

**Pros:** No code changes needed, very easy setup
**Cons:** Free tier limited, less control

### Setup Steps:

1. **Sign up for Formspree:**
   - Go to [formspree.io](https://formspree.io)
   - Sign up for free account
   - Free tier: 50 submissions/month

2. **Create a new form:**
   - Click "New Form"
   - Copy your form endpoint (e.g., `https://formspree.io/f/YOUR_FORM_ID`)

3. **Update Contact.tsx:**
   - Replace the `handleSubmit` function with:
   ```typescript
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setIsSubmitting(true)
     setSubmitStatus('idle')

     try {
       const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData),
       })

       if (!response.ok) {
         throw new Error('Failed to send message')
       }

       setSubmitStatus('success')
       setFormData({ name: '', email: '', message: '' })
       setTimeout(() => setSubmitStatus('idle'), 5000)
     } catch (error) {
       setSubmitStatus('error')
       setTimeout(() => setSubmitStatus('idle'), 5000)
     } finally {
       setIsSubmitting(false)
     }
   }
   ```
   - Replace `YOUR_FORM_ID` with your actual Formspree form ID

## Option 4: EmailJS (Client-Side Only)

**Pros:** No backend needed, free tier available
**Cons:** API keys exposed in client code (less secure)

### Setup Steps:

1. **Sign up for EmailJS:**
   - Go to [emailjs.com](https://www.emailjs.com)
   - Sign up for free account

2. **Create email service:**
   - Connect your Gmail account
   - Create an email template

3. **Get your keys:**
   - Service ID, Template ID, Public Key

4. **Update Contact.tsx:**
   - Install: `npm install @emailjs/browser`
   - Add EmailJS code to handleSubmit

## Recommended: Resend

I recommend **Resend** because:
- ✅ Modern and reliable
- ✅ Great free tier (3,000 emails/month)
- ✅ Works perfectly with Vercel
- ✅ Professional email delivery
- ✅ Easy to set up
- ✅ Can use custom domain

## Testing Your Form

After setup:

1. **Test locally:**
   ```bash
   npm run dev
   ```
   Fill out the form and check your email

2. **Test on production:**
   - Deploy to Vercel
   - Fill out the form on your live site
   - Check your email inbox

## Troubleshooting

### Emails not arriving?
- Check spam folder
- Verify API keys are set correctly in Vercel
- Check Vercel function logs: Vercel Dashboard → Your Project → Functions
- Ensure email service is properly configured

### CORS errors?
- Make sure you're using the API route (`/api/contact`)
- Check that headers are set correctly

### Form not submitting?
- Open browser console (F12) to see errors
- Check network tab for failed requests
- Verify the API route is deployed

## Current Status

Right now, the form:
- ✅ Validates input
- ✅ Sends to `/api/contact` endpoint
- ✅ Shows success/error messages
- ⚠️ Logs to console (needs email service setup)

**Next step:** Choose one of the options above and follow the setup steps!

