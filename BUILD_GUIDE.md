# 🚀 God's Eye View - Build & Deployment Guide

## Local Development

### Prerequisites
- Node.js 24.14.0 or later (or 26.x)
- npm or yarn
- Git

### Quick Start

```bash
# Clone and install
git clone https://github.com/stampsiteapp-alt/gods-eye-view.git
cd gods-eye-view
npm ci

# Run setup doctor
npm run doctor

# Start development server
npm run dev
```

Then open **http://localhost:4173** in your browser.

### Development Scripts

```bash
npm run dev              # Start dev server with hot reload
npm run dev:secure      # Start with HTTPS (macOS)
npm run build           # Production build
npm run preview         # Preview production build locally
npm run test            # Run unit tests
npm run format          # Format code
npm run format:check    # Check formatting
```

---

## Production Build

### Build for Production

```bash
npm ci
npm run build
```

Output is in the `dist/` folder — a static app ready to deploy to any static host.

### Preview Production Build

```bash
npm run preview
```

Opens on http://localhost:4173 with the built assets.

---

## Docker Deployment

### Build Docker Image

```bash
docker build -t gods-eye-view:latest .
```

### Run with Docker

```bash
docker run -p 4173:4173 gods-eye-view:latest
```

Access at **http://localhost:4173**

### Docker Compose (Recommended)

```bash
docker-compose up --build
```

---

## Environment Configuration

### Available API Keys

Create a `.env` file (or `.env.production` for production) and add optional keys:

```env
# Voice & AI
OPENAI_API_KEY=sk_live_...

# Maps & Terrain
CESIUM_ION_TOKEN=eyJhbGc...
GOOGLE_MAPS_API_KEY=AIza...

# Live Data
AISSTREAM_API_KEY=aiqsid...
FIRMS_MAP_KEY=...
TOMTOM_API_KEY=...
OPENSKY_AUTH_MODE=oauth  # or 'anon'

# Server Config
HOST=0.0.0.0
PORT=4173
NODE_ENV=production
```

**Security Note:** The app runs keyless by default. Keys are optional upgrades. In production, use environment secrets, not `.env` files in Git.

---

## Cloud Deployment

### Vercel

```bash
# Connect your GitHub repo to Vercel
# Or deploy directly:
vercel --prod
```

Vercel automatically detects the Node.js app and builds it.

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your `gods-eye-view` repo
4. Set build command: `npm ci && npm run build`
5. Set start command: `npm run preview`
6. Add environment variables in Render dashboard
7. Deploy

### AWS (EC2 + Docker)

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com

docker build -t gods-eye-view .
docker tag gods-eye-view:latest <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/gods-eye-view:latest
docker push <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/gods-eye-view:latest

# Deploy on EC2 with Docker
ssh ec2-user@your-instance
docker pull <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/gods-eye-view:latest
docker run -d -p 80:4173 <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/gods-eye-view:latest
```

### Heroku (Legacy)

```bash
heroku login
heroku create gods-eye-view
heroku config:set OPENAI_API_KEY=sk_live_...
git push heroku main
```

---

## GitHub Actions CI/CD

The repo includes `.github/workflows/build-and-deploy.yml` which:
- Runs on every push to `main`
- Checks formatting and runs tests
- Builds the app
- Builds and pushes Docker image to GitHub Container Registry

### Enable GitHub Actions

1. Go to your repo **Settings > Actions**
2. Ensure Actions are **enabled**
3. Grant necessary permissions

The workflow will automatically build and push on every commit to `main`.

---

## Performance Tips

### Production Optimization

1. **Enable Gzip Compression**
   ```nginx
   # nginx example
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Cache Static Assets** (set long TTL)
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Use a CDN** (Cloudflare, AWS CloudFront, etc.)
   - Speeds up asset delivery globally
   - Automatic caching

### Monitoring

- Check cold start time: `npm run doctor` reports startup baseline
- Monitor API costs via provider dashboards (OpenAI, Google, Cesium, etc.)
- Track browser performance via DevTools

---

## Troubleshooting

### Port Already in Use
```bash
# Free port 4173
lsof -ti:4173 | xargs kill -9
npm run dev
```

### Node Version Issues
```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm install 24.14.0
nvm use 24.14.0
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm ci
npm run build
```

### Docker Build Fails
```bash
# Clear Docker build cache
docker system prune -a
docker build --no-cache -t gods-eye-view:latest .
```

---

## First 5 Minutes in Production

1. **Verify the app loads** at `http://your-domain`
2. **Try a layer** (Flights, Satellites, etc.) — keyless
3. **Add an API key** (optional) via the **POWER UP** panel
4. **Test voice control** if you added an OpenAI key
5. **Check browser console** for errors (F12)

---

## Support & Resources

- **Repo Issues:** https://github.com/stampsiteapp-alt/gods-eye-view/issues
- **Performance:** See `docs/PERFORMANCE.md`
- **Security:** See `SECURITY.md`
- **Keys & Costs:** README has full pricing breakdown
- **YouTube Series:** https://youtube.com/playlist?list=PL6qSg2I-7_koPbDnSMo0QeeHX_RknA2uv

---

## Next Steps

1. **Customize:** Add your own data layers, adjust UI colors, extend voice commands
2. **Deploy:** Push to production via your chosen platform
3. **Monitor:** Set up logging and error tracking (Sentry, LogRocket, etc.)
4. **Scale:** Use caching, CDN, and load balancing as needed

Happy mapping! 🌐
