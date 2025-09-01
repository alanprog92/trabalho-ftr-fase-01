// Carregar variáveis de ambiente PRIMEIRO
import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { urlRoutes } from './routes/url.routes';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function start() {
  try {
    // Registrar plugins
    await fastify.register(cors, {
      origin: true, // Permitir todas as origens em desenvolvimento
      credentials: true,
    });

    // Registrar rotas
    await fastify.register(urlRoutes);

    // Health check
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Iniciar servidor
    const port = Number(process.env.PORT) || 3333;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Servidor rodando em http://${host}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await fastify.close();
    console.log('🛑 Servidor encerrado graciosamente');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao encerrar servidor:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
