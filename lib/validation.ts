import { z } from 'zod'

export const ImageValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Image file is required')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Image must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Image must be JPEG, PNG, or WebP format',
    ),
})

export const IngredientsValidationSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100).trim())
    .min(1, 'At least one ingredient is required')
    .max(50, 'Maximum 50 ingredients allowed')
    .refine((items) => new Set(items).size === items.length, 'Duplicate ingredients found'),
})

export const ManualIngredientsSchema = z.object({
  ingredients: z
    .string()
    .min(1, 'Ingredients list is required')
    .max(500, 'Ingredients list too long')
    .transform((str) =>
      str
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0),
    )
    .refine((items) => items.length > 0, 'At least one ingredient is required')
    .refine((items) => items.length <= 50, 'Maximum 50 ingredients allowed')
    .refine((items) => new Set(items).size === items.length, 'Duplicate ingredients found'),
})

export function sanitizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 100)
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 10MB' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Image must be JPEG, PNG, or WebP format' }
  }

  return { valid: true }
}

export function validateApiResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  return schema.parse(data)
}
