# Encurtador de URLs - Frontend

Uma aplicação React TypeScript para gerenciamento de URLs encurtadas, desenvolvida com Vite, TailwindCSS, React Query, React Hook Form e Zod.

## 🚀 Funcionalidades

### ✅ Funcionalidades Implementadas

- [x] Criar um link encurtado
- [x] Validação de URL mal formatada
- [x] Validação de URL encurtada já existente
- [x] Deletar um link
- [x] Obter URL original por meio do encurtamento
- [x] Listar todas as URLs cadastradas
- [x] Incrementar quantidade de acessos
- [x] Baixar relatório CSV dos links
- [x] Interface responsiva (desktop e mobile)
- [x] Estados de carregamento e erro
- [x] Página de redirecionamento
- [x] Página 404 customizada

## 🛠️ Tecnologias Utilizadas

### Obrigatórias
- **TypeScript** - Tipagem estática
- **React** - Framework frontend
- **Vite** - Bundler e servidor de desenvolvimento

### Opcionais (utilizadas)
- **TailwindCSS** - Framework CSS utilitário
- **React Query (@tanstack/react-query)** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **React Router DOM** - Roteamento SPA

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── UrlForm.tsx     # Formulário de criação de URL
│   └── UrlList.tsx     # Lista e gerenciamento de URLs
├── hooks/              # Hooks personalizados
│   └── useUrls.ts      # Hooks para React Query
├── pages/              # Páginas da aplicação
│   ├── HomePage.tsx    # Página principal (/)
│   ├── RedirectPage.tsx # Página de redirecionamento (/:url)
│   └── NotFoundPage.tsx # Página 404
├── schemas/            # Esquemas de validação Zod
│   └── index.ts
├── services/           # Serviços de API
│   └── api.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```

## 🌐 Páginas

1. **Página Raiz (/)** - Formulário de cadastro e listagem de links
2. **Redirecionamento (/:short-code)** - Busca URL e redireciona
3. **404 (qualquer outra rota)** - Página de erro para recursos não encontrados

## ⚙️ Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
```

### Pré-requisitos

- **Node.js 20.19+ ou 22.12+** (atualmente usando 18.16.0 - necessário upgrade)
- **npm** ou **yarn**

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
```

### 3. Build para Produção

```bash
npm run build
```

### 4. Preview da Build

```bash
npm run preview
```

## ⚠️ Problemas Conhecidos

### Versão do Node.js

O projeto foi desenvolvido com Node.js 18.16.0, mas o Vite 7.1.3 requer Node.js 20.19+ ou 22.12+. Para executar o projeto:

1. **Atualize o Node.js** para a versão 20.19+ ou 22.12+
2. Ou **downgrade** as dependências para versões compatíveis

### Compatibilidade da API

Certifique-se de que a API backend esteja rodando e acessível na URL configurada em `VITE_BACKEND_URL`.

## 🎨 Design e UX

- Interface clean e moderna com TailwindCSS
- Totalmente responsiva (mobile-first)
- Estados de carregamento com spinners animados
- Feedback visual para todas as ações
- Notificações de erro e sucesso
- Empty states informativos
- Ícones intuitivos

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build
- `npm run lint` - Linting do código

## 📝 Validações Implementadas

### URL Original
- Campo obrigatório
- Deve ser uma URL válida

### URL Encurtada
- Campo obrigatório
- Mínimo 3 caracteres, máximo 50
- Apenas letras, números, hífens e underscores
- Verificação de unicidade via API

## 🔗 Integração com API

O frontend está preparado para se comunicar com uma API REST que deve implementar os seguintes endpoints:

- `POST /urls` - Criar nova URL
- `GET /urls` - Listar todas as URLs
- `GET /urls/:shortCode` - Buscar URL por código encurtado
- `DELETE /urls/:id` - Deletar URL
- `PATCH /urls/:shortCode/access` - Incrementar acesso
- `GET /urls/export` - Baixar relatório CSV

## 📱 Responsividade

A aplicação foi desenvolvida com abordagem mobile-first e funciona perfeitamente em:

- 📱 Dispositivos móveis (320px+)
- 📟 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1280px+)

## 🎯 Próximos Passos

Para melhorar ainda mais a aplicação:

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar modo escuro
- [ ] Implementar paginação na lista de URLs
- [ ] Adicionar filtros e busca
- [ ] Implementar analytics mais detalhados
- [ ] Adicionar PWA capabilities
- [ ] Implementar autenticação de usuários
