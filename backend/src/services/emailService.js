"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new resend_1.Resend(resendApiKey) : null;
exports.emailService = {
    async enviarEmailPedido(pedido) {
        if (!resend) {
            throw new Error('RESEND_API_KEY não configurada');
        }
        const mailTo = process.env.MAIL_TO;
        const mailFrom = process.env.MAIL_FROM;
        if (!mailTo || !mailFrom) {
            throw new Error('Variáveis MAIL_TO ou MAIL_FROM não configuradas');
        }
        const assunto = `Novo Pedido - ${pedido.codigoPedido}`;
        const corpo = `NOVO PEDIDO

Código do Pedido:
${pedido.codigoPedido}

Cliente:
${pedido.cliente}

Produto:
${pedido.produto}

Quantidade:
${pedido.quantidade}

Data do Pedido:
${pedido.dataPedido}

Centro de Custo:
${pedido.centroCusto || '—'}

Responsável:
${pedido.responsavel}

Unidade:
${pedido.unidade || '—'}

Valor do Pedido:
${pedido.valorPedido || '—'}

Observação:
${pedido.observacao || '—'}`;
        try {
            const data = await resend.emails.send({
                from: mailFrom,
                to: mailTo,
                subject: assunto,
                text: corpo,
            });
            if (data.error) {
                throw new Error(data.error.message);
            }
            return data;
        }
        catch (error) {
            console.error('Erro ao enviar e-mail pelo Resend:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=emailService.js.map