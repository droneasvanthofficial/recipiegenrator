import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

interface RecipeRequest {
  ingredients: string[]
  options?: {
    excludedIngredients?: string[]
    isQuickCook?: boolean
    difficulty?: string
  }
}

interface Recipe {
  title: string
  ingredients: string[]
  instructions: string[]
  cookTime: string
  servings: string
  calories?: string
  difficulty?: string
  protein?: string
  carbs?: string
  fat?: string
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, options }: RecipeRequest = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 })
    }

    const recipes = await generateRecipesWithGroq(ingredients, options)

    return NextResponse.json({
      success: true,
      recipes,
      ingredientsUsed: ingredients,
    })
  } catch (error) {
    console.error("Error generating recipes:", error)
    return NextResponse.json({ error: "Failed to generate recipes" }, { status: 500 })
  }
}

async function generateRecipesWithGroq(ingredients: string[], options?: RecipeRequest['options']): Promise<Recipe[]> {
  try {
    const ingredientList = ingredients.join(", ")
    const exclusions = options?.excludedIngredients?.length
      ? `STRICTLY EXCLUDE these ingredients or allergens: ${options.excludedIngredients.join(", ")}.`
      : ""
    const timeConstraint = options?.isQuickCook ? "Each recipe MUST be ready in 15 minutes or less." : ""
    const difficultyLevel = options?.difficulty && options.difficulty !== 'any'
      ? `The difficulty level should be ${options.difficulty}.`
      : ""

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "user",
          content: `Create 3 different delicious and practical recipes using these ingredients: ${ingredientList}. 
          ${exclusions}
          ${timeConstraint}
          ${difficultyLevel}
          
          For each recipe:
          - Make it realistic and cookable with common kitchen tools.
          - Include nutritional information (calories, protein, carbs, fat).
          - Provide clear, step-by-step instructions.
          - Categorize difficulty as "Easy", "Medium", or "Hard".
          - Ensure the response is valid JSON.

          Return the response as a valid JSON object with this exact structure:
          {
            "recipes": [
              {
                "title": "Recipe name",
                "ingredients": ["1 cup ingredient 1", "200g ingredient 2"],
                "instructions": ["step 1", "step 2"],
                "cookTime": "15 minutes",
                "servings": "2",
                "calories": "350",
                "difficulty": "Easy",
                "protein": "25g",
                "carbs": "40g",
                "fat": "12g"
              }
            ]
          }`,
        },
      ],
    })

    let jsonText = text.trim()

    if (jsonText.startsWith("```")) {
      const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/
      const match = jsonText.match(codeBlockRegex)
      if (match && match[1]) {
        jsonText = match[1].trim()
      }
    }

    const parsedResponse = JSON.parse(jsonText)
    return parsedResponse.recipes || []
  } catch (error) {
    console.error("Error with Groq API:", error)
    return generateMockRecipes(ingredients)
  }
}

function generateMockRecipes(ingredients: string[]): Recipe[] {
  // Simple fallback with nutritional info
  return [
    {
      title: `${ingredients[0]} Garden Salad`,
      ingredients: ingredients,
      instructions: ["Wash all ingredients", "Chop into bite-sized pieces", "Mix in a bowl", "Season with salt and pepper"],
      cookTime: "10 minutes",
      servings: "2",
      calories: "250",
      difficulty: "Easy",
      protein: "10g",
      carbs: "15g",
      fat: "5g"
    }
  ]
}
