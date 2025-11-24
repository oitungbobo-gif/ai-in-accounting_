# Deployment Guide - AI Accounting Training App

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Building for Production](#building-for-production)
4. [Deployment Options](#deployment-options)
5. [Testing Before Deployment](#testing-before-deployment)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure you have:
- Node.js 18.x or higher
- npm or yarn package manager
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Access to a hosting platform (Vercel, Netlify, AWS, etc.)

---

## Environment Setup

### 1. Create Environment Files

Copy the example environment file:
```bash
cp .env.example .env.local
```

### 2. Configure API Keys

Edit `.env.local` and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Never commit `.env.local` or `.env.production` with real API keys to version control!

### 3. Environment Variables Explanation

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI chatbot functionality
- `VITE_APP_NAME`: Application name (displayed in UI)
- `VITE_APP_VERSION`: Current version number
- `VITE_ENV`: Current environment (development/staging/production)
- `VITE_ENABLE_CHATBOT`: Feature flag to enable/disable chatbot
- `VITE_ENABLE_ANALYTICS`: Feature flag for analytics tracking

---

## Building for Production

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

Ensure all tests pass before building:
```bash
npm run test:run
```

### 3. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 4. Preview Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build locally.

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers seamless deployment for Vite applications.

#### Deploy via CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Deploy via GitHub:
1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variables in Vercel project settings
4. Deploy automatically on push

#### Environment Variables in Vercel:
1. Go to Project Settings → Environment Variables
2. Add `VITE_GEMINI_API_KEY` and other variables
3. Select appropriate environments (Production/Preview/Development)

---

### Option 2: Netlify

#### Deploy via CLI:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Deploy via GitHub:
1. Push code to GitHub
2. Connect repository in [Netlify Dashboard](https://app.netlify.com/)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site Settings → Build & Deploy

---

### Option 3: GitHub Pages

#### Using gh-pages package:
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json
# "scripts": {
#   "deploy": "vite build && gh-pages -d dist"
# }

# Deploy
npm run deploy
```

**Note:** You may need to configure `base` in `vite.config.js` for GitHub Pages:
```js
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
});
```

---

### Option 4: AWS S3 + CloudFront

1. Build the application:
   ```bash
   npm run build
   ```

2. Create an S3 bucket and enable static website hosting

3. Upload the `dist/` folder contents to S3:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. Set up CloudFront distribution for HTTPS and caching

5. Configure environment variables using AWS Systems Manager Parameter Store or Secrets Manager

---

### Option 5: Docker Deployment

#### Create Dockerfile:
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and run:
```bash
docker build -t ai-accounting-training .
docker run -p 8080:80 ai-accounting-training
```

---

## Testing Before Deployment

### 1. Run Unit Tests
```bash
npm run test:run
```

### 2. Run Tests with Coverage
```bash
npm run test:coverage
```

Aim for at least 70% code coverage before deploying.

### 3. Run Linter
```bash
npm run lint
```

### 4. Manual Testing Checklist
- [ ] All slides render correctly
- [ ] Navigation (Next/Back buttons) works
- [ ] Chatbot opens and responds to messages
- [ ] Quick question buttons work
- [ ] Simulation challenges function properly
- [ ] Video loads correctly
- [ ] All external links work
- [ ] Responsive design works on mobile/tablet
- [ ] Performance is acceptable (Lighthouse score > 90)

---

## Post-Deployment Checklist

### Security
- [ ] API keys are stored as environment variables (not hardcoded)
- [ ] `.env` files are not committed to version control
- [ ] HTTPS is enabled
- [ ] Content Security Policy (CSP) headers are configured
- [ ] CORS is properly configured if using external APIs

### Performance
- [ ] Gzip/Brotli compression is enabled
- [ ] Static assets are cached properly
- [ ] Images are optimized
- [ ] Lighthouse performance score > 90

### Monitoring
- [ ] Error tracking is set up (e.g., Sentry)
- [ ] Analytics are configured (if enabled)
- [ ] Uptime monitoring is active

### Documentation
- [ ] Update README with deployment URL
- [ ] Document any environment-specific configurations
- [ ] Create runbook for common issues

---

## Rollback Strategy

If issues occur after deployment:

### Vercel/Netlify:
- Use the dashboard to rollback to a previous deployment
- Or redeploy from a specific Git commit

### AWS/Custom Hosting:
1. Keep previous build artifacts
2. Redeploy previous version:
   ```bash
   aws s3 sync dist-backup/ s3://your-bucket-name --delete
   ```

---

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Restart dev server after changing `.env` files
- Check variable names match exactly (case-sensitive)

### API Key Issues
- Verify API key is valid
- Check API quotas and limits
- Ensure API key has necessary permissions

### Performance Issues
- Enable production mode build optimizations
- Use CDN for static assets
- Implement lazy loading for routes/components
- Check bundle size: `npx vite-bundle-visualizer`

---

## Support

For issues or questions:
- Check [Vite Documentation](https://vitejs.dev/)
- Review [React Documentation](https://react.dev/)
- Open an issue in the project repository

---

## Version History

- v1.0.0 (2025-11-23): Initial deployment guide
