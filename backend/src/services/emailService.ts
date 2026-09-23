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

    const assunto = 'PedidosRenault';

    const corpo = `Item;Modelo;Versao;NomePeca;GfPg;Quantidade;ChavePedido|${pedido.item};${pedido.modelo};${pedido.versao};${pedido.nomePeca};${pedido.gfpg};${pedido.quantidade};${pedido.chavePedido}`;

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
