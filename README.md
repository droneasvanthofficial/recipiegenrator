# Smart Recipe Generator

A production-ready AI-powered recipe generator that creates personalized recipes from your ingredients. Upload a photo or list ingredients, and let AI generate delicious meals while helping reduce food waste.

## Features

- 🖼️ **Image-Based Ingredient Detection**: Upload a photo of your ingredients and let AI automatically identify them
- 🤖 **AI Recipe Generation**: Get personalized recipes tailored to your available ingredients using Groq's LLM
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast & Reliable**: Built with Next.js 15 for optimal performance
- 🎨 **Modern UI**: Beautiful interface using Radix UI components and Tailwind CSS
- 🔐 **Production Ready**: Includes security headers, input validation, and comprehensive error handling

## Tech Stack

- **Frontend**: Next.js 15.2.8, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **AI Models**: Groq API (llama-3.2-90b-vision-preview for image detection, llama-3.3-70b-versatile for recipe generation)
- **Validation**: Zod
- **Styling**: Tailwind CSS with Geist font

## Prerequisites

- Node.js 18+ or higher
- npm or yarn or pnpm
- Groq API key (get one at [console.groq.com](https://console.groq.com))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/droneasvanthofficial/recipiegenrator.git
cd recipiegenrator
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Groq API key:

```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=production
```

## Development

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for production

```bash
npm run build
npm start
```

### Lint the code

```bash
npm run lint
```

## Usage

1. **Visit the home page** at `/` to see the application overview
2. **Click "Get Started"** to navigate to the recipe generation page
3. **Choose input method**:
   - **Upload Photo**: Select an image of your ingredients
   - **Type Ingredients**: Manually enter ingredients separated by commas
4. **Click "Generate Recipes"** to create recipes based on your ingredients
5. **Review the suggestions** on the results page

## API Endpoints

### POST `/api/detect-ingredients`

Detects ingredients from an uploaded image.

**Request:**
```
Content-Type: multipart/form-data
Body: image (File)
```

**Response:**
```json
{
  "success": true,
  "ingredients": ["chicken", "rice", "spinach"],
  "confidence": "high",
  "notes": "Additional notes about detection",
  "message": "Successfully detected 3 ingredients with high confidence"
}
```

### POST `/api/generate-recipe`

Generates recipes based on provided ingredients.

**Request:**
```json
{
  "ingredients": ["chicken", "rice", "spinach", "onion"]
}
```

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "title": "Chicken Fried Rice",
      "ingredients": ["2 cups cooked rice", "1 lb chicken", "1 cup spinach"],
      "instructions": ["Heat oil", "Cook chicken", "Add other ingredients"],
      "cookTime": "25 minutes",
      "servings": "4",
      "calories": "380"
    }
  ],
  "ingredientsUsed": ["chicken", "rice", "spinach", "onion"]
}
```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_GROQ_API_KEY` | Yes | Your Groq API key | - |
| `NODE_ENV` | No | Environment (development/production/test) | production |
| `NEXT_PUBLIC_API_URL` | No | API URL for client | - |
| `API_TIMEOUT_MS` | No | API request timeout in ms | 30000 |
| `MAX_FILE_SIZE_MB` | No | Max image file size in MB | 10 |
| `ALLOWED_IMAGE_TYPES` | No | Allowed image MIME types | image/jpeg,image/png,image/webp |
| `NEXT_PUBLIC_ENABLE_RECIPE_SAVING` | No | Enable recipe saving feature | false |
| `NEXT_PUBLIC_ENABLE_USER_ACCOUNTS` | No | Enable user accounts | false |

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Deploy to Docker

```dockerfile
# Use the provided Dockerfile
docker build -t recipe-generator .
docker run -p 3000:3000 -e NEXT_PUBLIC_GROQ_API_KEY=your_key recipe-generator
```

### Deploy to other platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Heroku
- Railway
- Render

## Project Structure

```
recipiegenrator/
├── app/
│   ├── api/
│   │   ├── detect-ingredients/    # Image ingredient detection endpoint
│   │   └── generate-recipe/        # Recipe generation endpoint
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout with metadata
│   ├── error.tsx                   # Error page
│   ├── not-found.tsx              # 404 page
│   ├── generate/                   # Recipe generation page
│   └── results/                    # Recipe results page
├── components/
│   ├── ui/                         # Radix UI components
│   ├── loading-spinner.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── api-client.ts              # API client with validation
│   ├── config.ts                  # Environment configuration
│   ├── validation.ts              # Input validation utilities
│   └── utils.ts                   # Utility functions
├── styles/
│   └── globals.css                # Global styles
├── public/                         # Static assets
├── .env.example                    # Environment variables template
├── tsconfig.json                   # TypeScript configuration
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
└── package.json                    # Dependencies and scripts
```

## Security Features

- ✅ Input validation and sanitization using Zod
- ✅ File type and size validation for images
- ✅ Environment variable validation at startup
- ✅ Secure API error responses without exposing internal details
- ✅ CORS and security headers configured
- ✅ TypeScript strict mode enabled

## Performance Optimizations

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ CSS minification with Tailwind CSS
- ✅ Production-optimized builds with Next.js

## Future Enhancements

- [ ] User authentication with NextAuth.js
- [ ] Database integration for saving recipes
- [ ] User recipe favorites and history
- [ ] Recipe rating and reviews
- [ ] Dietary restrictions filtering
- [ ] Recipe sharing via social media
- [ ] Print-friendly recipe format
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced analytics and monitoring

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@recipegenator.com or open an issue on GitHub.

## Acknowledgments

- [Groq](https://groq.com) - AI inference platform
- [Next.js](https://nextjs.org) - React framework
- [Radix UI](https://radix-ui.com) - Headless UI components
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Vercel](https://vercel.com) - Deployment platform

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about updates and improvements.

---

**Last Updated**: May 2026 | **Version**: 1.0.0

