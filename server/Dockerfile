# Use a imagem oficial do Node.js como base
FROM node:20-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Etapa de desenvolvimento
FROM base AS deps

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Etapa de build
FROM base AS builder

WORKDIR /app

# Copiar dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Etapa de produção
FROM base AS runner

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Mudar ownership dos arquivos
USER nextjs

# Expor porta
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "start"]
