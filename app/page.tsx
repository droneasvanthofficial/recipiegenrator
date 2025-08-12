import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Utensils, Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <ChefHat className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Smart Recipe Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Transform your leftover ingredients into delicious meals! Upload a photo or list your ingredients, and let
            AI create amazing recipes to reduce food waste.
          </p>
          <Link href="/generate">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Utensils className="h-12 w-12 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-semibold">Smart Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Upload a photo of your ingredients and our AI will identify them automatically
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <ChefHat className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-xl font-semibold">Custom Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Get personalized recipes tailored to your available ingredients
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Leaf className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-semibold">Reduce Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Help the environment by making the most of your leftover ingredients
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
