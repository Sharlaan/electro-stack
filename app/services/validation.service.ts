export function validateLength(content: string, minLength: number, errorMessage?: string) {
  if (content.length < minLength) {
    return errorMessage || `Too short input: this must have at least ${minLength} characters.`;
  }
}
