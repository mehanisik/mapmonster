/**
 * Validates that the specified environment variables are set at runtime.
 * Throws an error if any variables are missing.
 */
export function validateEnv(requiredVars: string[]): void {
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(
      `[validateEnv] Missing environment variables: ${missingVars.join(', ')}`
    )
  }
}
