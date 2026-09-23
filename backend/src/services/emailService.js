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
        const assunto = 'PedidosRenault';
        const corpo = `NOVO PEDIDO

Item:
${pedido.item}

Modelo:
${pedido.modelo}

Versão:
${pedido.versao}

Nome da Peça:
${pedido.nomePeca}

GFPG:
${pedido.gfpg}

Quantidade:
${pedido.quantidade}

Chave do Pedido:
${pedido.chavePedido}`;
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