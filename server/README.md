# URL Shortener API

API para gerenciamento de encurtamento de URLs desenvolvida com TypeScript, Fastify, Drizzle ORM e PostgreSQL.

## 📋 Funcionalidades e Regras

- [ ] Deve ser possível criar um link
  - [ ] Não deve ser possível criar um link com URL encurtada mal formatada
  - [ ] Não deve ser possível criar um link com URL encurtada já existente
- [ ] Deve ser possível deletar um link
- [ ] Deve ser possível obter a URL original por meio de uma URL encurtada
- [ ] Deve ser possível listar todas as URL's cadastradas
- [ ] Deve ser possível incrementar a quantidade de acessos de um link
- [ ] Deve ser possível exportar os links criados em um CSV
  - [ ] Deve ser possível acessar o CSV por meio de uma CDN (Amazon S3, Cloudflare R2, etc)
  - [ ] Deve ser gerado um nome aleatório e único para o arquivo
  - [ ] Deve ser possível realizar a listagem de forma performática
  - [ ] O CSV deve ter campos como, URL original, URL encurtada, contagem de acessos e data de criação.

## 🚀 Tecnologias

- **TypeScript** - Linguagem de programação
- **Fastify** - Framework web
- **Drizzle ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **Cloudflare R2** - Storage para arquivos CSV
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
src/
├── db/
│   ├── index.ts          # Configuração da conexão
│   └── schema.ts         # Schemas do banco
├── routes/
│   └── url.routes.ts     # Rotas da API
├── services/
│   ├── url.service.ts    # Lógica de negócio das URLs
│   └── csv.service.ts    # Serviço de exportação CSV
├── utils/
│   └── url.ts           # Utilitários para URLs
└── server.ts            # Servidor principal
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3333
DATABASE_URL="postgresql://username:password@localhost:5432/url_shortener"

# Cloudflare R2 (opcional - para export CSV)
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

### 2. Instalação

```bash
# Instalar dependências
npm install

# Executar migrations do banco
npm run db:migrate
```

### 3. Desenvolvimento

```bash
# Executar em modo desenvolvimento
npm run dev

# Build da aplicação
npm run build

# Executar em produção
npm start
```

## 🐳 Docker

### Build da imagem

```bash
docker build -t url-shortener-api .
```

### Executar com Docker Compose

```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: url_shortener
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "3333:3333"
    environment:
      DATABASE_URL: "postgresql://postgres:password@db:5432/url_shortener"
      PORT: 3333
    depends_on:
      - db

volumes:
  postgres_data:
```

## 📡 API Endpoints

### Criar URL encurtada
```http
POST /urls
Content-Type: application/json

{
  "originalUrl": "https://exemplo.com",
  "shortCode": "custom123" // opcional
}
```

### Listar todas as URLs
```http
GET /urls
```

### Redirecionar para URL original
```http
GET /:shortCode
```

### Obter informações da URL
```http
GET /api/:shortCode
```

### Deletar URL
```http
DELETE /urls/:id
```

### Exportar URLs para CSV
```http
POST /urls/export
```

### Health Check
```http
GET /health
```

## 🗃️ Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Build da aplicação
- `npm start` - Executar em produção
- `npm run db:migrate` - Executar migrations do banco
- `npm run db:generate` - Gerar migrations
- `npm run db:studio` - Abrir Drizzle Studio

## 🔒 Segurança

- Validação de entrada robusta
- Sanitização de URLs
- Códigos curtos únicos e seguros
- Tratamento adequado de erros
- CORS habilitado

## 🚦 Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `301` - Redirecionamento permanente
- `400` - Erro de validação
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor
- `501` - Funcionalidade não implementada

## 📝 Exemplo de Uso

```bash
# Criar uma URL encurtada
curl -X POST http://localhost:3333/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://github.com"}'

# Resposta
{
  "success": true,
  "data": {
    "id": "cm123abc456",
    "originalUrl": "https://github.com",
    "shortCode": "abc12345",
    "accessCount": 0,
    "createdAt": "2025-08-12T12:00:00.000Z",
    "updatedAt": "2025-08-12T12:00:00.000Z"
  }
}

# Acessar URL encurtada
curl http://localhost:3333/abc12345
# Retorna redirect 301 para https://github.com
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
