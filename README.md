# Smart Trolley Payment System - Vercel Frontend

## Deployment to Vercel

Follow these steps to deploy this Next.js application to Vercel:

1. **Push to GitHub**
   - Ensure your code is pushed to a GitHub repository
   - Make sure your repository includes all the files in this directory

2. **Connect with Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Select your repository from the list

3. **Configure Project**
   - Vercel will automatically detect Next.js
   - Framework Preset: Next.js
   - Root Directory: `vercel` (if you pushed the entire project) or `.` (if you only pushed this folder)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables**
   Add the following environment variables:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret Key
   - `RENDER_BACKEND_URL`: Your Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - You'll get a production URL when deployment is complete

Your application will be automatically deployed on every push to the main branch.