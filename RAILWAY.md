# Railway Deployment Configuration

## Required Environment Variables

Set these in your Railway dashboard under **Variables**:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pgc-website
PORT=5000
```

## Build Configuration

Railway will automatically:
1. Install all dependencies (`npm run install-all`)
2. Build the React client (`npm run build`)
3. Start the server (`npm start`)

## MongoDB Setup

1. Create a free MongoDB Atlas cluster at https://cloud.mongodb.com
2. Create a database user with read/write permissions
3. Whitelist all IPs: `0.0.0.0/0` (Network Access)
4. Get your connection string and add to Railway variables

## Deployment Process

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "your message"
git push origin main
```

Railway will:
- Detect the push
- Run build command
- Deploy the application
- Provide a URL: `https://your-project.up.railway.app`

## Important Files

- `railway.json` - Build and deploy configuration
- `Procfile` - Fallback start command
- `.railwayignore` - Files to exclude from build
- `package.json` - Root package with scripts
- `server/server.js` - Production-ready server with static file serving

## Troubleshooting

If deployment fails:

1. **Check Railway logs** for build errors
2. **Verify environment variables** are set correctly
3. **Test locally** with `NODE_ENV=production npm start`
4. **Check MongoDB connection** string is valid

## Local Testing

```bash
# Build frontend
cd client
npm run build

# Set production mode (PowerShell)
$env:NODE_ENV="production"

# Start server (from root)
npm start

# Access at http://localhost:5000
```

## Deployment Checklist

- [x] railway.json configured
- [x] Procfile created  
- [x] .railwayignore added
- [x] Production static file serving enabled
- [x] Client-side routing configured
- [ ] Environment variables set in Railway
- [ ] MongoDB Atlas connected
- [ ] GitHub repository linked to Railway
- [ ] Initial deployment successful
