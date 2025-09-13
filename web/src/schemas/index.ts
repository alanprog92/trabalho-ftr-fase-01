import { z } from 'zod';

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL original é obrigatória')
    .url('URL inválida'),
  shortCode: z
    .string()
    .min(1, 'Código encurtado é obrigatório')
    .regex(/^[a-zA-Z0-9]{6,10}$/, 'Código deve conter apenas letras e números, com 6 a 10 caracteres')
    .min(6, 'Código encurtado deve ter no mínimo 6 caracteres')
    .max(10, 'Código encurtado deve ter no máximo 10 caracteres'),
});

export type CreateUrlFormData = z.infer<typeof createUrlSchema>;
