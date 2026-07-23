# Deployment Guide

Your blog & micro-blog platform is ready to deploy! Here are the steps.

## Quick Deployment to Vercel (Recommended)

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub account (Vercel integrates with GitHub)

### Steps

1. **Push to GitHub**
   ```bash
   cd c:\Users\z003k7tr\Downloads\mblog
   git add .
   git commit -m "Initial blog and micro-blog setup"
   git remote add origin https://github.com/YOUR_USERNAME/mblog.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to vercel.com/import
   - Select "GitHub" and find your `mblog` repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel dashboard, add to your project:
   ```
   ADMIN_PASSWORD=your_secure_password
   NEXT_PUBLIC_SITE_TITLE=My Blog
   NEXT_PUBLIC_SITE_DESCRIPTION=Personal blog
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds from `main` branch
   - Your site goes live at `mblog.vercel.app`

5. **Enable Auto-Deploy**
   - Push to `main` branch and Vercel automatically redeploys
   - Perfect for adding new posts!

## Manual Deployment

### Self-Hosted (Linux/Windows Server)

1. **Build**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm run start
   ```

3. **Use PM2 (for background process)**
   ```bash
   npm install -g pm2
   pm2 start "npm run start" --name "mblog"
   pm2 startup
   pm2 save
   ```

4. **Use Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
       }
   }
   ```

5. **SSL with Let's Encrypt**
   ```bash
   certbot --nginx -d yourdomain.com
   ```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mblog .
docker run -p 3000:3000 -e ADMIN_PASSWORD=secure mblog
```

## Other Hosting Options

### Netlify
- Connect GitHub repo
- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variables in dashboard

### Railway
- Connect GitHub repo
- Auto-detects Next.js
- Deploy with one click

### DigitalOcean App Platform
- Connect GitHub
- Auto-detects Node.js/Next.js
- Set environment variables
- Deploy

### AWS Amplify
- Connect GitHub
- Configure build settings
- Deploy

## Important: Content Persistence

Your content files are in the `/content` folder:
- `content/blog/` - Blog posts
- `content/pages/` - Custom pages
- `content/microposts/` - Micro-posts

**These files should be committed to Git** so they deploy with your app.

## Updating Content After Deployment

### On Vercel
1. Create/edit markdown file locally
2. Commit and push to GitHub
3. Vercel automatically rebuilds and deploys
4. Changes live within 1-2 minutes

### On Self-Hosted
1. Edit markdown files in `/content`
2. Run: `npm run build && npm run start`
3. Or with PM2: `pm2 restart mblog`

## Troubleshooting

**"Content folder not found"**
- Ensure `content/` folder is committed to Git
- Check `.gitignore` doesn't exclude it

**"Admin password not working"**
- Verify environment variable set correctly
- Check `ADMIN_PASSWORD` in platform dashboard

**"Build fails on Vercel"**
- Check Node version (need 18+)
- Run `npm install` locally first
- Check for TypeScript errors: `npx tsc --noEmit`

**"Site too slow"**
- Enable Image Optimization in Vercel settings
- Add caching headers for static content
- Consider CDN for large assets

## Performance Tips

1. **Enable Vercel Analytics**
   - Monitor real user metrics
   - Identify slow pages

2. **Optimize Images**
   - Use Next.js Image component
   - Compress markdown images

3. **Enable ISR (Incremental Static Regeneration)**
   - Already configured
   - Pages regenerate on demand

4. **Monitor Build Time**
   - Keep dependencies minimal
   - Check for large packages

## Scaling & Monetization

### Add Analytics
```typescript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Enable Comments (Future)
- Integrations: Disqus, Utterances, Giscus
- Add comment UI component

### Add Newsletter (Future)
- Integrations: Mailchimp, ConvertKit, Substack

## Custom Domain

### On Vercel
1. Go to project settings → Domains
2. Add custom domain
3. Update DNS records (Vercel provides instructions)
4. HTTPS automatic

### On Other Platforms
- Follow their domain setup guide
- Point DNS to platform
- Enable HTTPS/SSL

## Backup & Recovery

### Automated Backup
Git automatically backs up all files:
```bash
# Backup to GitHub
git push origin main

# Backup to multiple remotes
git remote add backup https://github.com/username/backup-repo
git push backup main
```

### Manual Backup
```bash
# Compress entire project
tar -czf mblog-backup.tar.gz mblog/

# Copy to safe location
cp mblog-backup.tar.gz /mnt/backup/
```

## Next Steps

1. **Choose hosting** - Vercel recommended for simplicity
2. **Set up domain** - Point to your hosting
3. **Configure monitoring** - Track errors and performance
4. **Add more content** - Create blog posts
5. **Customize** - Update branding and styling

---

**Deploying soon?** Start with Vercel - it takes 5 minutes! 🚀
