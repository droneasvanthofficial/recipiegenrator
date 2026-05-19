import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { z } from "zod"
import { sanitizeIngredient } from "@/lib/validation"

interface RecipeRequest {
  ingredients: string[]
}

interface Recipe {
  title: string
  ingredients: string[]
  instructions: string[]
  cookTime: string
  servings: string
  calories?: string
}

const RecipeRequestSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one ingredient is required")
    .max(50, "Maximum 50 ingredients allowed"),
})

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return createErrorResponse("Invalid JSON in request body", 400)
    }

    const validation = RecipeRequestSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return createErrorResponse(`Validation error: ${errors}`, 400)
    }

    const { ingredients } = validation.data

    // Sanitize ingredients
    const sanitizedIngredients = ingredients.map(sanitizeIngredient).filter((i) => i.length > 0)

    if (sanitizedIngredients.length === 0) {
      return createErrorResponse("No valid ingredients provided", 400)
    }

    const recipes = await generateRecipesWithGroq(sanitizedIngredients)

    return NextResponse.json({
      success: true,
      recipes,
      ingredientsUsed: sanitizedIngredients,
    })
  } catch (error) {
    console.error("[generate-recipe] Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      type: error instanceof Error ? error.constructor.name : typeof error,
    })

    return createErrorResponse("Failed to generate recipes. Please try again.", 500)
  }
}

async function generateRecipesWithGroq(ingredients: string[]): Promise<Recipe[]> {
  try {
    const ingredientList = ingredients.join(", ")

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "user",
          content: `Create 3 different delicious and practical recipes using these ingredients: ${ingredientList}. 
          
          For each recipe:
          - Make it realistic and cookable with common kitchen tools
          - Include additional common ingredients that complement the provided ones
          - Provide clear, step-by-step instructions (3-7 steps)
          - Estimate cooking time and servings
          - Try to make each recipe different in style (e.g., one stir-fry, one soup, one baked dish)
          - Keep recipes healthy and balanced when possible
          - Estimate reasonable calorie counts

          Return the response ONLY as a valid JSON object with this exact structure (no markdown, no code blocks):
          {
            "recipes": [
              {
                "title": "Recipe name",
                "ingredients": ["ingredient 1", "ingredient 2"],
                "instructions": ["step 1", "step 2"],
                "cookTime": "25 minutes",
                "servings": "4",
                "calories": "350"
              }
            ]
          }`,
        },
      ],
    })

    let jsonText = text.trim()

    // Check if response is wrapped in markdown code blocks and extract
    if (jsonText.startsWith("```")) {
      const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/
      const match = jsonText.match(codeBlockRegex)
      if (match && match[1]) {
        jsonText = match[1].trim()
      }
    }

    // Validate and parse the response
    const RecipeResponseSchema = z.object({
      recipes: z.array(
        z.object({
          title: z.string().min(1).max(200),
          ingredients: z.array(z.string()).min(1).max(50),
          instructions: z.array(z.string()).min(1).max(20),
          cookTime: z.string().min(1).max(50),
          servings: z.string().min(1).max(20),
          calories: z.string().optional(),
        }),
      ),
    })

    const parsedResponse = RecipeResponseSchema.parse(JSON.parse(jsonText))
    return parsedResponse.recipes.slice(0, 3) // Ensure max 3 recipes
  } catch (error) {
    console.error("[generateRecipesWithGroq] Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      type: error instanceof Error ? error.constructor.name : typeof error,
    })

    throw new Error("Failed to generate recipes from AI model")
  }
}

function createErrorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
  )
}
