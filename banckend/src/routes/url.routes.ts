import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UrlService } from '../services/url.service';
import { CsvService } from '../services/csv.service';

interface CreateUrlBody {
  originalUrl: string;
  shortCode?: string;
}

interface UrlParams {
  shortCode: string;
}

interface UrlIdParams {
  id: string;
}

export async function urlRoutes(fastify: FastifyInstance) {
  const urlService = new UrlService();
  
  // Configurar CSV service apenas se as variáveis estiverem definidas
  let csvService: CsvService | null = null;
  
  if (
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_BUCKET &&
    process.env.CLOUDFLARE_PUBLIC_URL
  ) {
    csvService = new CsvService({
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      bucket: process.env.CLOUDFLARE_BUCKET,
      publicUrl: process.env.CLOUDFLARE_PUBLIC_URL,
    });
  }

  // POST /urls - Criar nova URL encurtada
  fastify.post<{ Body: CreateUrlBody }>(
    '/urls',
    {
      schema: {
        body: {
          type: 'object',
          required: ['originalUrl'],
          properties: {
            originalUrl: { type: 'string', format: 'uri' },
            shortCode: { type: 'string', pattern: '^[a-zA-Z0-9]{6,10}$' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateUrlBody }>, reply: FastifyReply) => {
      try {
        const { originalUrl, shortCode } = request.body;
        const url = await urlService.createUrl(originalUrl, shortCode);
        
        return reply.code(201).send({
          success: true,
          data: url
        });
      } catch (error) {
        return reply.code(400).send({
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  );

  // GET /urls - Listar todas as URLs
  fastify.get('/urls', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const urls = await urlService.listUrls();
      
      return reply.send({
        success: true,
        data: urls
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

  // GET /:shortCode - Redirecionar para URL original
  fastify.get<{ Params: UrlParams }>(
    '/:shortCode',
    async (request: FastifyRequest<{ Params: UrlParams }>, reply: FastifyReply) => {
      try {
        const { shortCode } = request.params;
        
        const url = await urlService.getUrlByShortCode(shortCode);
        if (!url) {
          return reply.code(404).send({
            success: false,
            error: 'URL não encontrada'
          });
        }

        // Incrementar contador de acessos
        await urlService.incrementAccessCount(shortCode);

        // Redirecionar
        return reply.code(301).redirect(url.originalUrl);
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    }
  );

  // GET /api/:shortCode - Obter informações da URL sem redirecionar
  fastify.get<{ Params: UrlParams }>(
    '/api/:shortCode',
    async (request: FastifyRequest<{ Params: UrlParams }>, reply: FastifyReply) => {
      try {
        const { shortCode } = request.params;
        
        const url = await urlService.getUrlByShortCode(shortCode);
        if (!url) {
          return reply.code(404).send({
            success: false,
            error: 'URL não encontrada'
          });
        }

        return reply.send({
          success: true,
          data: url
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    }
  );

  // DELETE /urls/:id - Deletar URL por ID
  fastify.delete<{ Params: UrlIdParams }>(
    '/urls/:id',
    async (request: FastifyRequest<{ Params: UrlIdParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        
        const deleted = await urlService.deleteUrl(id);
        if (!deleted) {
          return reply.code(404).send({
            success: false,
            error: 'URL não encontrada'
          });
        }

        return reply.send({
          success: true,
          message: 'URL deletada com sucesso'
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    }
  );

  // POST /urls/export - Exportar URLs para CSV
  fastify.post('/urls/export', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!csvService) {
        return reply.code(501).send({
          success: false,
          error: 'Serviço de exportação não configurado'
        });
      }

      const csvUrl = await csvService.exportUrlsToCsv();
      
      return reply.send({
        success: true,
        data: {
          downloadUrl: csvUrl
        }
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao exportar CSV'
      });
    }
  });
}
