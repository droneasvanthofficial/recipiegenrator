# Deployment Guide

This guide provides step-by-step instructions for deploying the Recipe Generator application to various production environments.

## Prerequisites

- Domain name (optional but recommended)
- Git repository (GitHub, GitLab, etc.)
- Groq API key from [console.groq.com](https://console.groq.com)

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the platform built by the creators of Next.js and provides the best integration.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure environment variables**
   - In the "Environment Variables" section, add:
     - `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API key
     - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

5. **Custom domain** (optional)
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update your domain's DNS settings

#### Monitoring:
- View logs: Go to "Deployments" and click on the deployment
- View analytics: Go to "Analytics" tab
- View error tracking: Errors are logged and visible in the dashboard

### Option 2: Docker + Cloud Run (Google Cloud)

#### Prerequisites:
- Google Cloud account
- Docker installed locally

#### Steps:

1. **Build and push Docker image**
   ```bash
   # Build the image
   docker build -t recipe-generator:latest .

   # Tag for Google Cloud Registry
   docker tag recipe-generator:latest gcr.io/YOUR_PROJECT_ID/recipe-generator:latest

   # Push to registry
   docker push gcr.io/YOUR_PROJECT_ID/recipe-generator:latest
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy recipe-generator \
     --image gcr.io/YOUR_PROJECT_ID/recipe-generator:latest \
     --platform managed \
     --region us-central1 \
     --set-env-vars NEXT_PUBLIC_GROQ_API_KEY=your_groq_key \
     --allow-unauthenticated
   ```

3. **Configure custom domain**
   - Go to Cloud Run console
   - Select your service
   - Click "Set up custom domain"
   - Follow the domain setup instructions

#### Cost estimate:
- 2 million requests/month: ~$25-50/month
- Includes free tier benefits

### Option 3: Docker + AWS (ECS/Fargate)

#### Steps:

1. **Create ECR repository**
   ```bash
   aws ecr create-repository --repository-name recipe-generator --region us-east-1
   ```

2. **Build and push image**
   ```bash
   # Authenticate with ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

   # Build and tag
   docker build -t recipe-generator:latest .
   docker tag recipe-generator:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/recipe-generator:latest

   # Push
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/recipe-generator:latest
   ```

3. **Create ECS Fargate service**
   - Go to AWS ECS console
   - Create new cluster
   - Create task definition with the ECR image
   - Create service with desired task count (at least 2 for HA)

4. **Set up load balancer**
   - Create Application Load Balancer (ALB)
   - Point to ECS service
   - Configure custom domain with Route 53

#### Cost estimate:
- 2 vCPU, 4GB memory, 1000 hours/month: ~$50-60/month
- Plus data transfer costs

### Option 4: Docker + DigitalOcean App Platform

#### Steps:

1. **Push to GitHub** (if not already done)

2. **Connect GitHub to DigitalOcean**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Select "GitHub" as source
   - Authorize and select your repository

3. **Configure the app**
   - Name: `recipe-generator`
   - HTTP Port: `3000`
   - Environment Variables:
     - `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API key
     - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Deploy"

#### Cost estimate:
- Starter plan: $12/month
- Includes automatic deployments from GitHub

### Option 5: Docker + Heroku (Free tier removed, but still affordable)

#### Prerequisites:
- Heroku CLI installed
- Heroku account

#### Steps:

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create app**
   ```bash
   heroku create recipe-generator
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NEXT_PUBLIC_GROQ_API_KEY=your_groq_key
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View logs**
   ```bash
   heroku logs --tail
   ```

#### Cost estimate:
- Basic: $50/month for reliably running app
- Professional tier starts at $100/month

### Option 6: Docker + Railway

#### Steps:

1. **Push to GitHub**

2. **Go to [railway.app](https://railway.app)**
   - Create new project
   - Connect your GitHub repository
   - Select the Dockerfile

3. **Set environment variables**
   - Add `NEXT_PUBLIC_GROQ_API_KEY`
   - Add `NODE_ENV=production`

4. **Deploy**
   - Railway automatically deploys on push
   - View logs in dashboard

#### Cost estimate:
- $5-20/month depending on resource usage

### Option 7: Docker + Self-Hosted (VPS)

For complete control, you can host on a VPS like Linode, Vultr, or AWS EC2.

#### Steps:

1. **SSH into server**
   ```bash
   ssh root@your_vps_ip
   ```

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/recipe-generator.git
   cd recipe-generator
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Groq API key
   ```

5. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   # Using Certbot
   apt-get install certbot python3-certbot-nginx
   certbot certonly --standalone -d your-domain.com
   ```

7. **Set up nginx reverse proxy**
   - Configure nginx to proxy to localhost:3000
   - Configure SSL certificates

#### Cost estimate:
- $2.50-5/month for small VPS
- Plus domain registration costs

## Post-Deployment Checklist

- [ ] Test the application works in production
- [ ] Verify all API endpoints are functioning
- [ ] Set up monitoring/alerting
- [ ] Configure backups (if using database)
- [ ] Set up security headers
- [ ] Enable HTTPS/SSL
- [ ] Configure custom domain
- [ ] Test error pages
- [ ] Verify environment variables are set correctly
- [ ] Set up logging/analytics
- [ ] Configure CORS if needed
- [ ] Test on multiple devices/browsers

## Monitoring & Maintenance

### Essential Monitoring

1. **Application Performance**
   - Response times
   - Error rates
   - API success rates

2. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk space
   - Network bandwidth

3. **User Experience**
   - Page load times
   - User behavior

### Tools

- **Vercel**: Built-in analytics and error tracking
- **AWS CloudWatch**: For AWS deployments
- **Sentry**: Error tracking (optional add-on)
- **DataDog**: APM and monitoring
- **New Relic**: Application performance monitoring

### Updates & Security

1. **Regular Updates**
   - Keep dependencies updated
   - Patch security vulnerabilities
   - Update Node.js runtime

2. **Security**
   - Enable HTTPS
   - Configure security headers
   - Regular security audits
   - Monitor for vulnerabilities

## Scaling

As your application grows:

1. **Vertical Scaling**: Increase server resources
2. **Horizontal Scaling**: Add more server instances behind a load balancer
3. **Caching**: Implement Redis for session/data caching
4. **Database**: If needed, set up a proper database backend
5. **CDN**: Use CloudFlare or AWS CloudFront for static assets

## Troubleshooting

### Application won't start
```bash
# Check logs
docker logs recipe-generator

# Verify environment variables
env | grep GROQ
```

### High memory usage
- Increase instance resources
- Check for memory leaks in logs
- Reduce concurrent requests with load balancing

### Slow performance
- Enable caching
- Optimize database queries
- Use a CDN for static files
- Increase server resources

### API errors
- Check Groq API status
- Verify API key is correct
- Check rate limits
- Review error logs

## Support

For issues or questions:
- Create an issue on GitHub
- Check the documentation
- Review error logs and stack traces
