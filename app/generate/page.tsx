"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Camera, Type, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ApiClient } from "@/lib/api-client"

export default function GeneratePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [manualIngredients, setManualIngredients] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [inputMethod, setInputMethod] = useState<"photo" | "manual">("photo")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let ingredients: string[] = []

      if (inputMethod === "photo" && selectedImage) {
        const response = await ApiClient.detectIngredients(selectedImage)
        if (response.success) {
          ingredients = response.ingredients
        } else {
          throw new Error(response.error || "Failed to detect ingredients")
        }
      } else if (inputMethod === "manual" && manualIngredients) {
        ingredients = manualIngredients
          .split(",")
          .map((ing) => ing.trim())
          .filter((ing) => ing)
      }

      if (ingredients.length > 0) {
        // Store ingredients in sessionStorage and navigate to results
        sessionStorage.setItem("ingredients", JSON.stringify(ingredients))
        router.push("/results")
      }
    } catch (error) {
      console.error("Error processing ingredients:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = (inputMethod === "photo" && selectedImage) || (inputMethod === "manual" && manualIngredients.trim())

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Generate Recipe</h1>
          <p className="text-gray-600 mt-2">Choose how you'd like to input your ingredients</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button
              variant={inputMethod === "photo" ? "default" : "outline"}
              onClick={() => setInputMethod("photo")}
              className="h-16 flex items-center justify-center gap-3"
            >
              <Camera className="h-5 w-5" />
              Upload Photo
            </Button>
            <Button
              variant={inputMethod === "manual" ? "default" : "outline"}
              onClick={() => setInputMethod("manual")}
              className="h-16 flex items-center justify-center gap-3"
            >
              <Type className="h-5 w-5" />
              Type Ingredients
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {inputMethod === "photo" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Ingredient Photo
                </CardTitle>
                <CardDescription>
                  Take or upload a photo of your ingredients and we'll detect them automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Ingredient preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600">Image ready for processing</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <span className="text-green-600 hover:text-green-700 font-medium">Click to upload</span>
                          <span className="text-gray-600"> or drag and drop</span>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {inputMethod === "manual" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Enter Ingredients Manually
                </CardTitle>
                <CardDescription>
                  List your ingredients separated by commas (e.g., chicken, rice, spinach, onion)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your ingredients here..."
                  value={manualIngredients}
                  onChange={(e) => setManualIngredients(e.target.value)}
                  className="min-h-32"
                />
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  {inputMethod === "photo" ? "Detecting Ingredients..." : "Processing..."}
                </>
              ) : (
                "Generate Recipes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
