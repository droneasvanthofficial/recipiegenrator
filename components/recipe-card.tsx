"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Users, ChefHat, Heart, ChevronRight, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="glass h-full border-none shadow-lg overflow-hidden flex flex-col group">
        <CardHeader className="pb-4 relative">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-3">
              {recipe.difficulty || "Easy"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              className={`rounded-full transition-all duration-300 ${
                isFavorite ? "text-red-500 bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              {recipe.cookTime}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              {recipe.servings} Servings
            </div>
            {recipe.calories && (
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-orange-500" />
                {recipe.calories} kcal
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-6">
          {/* Nutritional Info Grid */}
          {(recipe.protein || recipe.carbs || recipe.fat) && (
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Protein</p>
                <p className="font-bold text-sm">{recipe.protein || "-"}</p>
              </div>
              <div className="text-center border-x border-border/50">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Carbs</p>
                <p className="font-bold text-sm">{recipe.carbs || "-"}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Fat</p>
                <p className="font-bold text-sm">{recipe.fat || "-"}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-primary" />
              Main Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.slice(0, 5).map((ing, i) => (
                <span key={i} className="text-xs bg-muted/50 px-2 py-1 rounded-md text-muted-foreground">
                  {ing.split(',')[0]}
                </span>
              ))}
              {recipe.ingredients.length > 5 && (
                <span className="text-xs text-muted-foreground italic">+{recipe.ingredients.length - 5} more</span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 space-y-6"
              >
                <div>
                  <h4 className="text-sm font-semibold mb-3">All Ingredients</h4>
                  <ul className="space-y-1.5">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-primary">Instructions</h4>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-3">
                        <span className="font-bold text-primary/30 text-lg leading-none">{i + 1}</span>
                        <p>{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            className="w-full mt-2 rounded-xl group/btn hover:bg-primary/5 text-primary font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "View Full Recipe"}
            <ChevronRight className={`ml-1 w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : "group-hover:translate-x-1"}`} />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
