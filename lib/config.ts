import { z } from 'zod'

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_GROQ_API_KEY: z.string().min(1, 'NEXT_PUBLIC_GROQ_API_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  // Optional with defaults
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  API_TIMEOUT_MS: z.coerce.number().default(30000),
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  ALLOWED_IMAGE_TYPES: z.string().default('image/jpeg,image/png,image/webp'),
  RATE_LIMIT_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),

  // Feature flags
  NEXT_PUBLIC_ENABLE_RECIPE_SAVING: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_USER_ACCOUNTS: z.coerce.boolean().default(false),

  // Analytics (optional)
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

export type EnvConfig = z.infer<typeof envSchema>

let validatedConfig: EnvConfig | null = null

export function getConfig(): EnvConfig {
  if (validatedConfig) {
    return validatedConfig
  }

  try {
    validatedConfig = envSchema.parse(process.env)
    return validatedConfig
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n')
      const message = `Environment validation failed:\n${errors}`

      if (typeof window === 'undefined') {
        console.error(message)
      }

      throw new Error(message)
    }
    throw error
  }
}

// Get validated configuration at module load time
export const config = getConfig()
