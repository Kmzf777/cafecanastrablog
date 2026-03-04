'use client'

import { useState, useCallback } from 'react'
import type { ZodSchema, ZodError } from 'zod'

export function useBlockValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = useCallback(
    (data: unknown): boolean => {
      const result = schema.safeParse(data)
      if (result.success) {
        setErrors({})
        return true
      }
      const fieldErrors: Record<string, string> = {}
      for (const issue of (result.error as ZodError).issues) {
        const key = issue.path.join('.') || '_root'
        fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return false
    },
    [schema]
  )

  const clearErrors = useCallback(() => setErrors({}), [])

  return { errors, validate, clearErrors }
}
