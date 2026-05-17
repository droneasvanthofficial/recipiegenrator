"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload, Camera, Type, ArrowLeft, Sparkles,
  Trash2, Search, SlidersHorizontal, Info,
  AlertCircle, ChefHat, Clock, Ban
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ApiClient } from "@/lib/api-client"
import { IngredientChips } from "@/components/ingredient-chips"
import { toast } from "sonner"

export default function GeneratePage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([])
  const [isQuickCook, setIsQuickCook] = useState(false)
  const [difficulty, setDifficulty] = useState<"any" | "easy" | "medium" | "hard">("any")

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [inputMethod, setInputMethod] = useState<"manual" | "photo">("manual")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // For "Surprise Me"
  const surpriseIngredients = [
    ["salmon", "asparagus", "lemon", "garlic"],
    ["chicken breast", "broccoli", "soy sauce", "ginger"],
    ["pasta", "tomatoes", "basil", "mozzarella"],
    ["sweet potato", "black beans", "avocado", "lime"],
    ["tofu", "spinach", "mushrooms", "sesame oil"]
  ]

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Auto-detect if image is uploaded
      setIsDetecting(true)
      try {
        const response = await ApiClient.detectIngredients(file)
        if (response.success) {
          const newIngredients = [...new Set([...ingredients, ...response.ingredients])]
          setIngredients(newIngredients)
          toast.success(`Detected ${response.ingredients.length} ingredients!`)
        } else {
          toast.error(response.error || "Failed to detect ingredients")
        }
      } catch (err) {
        toast.error("Vision AI failed. Please add manually.")
      } finally {
        setIsDetecting(false)
      }
    }
  }

  const handleSurpriseMe = () => {
    const randomSet = surpriseIngredients[Math.floor(Math.random() * surpriseIngredients.length)]
    setIngredients(randomSet)
    toast.success("Random ingredients added!")
  }

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Store all options in sessionStorage
      sessionStorage.setItem("ingredients", JSON.stringify(ingredients))
      sessionStorage.setItem("options", JSON.stringify({
        excludedIngredients,
        isQuickCook,
        difficulty
      }))

      router.push("/results")
    } catch (error) {
      console.error("Error saving search options:", error)
      setError("Failed to process your request.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Culinara AI</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <main className="container mx-auto px-6 pt-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 tracking-tight">What's in your kitchen?</h1>
            <p className="text-muted-foreground text-lg">Add ingredients and we'll handle the rest.</p>
          </motion.div>

          <div className="space-y-8">
            {/* Input Method Toggles */}
            <div className="flex p-1.5 bg-muted rounded-2xl w-fit">
              <button
                onClick={() => setInputMethod("manual")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  inputMethod === "manual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setInputMethod("photo")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  inputMethod === "photo" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Camera className="w-4 h-4" />
                Photo Scan
              </button>
            </div>

            <div className="grid gap-8">
              {/* Main Ingredient Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    Ingredients
                    <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {ingredients.length} added
                    </span>
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSurpriseMe}
                    className="text-primary hover:text-primary hover:bg-primary/5 font-medium flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Surprise Me
                  </Button>
                </div>

                {inputMethod === "photo" ? (
                  <Card className="border-2 border-dashed border-border bg-muted/30 overflow-hidden relative">
                    <CardContent className="p-0">
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" onClick={() => {setImagePreview(null); setSelectedImage(null)}}>
                              Change Photo
                            </Button>
                          </div>
                          {isDetecting && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                              <LoadingSpinner className="w-8 h-8 text-primary" />
                              <p className="font-medium animate-pulse">Detecting ingredients...</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <p className="font-semibold">Drop image here or click to upload</p>
                          <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG</p>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <IngredientChips
                    ingredients={ingredients}
                    onAdd={(ing) => setIngredients([...new Set([...ingredients, ing])])}
                    onRemove={(ing) => setIngredients(ingredients.filter(i => i !== ing))}
                    onClear={() => setIngredients([])}
                    placeholder="Enter ingredients (e.g. eggs, flour, milk)"
                  />
                )}
              </section>

              {/* Filters & Options */}
              <section className="space-y-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <SlidersHorizontal className="w-4 h-4" />
                  <h3 className="font-semibold text-foreground">Preferences</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Exclusions */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-destructive" />
                      Exclude / Allergies
                    </Label>
                    <IngredientChips
                      ingredients={excludedIngredients}
                      onAdd={(ing) => setExcludedIngredients([...new Set([...excludedIngredients, ing])])}
                      onRemove={(ing) => setExcludedIngredients(excludedIngredients.filter(i => i !== ing))}
                      onClear={() => setExcludedIngredients([])}
                      placeholder="e.g. peanuts, dairy..."
                    />
                  </div>

                  {/* Settings */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Quick Cook
                        </Label>
                        <p className="text-xs text-muted-foreground">Ready in 15 minutes or less</p>
                      </div>
                      <Switch
                        checked={isQuickCook}
                        onCheckedChange={setIsQuickCook}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Difficulty Level</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {["any", "easy", "medium", "hard"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setDifficulty(d as any)}
                            className={`py-2 rounded-xl text-xs font-medium capitalize border-2 transition-all ${
                              difficulty === d
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-background border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Submit Section */}
            <div className="pt-8">
              <Button
                onClick={handleSubmit}
                disabled={ingredients.length === 0 || isLoading}
                className="w-full py-8 rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-3 h-6 w-6" />
                    Generating Recipes...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Generate Recipes
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                <Info className="w-4 h-4" />
                AI-powered recipes may vary in accuracy. Always check food safety.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
