import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"
import { sanitizeIngredient, validateImageFile } from "@/lib/validation"
import { config_unsafe } from "@/lib/config"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get("content-type")
    if (!contentType?.includes("multipart/form-data")) {
      return createErrorResponse("Invalid content type", 400)
    }

    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image || !(image instanceof File)) {
      return createErrorResponse("No image file provided", 400)
    }

    // Validate image file
    const imageValidation = validateImageFile(image)
    if (!imageValidation.valid) {
      return createErrorResponse(imageValidation.error || "Invalid image", 400)
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = image.type

    // Use Groq's vision model to analyze the image
    const { object } = await generateObject({
      model: groq("llama-3.2-90b-vision-preview"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and identify all the ingredients you can see. Focus on identifying specific food items, vegetables, proteins, grains, and other cooking ingredients. Return a list of ingredients that could be used for cooking. Be specific and practical.",
            },
            {
              type: "image",
              image: `data:${mimeType};base64,${base64}`,
            },
          ],
        },
      ],
      schema: z.object({
        ingredients: z
          .array(z.string().min(1))
          .min(1, "At least one ingredient must be detected")
          .max(50),
        confidence: z.enum(["high", "medium", "low"]),
        notes: z.string().optional(),
      }),
    })

    // Filter and clean up ingredients
    const cleanedIngredients = object.ingredients
      .map(sanitizeIngredient)
      .filter((ingredient) => ingredient.length > 0)
      .filter((ingredient, index, arr) => arr.indexOf(ingredient) === index) // Remove duplicates
      .slice(0, 50)

    if (cleanedIngredients.length === 0) {
      return createErrorResponse("No ingredients could be detected from the image", 400)
    }

    return NextResponse.json({
      success: true,
      ingredients: cleanedIngredients,
      confidence: object.confidence,
      notes: object.notes,
      message: `Successfully detected ${cleanedIngredients.length} ingredients with ${object.confidence} confidence`,
    })
  } catch (error) {
    console.error("[detect-ingredients] Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      type: error instanceof Error ? error.constructor.name : typeof error,
    })

    return createErrorResponse("Failed to process image. Please try again.", 500)
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
