import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { pedidoRoutes } from './routes/pedidoRoutes';

dotenv.config();

const app = fastify({ logger: true });

// Configurar CORS (ajuste para a origem do seu frontend)
app.register(cors, {
  origin: '*', // MVP: aceita de qualquer lugar. Em prod, use a origem exata.
});

// Registrar rotas
app.register(pedidoRoutes, { prefix: '/api' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
