# 🚀 Deployment Guide - Render + Vercel

## Overview

- **Backend (API):** Render.com (Free tier)
- **Frontend (React):** Vercel.com (Free tier)
- **Database:** MongoDB Atlas (Free tier)

---

## 📋 Prerequisites

1. GitHub account
2. Render account (sign up at render.com)
3. Vercel account (sign up at vercel.com)
4. MongoDB Atlas account (sign up at mongodb.com/cloud/atlas)

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier
5. Select a cloud provider and region (closest to you)
6. Click **"Create Cluster"**

### Step 2: Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `fittracker_user`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Whitelist IP Addresses

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://fittracker_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before the `?`:
   ```
   mongodb+srv://fittracker_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority
   ```
7. **Save this connection string!**

---

## Part 2: Prepare Your Code

### Step 1: Create Production Environment Files

Create `.env.production` in root:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
NODE_ENV=production
PORT=5000
```

### Step 2: Update package.json

Add these scripts to root `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server.js",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "install-client": "cd client && npm install"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Step 3: Update server.js for Production

Add this after your routes (before app.listen):
```javascript
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}
```

And add at the top:
```javascript
const path = require('path');
```

### Step 4: Create .gitignore (if not exists)

Make sure these are in `.gitignore`:
```
node_modules/
client/node_modules/
.env
.env.local
.env.production
client/build/
```

---

## Part 3: Push to GitHub

### Step 1: Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit - Fitness Tracker"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"**
3. Name: `fitness-tracker`
4. Make it **Public** or **Private**
5. Don't initialize with README (you already have code)
6. Click **"Create repository"**

### Step 3: Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/fitness-tracker.git
git branch -M main
git push -u origin main
```

---

## Part 4: Deploy Backend to Render

### Step 1: Create Web Service

1. Go to https://render.com
2. Sign up / Log in
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account
5. Select your `fitness-tracker` repository
6. Click **"Connect"**

### Step 2: Configure Service

**Basic Settings:**
- Name: `fitness-tracker-api`
- Region: Choose closest to you
- Branch: `main`
- Root Directory: Leave empty
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Advanced Settings:**
- Instance Type: **Free**
- Auto-Deploy: **Yes**

### Step 3: Add Environment Variables

Click **"Environment"** tab, add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key (min 32 characters) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://fitness-tracker-api.onrender.com
   ```
4. **Save this URL!**

### Step 5: Test Backend

Visit: `https://fitness-tracker-api.onrender.com/api/health`

Should see: `{"message":"Fitness Tracker API is running!"}`

---

## Part 5: Deploy Frontend to Vercel

### Step 1: Update Client Environment

Create `client/.env.production`:
```env
REACT_APP_API_URL=https://fitness-tracker-api.onrender.com
```

**Important:** Replace with your actual Render URL!

### Step 2: Commit Changes

```bash
git add .
git commit -m "Add production environment config"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `fitness-tracker` repository
5. Click **"Import"**

### Step 4: Configure Project

**Framework Preset:** Create React App (auto-detected)

**Root Directory:** `client`

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

**Environment Variables:**
Add this variable:
- Key: `REACT_APP_API_URL`
- Value: `https://fitness-tracker-api.onrender.com`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://fitness-tracker-xyz.vercel.app
   ```
4. **Your app is live!** 🎉

---

## Part 6: Update CORS Settings

### Update server.js

Replace the CORS line with:
```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://fitness-tracker-xyz.vercel.app', // Your Vercel URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

**Important:** Replace with your actual Vercel URL!

### Commit and Push

```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the changes.

---

## Part 7: Seed Production Database (Optional)

### Option 1: Use MongoDB Compass

1. Download MongoDB Compass
2. Connect using your Atlas connection string
3. Manually create collections and add data

### Option 2: Run Seed Script Remotely

Update `scripts/seedData.js` to use production MongoDB URI, then run locally:
```bash
MONGODB_URI="your_atlas_connection_string" node scripts/seedData.js
```

---

## 🎉 Your App is Live!

### URLs:
- **Frontend:** https://fitness-tracker-xyz.vercel.app
- **Backend:** https://fitness-tracker-api.onrender.com
- **Database:** MongoDB Atlas

### Test It:
1. Visit your Vercel URL
2. Register a new account
3. Log in
4. Add a workout
5. Check analytics

---

## 📊 Free Tier Limits

### Render (Backend):
- ✅ 750 hours/month (enough for 1 app)
- ✅ Sleeps after 15 min inactivity
- ✅ Wakes up on request (may take 30 seconds)
- ✅ 512 MB RAM
- ✅ Shared CPU

### Vercel (Frontend):
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Fast performance

### MongoDB Atlas:
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Good for small apps
- ✅ Can upgrade anytime

---

## 🔧 Troubleshooting

### Backend Issues:

**"Application failed to respond"**
- Check Render logs
- Verify MongoDB connection string
- Check environment variables

**"Cannot connect to database"**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string format
- Verify database user credentials

**"CORS error"**
- Update CORS origins in server.js
- Include your Vercel URL
- Redeploy backend

### Frontend Issues:

**"Network Error"**
- Check REACT_APP_API_URL in Vercel
- Verify backend is running
- Check browser console

**"Failed to fetch"**
- Backend might be sleeping (wait 30 seconds)
- Check API URL is correct
- Verify CORS settings

**"Build failed"**
- Check build logs in Vercel
- Verify all dependencies installed
- Check for syntax errors

---

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string saved
- [ ] Code pushed to GitHub
- [ ] Environment variables ready

### Backend (Render):
- [ ] Web service created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health check endpoint works
- [ ] Backend URL saved

### Frontend (Vercel):
- [ ] Project imported
- [ ] Root directory set to `client`
- [ ] Environment variable added
- [ ] Deployment successful
- [ ] App loads correctly

### Final Steps:
- [ ] CORS updated with Vercel URL
- [ ] Test registration
- [ ] Test login
- [ ] Test adding workout
- [ ] Test analytics
- [ ] Test on mobile

---

## 🎯 Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate

### For Render (Backend):
1. Go to Settings → Custom Domain
2. Add your API subdomain (api.yourdomain.com)
3. Update DNS records
4. Update frontend API URL

---

## 📱 Share Your App

Once deployed, share these URLs:
- **App:** https://fitness-tracker-xyz.vercel.app
- **Demo Account:** 
  - Email: demo@example.com
  - Password: password123

---

## 🔄 Future Updates

### To Update Your App:

1. Make changes locally
2. Test thoroughly
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. Render and Vercel auto-deploy!

---

## 💡 Pro Tips

1. **Monitor Usage:** Check Render and Vercel dashboards
2. **Check Logs:** Use Render logs for debugging
3. **Backup Data:** Export MongoDB data regularly
4. **Use Environment Variables:** Never commit secrets
5. **Test Before Deploy:** Always test locally first
6. **Keep Dependencies Updated:** Run `npm update` regularly

---

## 🎊 Congratulations!

Your Fitness Tracker is now:
- ✅ Deployed to production
- ✅ Accessible worldwide
- ✅ Using free hosting
- ✅ Automatically deploying updates
- ✅ Professional and scalable

**Share it with friends and start tracking fitness together!** 💪🚀

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

**Your app is production-ready!** 🎉
