# Quick Start Guide

Get the Recipe Generator running in under 5 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Groq API key ([Get free key](https://console.groq.com))

## 5-Minute Setup

### 1. Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/droneasvanthofficial/recipiegenrator.git
cd recipiegenrator

# Install dependencies
npm install --legacy-peer-deps
```

### 2. Configure (1 min)

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Groq API key
# NEXT_PUBLIC_GROQ_API_KEY=your_key_here
```

### 3. Run (2 min)

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

That's it! 🎉

## What's Next?

- **Try the app**: Upload an ingredient photo or type ingredients
- **Explore code**: Check out `app/` directory structure
- **Read docs**: See [README.md](./README.md) for full documentation
- **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Testing
npm test                 # Run tests (when available)
npm run test:watch       # Watch mode

# Docker
docker build -t recipe-gen .                    # Build Docker image
docker run -p 3000:3000 recipe-gen              # Run Docker container
docker-compose up                               # Run with Docker Compose
```

## Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Create new API key
4. Add to `.env.local`

Free tier includes:
- 30 API calls/minute
- 14,400 API calls/day
- Unlimited requests

## Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti :3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies won't install

```bash
# Clear npm cache
npm cache clean --force

# Remove package-lock.json and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install --legacy-peer-deps
```

### Build fails

```bash
# Check Node version (should be 18+)
node --version

# Update npm
npm install -g npm@latest

# Try again
npm run build
```

### Image detection not working

- Verify Groq API key is correct
- Check API key is in `.env.local`
- Try a clear, well-lit image
- Ensure image is under 10MB
- Check format is JPEG, PNG, or WebP

## File Structure Quick Reference

```
recipiegenrator/
├── app/                 # Application code
│   ├── api/            # API routes (ingredient detection, recipe generation)
│   ├── generate/       # Recipe generation page
│   └── results/        # Recipe results page
├── components/          # React components
├── lib/                 # Utilities (API client, validation, etc.)
├── .env.example         # Environment variables template
├── README.md            # Full documentation
└── Dockerfile           # Docker configuration
```

## Next Steps

### For Users
- Explore the app
- Try different ingredients
- Provide feedback

### For Developers
1. Read [README.md](./README.md) for full docs
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute
3. Explore [API.md](./API.md) for API details
4. Review [SECURITY.md](./SECURITY.md) for security info

### For Deployment
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment options
- Options include Vercel (recommended), Docker, AWS, Google Cloud, and more

## Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Full documentation and features |
| [API.md](./API.md) | API endpoint reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [SECURITY.md](./SECURITY.md) | Security best practices |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [QUICK_START.md](./QUICK_START.md) | This file! |

## Support

- 📖 **Documentation**: Check [README.md](./README.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/droneasvanthofficial/recipiegenrator/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/droneasvanthofficial/recipiegenrator/discussions)
- 💬 **Community**: Join our community (coming soon)

## Tips & Tricks

### Better Recipe Results
- Use clear, well-lit ingredient images
- Include a variety of ingredients (3+ items)
- Type ingredient names clearly
- Specify quantities if you have preferences

### Development Tips
- Use `.env.local` for local secrets (not committed to git)
- Check browser console for error details
- Use Network tab to see API calls
- Read error messages carefully

### Performance Tips
- Clear browser cache if you see old results
- Restart dev server if seeing stale data
- Use incognito mode for testing

## Ready? Let's Go! 🚀

```bash
npm run dev
```

Open http://localhost:3000 and start generating recipes!

---

**Happy Cooking!** 👨‍🍳👩‍🍳
