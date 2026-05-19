# API Documentation

Complete API reference for the Recipe Generator application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

## Authentication

Currently, the API does not require authentication. Future versions will include optional user authentication.

## Rate Limiting

API endpoints have rate limiting configured:
- **Limit**: 100 requests per 15 minutes per IP
- **Headers Returned**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

## Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 408 | Request Timeout |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Endpoints

### 1. Detect Ingredients from Image

Upload an image and get ingredients detected by AI vision.

#### Request

```
POST /api/detect-ingredients
Content-Type: multipart/form-data

Body:
- image: File (JPEG, PNG, or WebP)
  - Max size: 10MB
  - Minimum resolution: 100x100 pixels
  - Recommended: 800x600 pixels or higher
```

#### Example (cURL)

```bash
curl -X POST http://localhost:3000/api/detect-ingredients \
  -F "image=@/path/to/ingredients.jpg"
```

#### Example (JavaScript)

```javascript
const formData = new FormData()
formData.append('image', imageFile)

const response = await fetch('/api/detect-ingredients', {
  method: 'POST',
  body: formData
})

const data = await response.json()
console.log(data.ingredients)
```

#### Response (Success)

```json
{
  "success": true,
  "ingredients": [
    "chicken breast",
    "rice",
    "spinach",
    "onion",
    "garlic"
  ],
  "confidence": "high",
  "notes": "Additional notes about what was detected",
  "message": "Successfully detected 5 ingredients with high confidence"
}
```

#### Response (Error)

```json
{
  "success": false,
  "error": "Image must be less than 10MB"
}
```

#### Confidence Levels

- `high`: Very confident in the detection
- `medium`: Reasonably confident
- `low`: Less confident, manual review recommended

### 2. Generate Recipes from Ingredients

Generate AI-powered recipes based on provided ingredients.

#### Request

```
POST /api/generate-recipe
Content-Type: application/json

Body:
{
  "ingredients": [
    "chicken",
    "rice",
    "spinach",
    "onion"
  ]
}
```

#### Requirements

- **ingredients**: Array of strings
  - Minimum: 1 ingredient
  - Maximum: 50 ingredients
  - Each ingredient: 1-100 characters
  - No duplicates allowed

#### Example (cURL)

```bash
curl -X POST http://localhost:3000/api/generate-recipe \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "rice", "spinach", "onion"]
  }'
```

#### Example (JavaScript)

```javascript
const response = await fetch('/api/generate-recipe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ingredients: ['chicken', 'rice', 'spinach', 'onion']
  })
})

const data = await response.json()
console.log(data.recipes)
```

#### Response (Success)

```json
{
  "success": true,
  "recipes": [
    {
      "title": "Chicken Fried Rice",
      "ingredients": [
        "2 cups cooked rice",
        "1 lb chicken breast, diced",
        "1 cup fresh spinach",
        "1 large onion, chopped",
        "3 cloves garlic, minced",
        "2 tbsp vegetable oil",
        "2 tbsp soy sauce",
        "Salt and pepper to taste"
      ],
      "instructions": [
        "Heat oil in a large wok or skillet over high heat",
        "Add diced chicken and cook until golden brown, about 6-8 minutes",
        "Add chopped onion and garlic, stir-fry for 2-3 minutes",
        "Add rice and stir-fry for 4-5 minutes",
        "Add spinach and soy sauce, cook until spinach is wilted",
        "Season with salt and pepper to taste",
        "Serve hot"
      ],
      "cookTime": "25 minutes",
      "servings": "4",
      "calories": "420"
    },
    {
      "title": "Creamy Garlic Chicken with Spinach",
      "ingredients": [
        "1 lb chicken breast",
        "1 cup fresh spinach",
        "1 medium onion",
        "4 cloves garlic, minced",
        "1 cup heavy cream",
        "1/2 cup chicken broth",
        "2 tbsp butter",
        "Salt and pepper to taste"
      ],
      "instructions": [
        "Melt butter in a large skillet over medium-high heat",
        "Season chicken with salt and pepper, cook until golden (6-8 minutes per side)",
        "Remove chicken and set aside",
        "In the same skillet, sauté onion and garlic until fragrant",
        "Add chicken broth and bring to a simmer",
        "Add heavy cream and spinach, stir until combined",
        "Return chicken to skillet and simmer for 5 minutes",
        "Serve with rice or pasta"
      ],
      "cookTime": "30 minutes",
      "servings": "4",
      "calories": "520"
    },
    {
      "title": "Spinach and Chicken Soup",
      "ingredients": [
        "1 lb chicken breast, cubed",
        "2 cups fresh spinach",
        "1 large onion, diced",
        "4 cloves garlic, minced",
        "6 cups chicken broth",
        "1 can diced tomatoes",
        "2 tbsp olive oil",
        "1 tsp Italian seasoning",
        "Salt and pepper to taste"
      ],
      "instructions": [
        "Heat olive oil in a large pot over medium heat",
        "Sauté onion and garlic until softened, about 3-4 minutes",
        "Add diced chicken and cook until no longer pink",
        "Add chicken broth and diced tomatoes, bring to a boil",
        "Reduce heat and simmer for 15 minutes",
        "Add spinach and Italian seasoning, cook for 5 more minutes",
        "Season with salt and pepper to taste",
        "Serve hot"
      ],
      "cookTime": "35 minutes",
      "servings": "6",
      "calories": "280"
    }
  ],
  "ingredientsUsed": [
    "chicken",
    "rice",
    "spinach",
    "onion"
  ]
}
```

#### Response (Error - Invalid Ingredients)

```json
{
  "success": false,
  "error": "Validation error: ingredients: Expected array, received string"
}
```

#### Response (Error - No Ingredients)

```json
{
  "success": false,
  "error": "At least one ingredient is required"
}
```

#### Response (Error - Too Many Ingredients)

```json
{
  "success": false,
  "error": "Maximum 50 ingredients allowed"
}
```

## Data Types

### Ingredient

```typescript
type Ingredient = string
```

Properties:
- Must be 1-100 characters
- Will be automatically trimmed and lowercased
- Special characters are removed
- Duplicates are not allowed

### Recipe

```typescript
interface Recipe {
  title: string          // Recipe name, 1-200 characters
  ingredients: string[]  // Array of ingredients
  instructions: string[] // Array of cooking instructions
  cookTime: string       // e.g., "25 minutes"
  servings: string       // e.g., "4", "6", "8"
  calories?: string      // Optional, e.g., "420 cal"
}
```

## Workflow Example

### Complete Flow

1. **User uploads ingredient image**
   ```javascript
   POST /api/detect-ingredients
   (image file)
   → Returns: list of detected ingredients
   ```

2. **System generates recipes**
   ```javascript
   POST /api/generate-recipe
   (detected ingredients)
   → Returns: 3 recipe suggestions
   ```

3. **User browses recipes**
   - View recipes on results page
   - See ingredients and instructions
   - Copy recipes or save for later (future feature)

## Performance Optimization

### Response Times

- **Ingredient Detection**: 5-15 seconds
  - Includes: Image validation, AI processing, response formatting
- **Recipe Generation**: 10-30 seconds
  - Includes: Validation, AI processing, formatting, error handling

### Timeout

- Default API timeout: 30 seconds
- Adjust in `.env` with `API_TIMEOUT_MS`

## Rate Limiting Strategy

To optimize rate limiting:

1. **Implement request queuing** on the client side
2. **Cache results** when possible
3. **Batch requests** for multiple ingredients

## Best Practices

### Client Side

```javascript
// ✅ Good: Handle errors properly
try {
  const response = await fetch('/api/detect-ingredients', {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API error')
  }
  
  // Use data
} catch (error) {
  console.error('Error:', error.message)
  // Show user-friendly error
}

// ❌ Bad: No error handling
const data = await fetch('/api/detect-ingredients', {
  method: 'POST',
  body: formData
}).then(r => r.json())
```

### Ingredient Format

```javascript
// ✅ Good: Clean ingredient format
const ingredients = [
  'chicken breast',
  'brown rice',
  'fresh spinach',
  'yellow onion',
  'garlic cloves'
]

// ❌ Bad: Unnecessary details
const ingredients = [
  '1 chicken breast',
  '2 cups brown rice',
  '100g fresh spinach',
  '1 large yellow onion',
  '5 garlic cloves'
]

// Note: Numbers are okay, but will be sanitized
```

## Future Enhancements

- [ ] Batch ingredient detection
- [ ] Recipe filtering by dietary restrictions
- [ ] Recipe rating and reviews
- [ ] User recipe favorites (requires auth)
- [ ] Nutrition information
- [ ] Cooking difficulty levels
- [ ] Cost estimation

## Support

For API issues:
- Check this documentation
- Review error messages
- Check GitHub Issues
- Contact support

---

**Last Updated**: May 2026 | **API Version**: 1.0.0
