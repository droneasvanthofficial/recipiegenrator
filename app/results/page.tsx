"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ApiClient } from "@/lib/api-client"

interface Recipe {
  title: string
  ingredients: string[]
  instructions: string[]
  cookTime: string
  servings: string
  calories?: string
}

export default function ResultsPage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedIngredients = sessionStorage.getItem("ingredients")
    if (storedIngredients) {
      const parsedIngredients = JSON.parse(storedIngredients)
      setIngredients(parsedIngredients)
      generateRecipes(parsedIngredients)
    } else {
      setIsLoading(false)
    }
  }, [])

  const generateRecipes = async (ingredientList: string[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await ApiClient.generateRecipes(ingredientList)

      if (response.success) {
        setRecipes(response.recipes)
      } else {
        throw new Error(response.error || "Failed to generate recipes")
      }
    } catch (error) {
      console.error("Error generating recipes:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generating Recipes...</h2>
          <p className="text-gray-600">Our AI is creating delicious recipes from your ingredients</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error generating recipes</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/generate">
            <Button>Try Again</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (ingredients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No ingredients found</h2>
          <Link href="/generate">
            <Button>Go back and add ingredients</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/generate" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Generate New Recipe
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Your Recipe Suggestions</h1>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Using these ingredients:</h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {recipes.map((recipe, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.cookTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Serves {recipe.servings}
                      </div>
                      {recipe.calories && (
                        <div className="flex items-center gap-1">
                          <ChefHat className="h-4 w-4" />
                          {recipe.calories} cal
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ingredients:</h4>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Instructions:</h4>
                    <ol className="space-y-2">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">
                          <span className="font-medium text-green-600">{idx + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/generate">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Generate More Recipes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
