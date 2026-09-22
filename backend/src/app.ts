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

export default app;
