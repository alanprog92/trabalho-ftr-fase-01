<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# URL Shortener API - Custom Instructions

Este é um projeto de API para encurtamento de URLs usando:
- **TypeScript** para tipagem estática
- **Fastify** como framework web
- **Drizzle ORM** para interação com banco de dados
- **PostgreSQL** como banco de dados
- **Cloudflare R2** para storage de arquivos CSV

## Padrões do Projeto

### Estrutura de Arquivos
- `src/db/` - Configuração do banco e schemas
- `src/services/` - Lógica de negócio
- `src/routes/` - Definição de rotas da API
- `src/utils/` - Funções utilitárias

### Convenções de Código
- Use **camelCase** para variáveis e funções
- Use **PascalCase** para classes e tipos
- Prefira **async/await** ao invés de promises
- Sempre trate erros adequadamente
- Use **typed schemas** para validação de entrada

### API Design
- Use códigos HTTP apropriados (200, 201, 400, 404, 500)
- Retorne sempre objetos com `success` e `data`/`error`
- Documente endpoints com schemas Fastify
- Implemente validação de entrada robusta

### Database
- Use Drizzle ORM para todas as operações
- Sempre use transações quando apropriado
- Implemente validações no nível de aplicação
- Use UUIDs para chaves primárias

### Error Handling
- Capture e trate todos os erros
- Log erros para debugging
- Retorne mensagens de erro user-friendly
- Nunca vaze informações sensíveis nos erros
