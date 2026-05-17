"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ChefHat, Sparkles, RefreshCw,
  Heart, Share2, Download, Filter,
  Search, UtensilsCrossed
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ApiClient } from "@/lib/api-client"
import { RecipeCard } from "@/components/recipe-card"
import { toast } from "sonner"

export default function ResultsPage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([]) // Store titles as unique IDs
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedIngredients = sessionStorage.getItem("ingredients")
    const storedOptions = sessionStorage.getItem("options")

    // Load favorites from local storage
    const savedFavs = localStorage.getItem("favoriteRecipes")
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs))
    }

    if (storedIngredients) {
      const parsedIngredients = JSON.parse(storedIngredients)
      const parsedOptions = storedOptions ? JSON.parse(storedOptions) : {}
      setIngredients(parsedIngredients)
      fetchRecipes(parsedIngredients, parsedOptions)
    } else {
      router.push("/generate")
    }
  }, [])

  const fetchRecipes = async (ingredientList: string[], options: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientList, options }),
      })

      const data = await response.json()

      if (data.success) {
        setRecipes(data.recipes)
      } else {
        throw new Error(data.error || "Failed to generate recipes")
      }
    } catch (error) {
      console.error("Error generating recipes:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (recipeTitle: string) => {
    let newFavs: string[]
    if (favorites.includes(recipeTitle)) {
      newFavs = favorites.filter(t => t !== recipeTitle)
      toast.info("Removed from favorites")
    } else {
      newFavs = [...favorites, recipeTitle]
      toast.success("Added to favorites!")
    }
    setFavorites(newFavs)
    localStorage.setItem("favoriteRecipes", JSON.stringify(newFavs))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-primary animate-bounce" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-3"
        >
          Crafting your recipes...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-sm"
        >
          Our AI is analyzing your ingredients to create the perfect culinary matches.
        </motion.p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass p-12 rounded-3xl text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => window.location.reload()} className="w-full rounded-2xl py-6">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link href="/generate" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Change Ingredients
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Custom <span className="text-gradient">Menu</span></h1>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <p className="text-sm text-muted-foreground mr-2 font-medium">Using:</p>
            {ingredients.map((ing, i) => (
              <Badge key={i} variant="secondary" className="rounded-full bg-primary/10 text-primary border-none px-3 py-1">
                {ing}
              </Badge>
            ))}
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border-dashed">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-8">Try adding more basic ingredients like spices or oils.</p>
            <Link href="/generate">
              <Button variant="outline" className="rounded-full px-8">Go Back</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.title}
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.title)}
                  onToggleFavorite={() => toggleFavorite(recipe.title)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            Not what you're looking for?
            <button onClick={() => window.location.reload()} className="text-primary hover:underline ml-1">Regenerate all</button>
          </div>
        </div>
      </div>
    </div>
  )
}
