interface DetectIngredientsResponse {
  success: boolean
  ingredients: string[]
  message: string
  confidence?: string
  notes?: string
  error?: string
}

interface GenerateRecipeResponse {
  success: boolean
  recipes: Array<{
    title: string
    ingredients: string[]
    instructions: string[]
    cookTime: string
    servings: string
    calories?: string
  }>
  ingredientsUsed: string[]
  error?: string
}

interface ApiErrorResponse {
  success: false
  error: string
}

class ApiError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorResponse,
    message?: string,
  ) {
    super(message || body.error)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private static baseUrl =
    typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : '') : ''

  static async detectIngredients(imageFile: File): Promise<DetectIngredientsResponse> {
    // Validate file before sending
    if (!imageFile) {
      throw new Error('No file provided')
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error('Image must be less than 10MB')
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type)) {
      throw new Error('Image must be JPEG, PNG, or WebP format')
    }

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await fetch(`${this.baseUrl}/api/detect-ingredients`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(response.status, data as ApiErrorResponse, `HTTP ${response.status}: ${data.error}`)
      }

      if (!data.success) {
        throw new ApiError(response.status, data as ApiErrorResponse)
      }

      return data as DetectIngredientsResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new Error(`Failed to detect ingredients: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async generateRecipes(ingredients: string[]): Promise<GenerateRecipeResponse> {
    // Validate input
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('At least one ingredient is required')
    }

    if (ingredients.length > 50) {
      throw new Error('Maximum 50 ingredients allowed')
    }

    // Validate each ingredient
    const validatedIngredients = ingredients.filter((ing) => typeof ing === 'string' && ing.trim().length > 0)

    if (validatedIngredients.length === 0) {
      throw new Error('No valid ingredients provided')
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: validatedIngredients }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(response.status, data as ApiErrorResponse, `HTTP ${response.status}: ${data.error}`)
      }

      if (!data.success) {
        throw new ApiError(response.status, data as ApiErrorResponse)
      }

      return data as GenerateRecipeResponse
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new Error(`Failed to generate recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export { ApiError }

