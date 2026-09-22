"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoRoutes = void 0;
const pedidoSchema_1 = require("../schemas/pedidoSchema");
const emailService_1 = require("../services/emailService");
const pedidoRoutes = async (fastify, opts) => {
    fastify.post('/pedidos', async (request, reply) => {
        try {
            // Validar os dados de entrada usando Zod
            const parseResult = pedidoSchema_1.pedidoSchema.safeParse(request.body);
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
            await emailService_1.emailService.enviarEmailPedido(pedido);
            return reply.status(200).send({
                success: true,
                message: "Pedido enviado com sucesso."
            });
        }
        catch (error) {
            console.error('Erro na rota POST /pedidos:', error);
            // Responder sempre com a mesma mensagem genérica em caso de erro interno/Resend
            return reply.status(500).send({
                success: false,
                message: "Não foi possível enviar o pedido."
            });
        }
    });
};
exports.pedidoRoutes = pedidoRoutes;
//# sourceMappingURL=pedidoRoutes.js.map