import { z } from 'zod';

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL original é obrigatória')
    .url('URL inválida'),
  shortCode: z
    .string()
    .min(1, 'Código encurtado é obrigatório')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Código encurtado deve conter apenas letras, números, hífens e underscores')
    .min(3, 'Código encurtado deve ter pelo menos 3 caracteres')
    .max(50, 'Código encurtado deve ter no máximo 50 caracteres'),
});

export type CreateUrlFormData = z.infer<typeof createUrlSchema>;
