interface DetectIngredientsResponse {
  success: boolean
  ingredients: string[]
  message: string
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

export class ApiClient {
  private static baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""

  static async detectIngredients(imageFile: File): Promise<DetectIngredientsResponse> {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await fetch(`${this.baseUrl}/api/detect-ingredients`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async generateRecipes(ingredients: string[]): Promise<GenerateRecipeResponse> {
    const response = await fetch(`${this.baseUrl}/api/generate-recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}
