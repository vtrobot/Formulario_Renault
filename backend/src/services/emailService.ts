import { Resend } from 'resend';
import dotenv from 'dotenv';
import type { PedidoInput } from '../schemas/pedidoSchema';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const emailService = {
  async enviarEmailPedido(pedido: PedidoInput) {
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
    } catch (error) {
      console.error('Erro ao enviar e-mail pelo Resend:', error);
      throw error;
    }
  }
};
