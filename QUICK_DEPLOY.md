# 🚀 Quick Deploy - 5 Minutes to Live!

## Fastest Way to Deploy (Vercel)

### Step 1: Go to Vercel (1 minute)

1. Open https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### Step 2: Import Project (1 minute)

1. Click "Add New..." → "Project"
2. Find and select `e-commerce` from your repositories
3. Click "Import"

### Step 3: Configure (2 minutes)

Vercel will auto-detect your Vite project. Just add environment variable:

1. Click "Environment Variables" (before deploying)
2. Add:
   - **Name**: `VITE_PAYSTACK_PUBLIC_KEY`
   - **Value**: `pk_test_21615babab12fd85f67270ec8b1cf724b7f92d78`
3. Click "Add"

### Step 4: Deploy! (1 minute)

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. ✅ **Done!** Your site is LIVE!

Your site will be at: `https://your-project-name.vercel.app`

---

## After Deployment

### Test Your Live Site:

- [ ] Visit your Vercel URL
- [ ] Browse products
- [ ] Add items to cart
- [ ] Try checkout (use test card: `5060666666666666666`)
- [ ] Test on your phone
- [ ] Check all footer links work

### Before Accepting Real Payments:

1. **Get Live Paystack Keys**:
   - Go to https://dashboard.paystack.com
   - Complete business verification
   - Get your LIVE keys (pk*live*...)
   - Update in Vercel: Settings → Environment Variables

2. **Update Contact Info**:
   - Replace phone numbers in code
   - Update email addresses
   - Update WhatsApp number
   - Update physical address

---

## Custom Domain (Optional)

### Have a Domain?

1. In Vercel: Go to Project → Settings → Domains
2. Add your registered custom domain (for example, `your-domain.com`)
3. Update DNS records at your domain provider
4. Wait 24-48 hours
5. SSL automatically enabled!

### Don't Have a Domain?

You can buy one from:

- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Just use the free Vercel URL for now!

---

## Auto-Deploy Setup (Already Done!)

Every time you push to GitHub:

- Vercel automatically builds your site
- Deploys in 2-3 minutes
- No manual work needed!

```bash
# Make changes
git add .
git commit -m "Update products"
git push

# Vercel auto-deploys! 🎉
```

---

## Troubleshooting

### Build Failed?

- Check build logs in Vercel dashboard
- Make sure environment variable is set
- Contact me if you need help

### Payment Not Working?

- Verify `VITE_PAYSTACK_PUBLIC_KEY` is set
- Check Paystack dashboard for errors
- Use test cards for testing

### Site Not Loading?

- Clear browser cache
- Try incognito/private mode
- Check Vercel deployment status

---

## Cost: $0/month!

- ✅ Hosting: FREE (Vercel)
- ✅ SSL: FREE (auto-included)
- ✅ Deployments: UNLIMITED
- ✅ Bandwidth: Generous free tier

Only pay if you want:

- Custom domain: ~$10/year (optional)
- Pro features: $20/month (not needed)

---

## Questions?

Read the full guide: `DEPLOYMENT_GUIDE.md`

**You're all set! Deploy and start selling! 🛍️**
