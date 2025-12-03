<<<<<<< HEAD
# Netlify Deployment Guide

## Quick Setup

### 1. Connect Your Repository
1. Go to [Netlify](https://netlify.com)
2. Click **"New site from Git"**
3. Select GitHub and choose `ghostwriter-tool` repository
4. Click **Deploy**

### 2. Build Settings (Auto-Detected)
Netlify should auto-detect this configuration from `netlify.toml`:

- **Build command:** 
```bash
npm install --legacy-peer-deps && cd client && npm install --legacy-peer-deps && npm run build && cd ../server && npm install --legacy-peer-deps && npm run build
```

- **Publish directory:** `client/.next`
- **Functions directory:** `netlify/functions`

### 3. Environment Variables
Add these in Netlify Dashboard → Site Settings → Environment:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Deploy
Once configured, every push to `main` branch will auto-deploy.

## Build Process Explained

### Client (Next.js Frontend)
```bash
cd client
npm install
npm run build  # Creates optimized production build in .next/
```

### Server (Express Backend)
```bash
cd server
npm install
npm run build  # Compiles TypeScript to JavaScript
```

## Netlify Functions (Serverless API)
Your Express server runs as Netlify Functions at:
- `/.netlify/functions/api` or `/api/*`

## Quick Deploy Command (Local)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Link your site
netlify link

# Deploy
netlify deploy --prod
```

## Troubleshooting

### Build Fails
- Check logs in Netlify Dashboard → Deploys → Build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Functions Not Working
- Check `netlify/functions/` exists
- Verify API endpoints match your code

### Frontend Not Showing
- Clear browser cache
- Check that `client/.next` directory was created
- Review build logs for Next.js errors
=======
# Netlify Deployment Guide

## Quick Setup

### 1. Connect Your Repository
1. Go to [Netlify](https://netlify.com)
2. Click **"New site from Git"**
3. Select GitHub and choose `ghostwriter-tool` repository
4. Click **Deploy**

### 2. Build Settings (Auto-Detected)
Netlify should auto-detect this configuration from `netlify.toml`:

- **Build command:** 
```bash
npm install --legacy-peer-deps && cd client && npm install --legacy-peer-deps && npm run build && cd ../server && npm install --legacy-peer-deps && npm run build
```

- **Publish directory:** `client/.next`
- **Functions directory:** `netlify/functions`

### 3. Environment Variables
Add these in Netlify Dashboard → Site Settings → Environment:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Deploy
Once configured, every push to `main` branch will auto-deploy.

## Build Process Explained

### Client (Next.js Frontend)
```bash
cd client
npm install
npm run build  # Creates optimized production build in .next/
```

### Server (Express Backend)
```bash
cd server
npm install
npm run build  # Compiles TypeScript to JavaScript
```

## Netlify Functions (Serverless API)
Your Express server runs as Netlify Functions at:
- `/.netlify/functions/api` or `/api/*`

## Quick Deploy Command (Local)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Link your site
netlify link

# Deploy
netlify deploy --prod
```

## Troubleshooting

### Build Fails
- Check logs in Netlify Dashboard → Deploys → Build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Functions Not Working
- Check `netlify/functions/` exists
- Verify API endpoints match your code

### Frontend Not Showing
- Clear browser cache
- Check that `client/.next` directory was created
- Review build logs for Next.js errors
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
