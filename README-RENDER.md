# Deploying NAVIRA HARDWARE on Render

**Full guide (Supabase + Render together):** see [docs/SETUP-SUPABASE-AND-RENDER.md](docs/SETUP-SUPABASE-AND-RENDER.md)

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A **live** Supabase project (create free at https://supabase.com/dashboard) — see setup guide above

## Deployment Steps

### Option 1: Using Render Dashboard (Recommended)

1. **Connect your GitHub repository:**
   - Go to https://dashboard.render.com
   - Click "New +" → "Static Site"
   - Connect your GitHub account if not already connected
   - Select the repository: `i-tr3nt/naviraholdings`

2. **Configure the static site:**
   - **Name:** `navira-hardware` (or any name you prefer)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Node Version:** `18` or `20` (Render will auto-detect)

3. **Add Environment Variables:**
   Click "Add Environment Variable" and add these three variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
   - `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

   You can find these values in your local `.env` file or in your Supabase dashboard.

4. **Deploy:**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site
   - Your site will be available at `https://your-app-name.onrender.com`

### Option 2: Using render.yaml (Advanced)

If you prefer using the `render.yaml` file:

1. The `render.yaml` file is already in the repository
2. Go to Render Dashboard → "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration
5. Make sure to add the environment variables in the Render dashboard

## Important Notes

- **Environment Variables:** All `VITE_*` variables must be set in Render's dashboard for the build to work correctly
- **Build Time:** The first build may take 5-10 minutes
- **Free Tier:** Render's free tier spins down after 15 minutes of inactivity, so the first request after inactivity may be slow
- **Custom Domain:** You can add a custom domain in the Render dashboard under your service settings

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify Node.js version compatibility (the project uses Node 18+)
- Check the build logs in Render dashboard for specific errors

### Environment Variables Not Working
- Make sure variable names start with `VITE_` (required for Vite)
- Restart the service after adding new environment variables
- Rebuild the service if variables were added after initial deployment

## Post-Deployment

After deployment:
1. Test the application at your Render URL
2. Verify Supabase connection is working
3. Test authentication and database operations
4. Set up a custom domain if needed

## Support

For issues with:
- **Render:** Check Render documentation or support
- **Application:** Check the main README.md file
- **Supabase:** Check your Supabase project settings

