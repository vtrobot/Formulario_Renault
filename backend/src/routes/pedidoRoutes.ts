import type { FastifyPluginAsync } from 'fastify';
import { pedidoSchema, pedidoLoteSchema } from '../schemas/pedidoSchema';
import { emailService } from '../services/emailService';

export const pedidoRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post('/pedidos', async (request, reply) => {
    try {
      // Validar os dados de entrada usando Zod
      const parseResult = pedidoSchema.safeParse(request.body);

      if (!parseResult.success) {
        // Log interno para debug (opcional)
        // console.error('Erro de validação:', parseResult.error);
        return reply.status(400).send({
          success: false,
          message: "Não foi possível enviar o pedido."
        });
      }

      const pedido = parseResult.data;

      // Enviar e-mail usando Resend
      await emailService.enviarEmailPedido(pedido);

      return reply.status(200).send({
        success: true,
        message: "Pedido enviado com sucesso."
      });
      
    } catch (error) {
      console.error('Erro na rota POST /pedidos:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return reply.status(500).send({
        success: false,
        message: "Não foi possível enviar o pedido.",
        debug: errorMessage
      });
    }
  });

  fastify.post('/pedidos/lote', async (request, reply) => {
    try {
      const parseResult = pedidoLoteSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          message: "Dados inválidos. Verifique os itens e tente novamente."
        });
      }

      const lote = parseResult.data;

      await emailService.enviarEmailPedidoLote(lote);

      return reply.status(200).send({
        success: true,
        message: `${lote.itens.length} ${lote.itens.length === 1 ? 'item enviado' : 'itens enviados'} com sucesso.`
      });

    } catch (error) {
      console.error('Erro na rota POST /pedidos/lote:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return reply.status(500).send({
        success: false,
        message: "Não foi possível enviar os itens por e-mail.",
        debug: errorMessage
      });
    }
  });
};
