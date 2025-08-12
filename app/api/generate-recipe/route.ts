import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai" // switched from generateObject to generateText

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

export async function POST(request: NextRequest) {
  try {
    const { ingredients }: RecipeRequest = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 })
    }

    const recipes = await generateRecipesWithGroq(ingredients)

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
          - Provide clear, step-by-step instructions
          - Estimate cooking time and servings
          - Try to make each recipe different in style (e.g., one stir-fry, one soup, one baked dish)
          - Keep recipes healthy and balanced when possible

          Return the response as a valid JSON object with this exact structure:
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

    // Check if response is wrapped in markdown code blocks
    if (jsonText.startsWith("```")) {
      // Extract content between code blocks
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
  const mockRecipes: Recipe[] = [
    {
      title: `${ingredients[0]} and ${ingredients[1]} Stir Fry`,
      ingredients: [
        `2 cups ${ingredients[1] || "rice"}`,
        `1 lb ${ingredients[0] || "protein"}, diced`,
        `2 cups ${ingredients[2] || "vegetables"}`,
        "2 tbsp olive oil",
        "1 onion, chopped",
        "2 cloves garlic, minced",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Heat olive oil in a large pan over medium heat",
        `Add diced ${ingredients[0]} and cook until golden brown, about 6-8 minutes`,
        "Add chopped onion and garlic, cook for 2-3 minutes",
        `Add ${ingredients[2]} and cook until tender`,
        `Serve over cooked ${ingredients[1]} and season with salt and pepper`,
      ],
      cookTime: "20 minutes",
      servings: "4",
      calories: "380",
    },
    {
      title: `Creamy ${ingredients[0]} Bowl`,
      ingredients: [
        `1 lb ${ingredients[0] || "protein"}`,
        `3 cups ${ingredients[2] || "vegetables"}`,
        `2 cups ${ingredients[1] || "grain"}`,
        "1 cup coconut milk",
        "2 tbsp curry powder",
        "1 onion, diced",
        "3 cloves garlic, minced",
      ],
      instructions: [
        `Season and cook ${ingredients[0]} until golden`,
        "In the same pan, add onion and garlic, cook until fragrant",
        "Add curry powder and cook for 1 minute",
        "Add coconut milk and bring to simmer",
        `Add ${ingredients[2]} and cook until tender`,
        `Serve over ${ingredients[1]}`,
      ],
      cookTime: "25 minutes",
      servings: "4",
      calories: "420",
    },
    {
      title: `${ingredients[0]} and ${ingredients[2]} Soup`,
      ingredients: [
        `1 lb ${ingredients[0] || "protein"}, cubed`,
        `3 cups ${ingredients[2] || "vegetables"}, chopped`,
        "6 cups vegetable broth",
        "1 can diced tomatoes",
        "2 tbsp olive oil",
        "1 onion, diced",
        "Herbs and spices to taste",
      ],
      instructions: [
        "Heat olive oil in a large pot",
        `Brown ${ingredients[0]} pieces on all sides`,
        "Add onion and cook until softened",
        "Add broth and diced tomatoes, bring to boil",
        `Add ${ingredients[2]} and simmer for 15-20 minutes`,
        "Season with herbs and spices, serve hot",
      ],
      cookTime: "35 minutes",
      servings: "6",
      calories: "280",
    },
  ]

  return mockRecipes
}
