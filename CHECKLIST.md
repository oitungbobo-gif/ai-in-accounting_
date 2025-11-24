# Pre-Deployment Checklist

Use this checklist before deploying to production.

## 🔐 Security

- [ ] All API keys are stored in environment variables (not hardcoded)
- [ ] `.env.local` and `.env.production` are listed in `.gitignore`
- [ ] No sensitive data is committed to version control
- [ ] HTTPS is configured for production deployment
- [ ] Security headers are properly configured (CSP, X-Frame-Options, etc.)
- [ ] CORS settings are reviewed and configured correctly
- [ ] Video file does not contain sensitive information

## 🧪 Testing

- [ ] All unit tests pass: `npm run test:run`
- [ ] Test coverage meets minimum requirements (>80%): `npm run test:coverage`
- [ ] Linting passes without errors: `npm run lint`
- [ ] Manual testing completed on all slides
- [ ] Chatbot functionality verified with real API key
- [ ] All interactive elements work as expected
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Tested on mobile devices (iOS and Android)
- [ ] Tested on different screen sizes (desktop, tablet, mobile)

## 🏗️ Build

- [ ] Production build completes successfully: `npm run build`
- [ ] Build size is optimized (check with `ls -lh dist/`)
- [ ] No console errors in production build: `npm run preview`
- [ ] All assets load correctly in preview
- [ ] Video file is accessible in production build
- [ ] Source maps are disabled for production (or properly configured)

## 🌍 Environment Configuration

- [ ] `.env.example` is up to date
- [ ] Production environment variables are documented
- [ ] `VITE_GEMINI_API_KEY` is set in deployment platform
- [ ] All required environment variables are configured
- [ ] Feature flags are set appropriately for production
- [ ] API endpoints are pointing to production URLs

## 📊 Performance

- [ ] Lighthouse performance score > 90
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Images are optimized
- [ ] Video file size is reasonable (<50MB recommended)
- [ ] Lazy loading is implemented where appropriate
- [ ] Bundle size is analyzed: `npx vite-bundle-visualizer`

## 🔄 Version Control

- [ ] All changes are committed
- [ ] Commit messages are clear and descriptive
- [ ] Version number is updated in `package.json`
- [ ] CHANGELOG.md is updated (if applicable)
- [ ] Code is pushed to main branch
- [ ] Tags are created for releases

## 🚀 Deployment Platform

### Vercel
- [ ] Project is connected to GitHub
- [ ] Environment variables are set in Vercel dashboard
- [ ] Build settings are configured correctly
- [ ] Domain is configured (if custom domain)
- [ ] Preview deployments are working

### Netlify
- [ ] Site is connected to GitHub repository
- [ ] Build command is set: `npm run build`
- [ ] Publish directory is set: `dist`
- [ ] Environment variables are configured
- [ ] Domain settings are correct
- [ ] Redirects and rewrites are working

### Docker
- [ ] Dockerfile builds successfully
- [ ] Docker image runs without errors
- [ ] Health check endpoint is accessible
- [ ] Environment variables are passed correctly
- [ ] Volume mounts are configured (if needed)

### AWS/Custom
- [ ] S3 bucket is configured for static hosting (if applicable)
- [ ] CloudFront distribution is set up (if applicable)
- [ ] Route 53 DNS is configured (if applicable)
- [ ] SSL certificate is installed
- [ ] Auto-scaling is configured (if applicable)

## 📝 Documentation

- [ ] README.md is complete and accurate
- [ ] DEPLOYMENT.md has detailed deployment instructions
- [ ] API documentation is up to date
- [ ] Environment variables are documented
- [ ] Troubleshooting guide is available
- [ ] User guide is created (if needed)

## 🎯 Functionality

- [ ] All 11 training slides display correctly
- [ ] Slide navigation works (Next/Back buttons)
- [ ] Progress bar updates correctly
- [ ] Chatbot opens and closes properly
- [ ] Chatbot responds to user messages
- [ ] Quick question buttons work
- [ ] Context-aware responses are accurate
- [ ] Simulation challenges function correctly
- [ ] All external links open correctly
- [ ] Video plays without issues
- [ ] All icons render correctly
- [ ] Animations work smoothly

## 🎨 UI/UX

- [ ] All fonts load correctly
- [ ] Colors match design specifications
- [ ] Responsive design works on all breakpoints
- [ ] Touch targets are appropriately sized for mobile
- [ ] Text is readable on all backgrounds
- [ ] Focus states are visible for keyboard navigation
- [ ] Loading states are implemented
- [ ] Error states are handled gracefully

## ♿ Accessibility

- [ ] ARIA labels are present where needed
- [ ] Keyboard navigation works throughout the app
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Screen reader compatibility tested
- [ ] Alternative text for images/videos
- [ ] Focus management is proper
- [ ] No keyboard traps exist

## 📈 Analytics & Monitoring (Optional)

- [ ] Analytics tracking is implemented (if enabled)
- [ ] Error tracking is set up (e.g., Sentry)
- [ ] Performance monitoring is configured
- [ ] Custom events are tracked
- [ ] User flow is monitored

## 🔔 Post-Deployment

- [ ] Deployment notification sent to team
- [ ] Production URL is verified and accessible
- [ ] Smoke tests completed on production
- [ ] Monitoring dashboards are checked
- [ ] Rollback plan is ready
- [ ] Team is informed of new features/changes
- [ ] User documentation is updated with production URL

## 🆘 Emergency Contacts

Document who to contact if issues arise:
- **Technical Lead**: [Name/Email]
- **DevOps**: [Name/Email]
- **Product Owner**: [Name/Email]
- **On-Call Engineer**: [Name/Email]

## 📅 Deployment Schedule

- **Deployment Date**: _______________
- **Deployment Time**: _______________
- **Deployed By**: _______________
- **Deployment Method**: Vercel / Netlify / Docker / AWS / Other: _______________
- **Rollback Deadline**: _______________

---

## Sign-off

- [ ] Technical Review Completed By: _______________ Date: _______________
- [ ] QA Approved By: _______________ Date: _______________
- [ ] Product Owner Approved By: _______________ Date: _______________
- [ ] Ready for Production Deployment

---

**Notes:**
