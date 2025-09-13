import { createId } from '@paralleldrive/cuid2';

// Gera um código curto personalizado
export function generateShortCode(): string {
  // Usa apenas os primeiros 8 caracteres do CUID2 para manter curto
  return createId().slice(0, 8);
}

/**
 * Valida se uma URL é válida
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida se um código curto tem formato válido
 */
export function isValidShortCode(shortCode: string): boolean {
  return /^[a-zA-Z0-9]{6,10}$/.test(shortCode);
}
