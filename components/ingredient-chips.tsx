"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Plus, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface IngredientChipsProps {
  ingredients: string[]
  onAdd: (ingredient: string) => void
  onRemove: (ingredient: string) => void
  onClear: () => void
  placeholder?: string
}

export function IngredientChips({
  ingredients,
  onAdd,
  onRemove,
  onClear,
  placeholder = "Add ingredient...",
}: IngredientChipsProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (inputValue.trim()) {
      onAdd(inputValue.trim().toLowerCase())
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Backspace" && !inputValue && ingredients.length > 0) {
      onRemove(ingredients[ingredients.length - 1])
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length === 0 ? placeholder : ""}
            className="pl-12 pr-16 py-7 rounded-2xl border-2 focus-visible:ring-primary/20 transition-all text-lg"
          />
        </form>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputValue && (
            <Button
              size="sm"
              onClick={() => handleSubmit()}
              className="rounded-xl h-10 w-10 p-0 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
          {ingredients.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive transition-colors px-3 h-10 rounded-xl"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[48px] p-2 rounded-2xl bg-muted/30 border border-dashed border-border">
        <AnimatePresence initial={false}>
          {ingredients.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-sm flex items-center gap-2 px-3 py-2"
            >
              No ingredients added yet.
            </motion.p>
          ) : (
            ingredients.map((ingredient) => (
              <motion.div
                key={ingredient}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                layout
              >
                <Badge
                  variant="secondary"
                  className="pl-4 pr-2 py-2 rounded-full flex items-center gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors text-sm font-medium group"
                >
                  {ingredient}
                  <button
                    onClick={() => onRemove(ingredient)}
                    className="p-1 rounded-full hover:bg-primary/20 text-primary/60 hover:text-primary transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
