import { Resend } from 'resend';
import dotenv from 'dotenv';
import type { PedidoInput, PedidoLoteInput } from '../schemas/pedidoSchema';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const emailService = {
  async enviarEmailPedido(pedido: PedidoInput) {
    if (!resend) {
      throw new Error('RESEND_API_KEY não configurada');
    }

    const rawMailTo = process.env.MAIL_TO;
    const rawMailFrom = process.env.MAIL_FROM;

    if (!rawMailTo || !rawMailFrom) {
      throw new Error('Variáveis MAIL_TO ou MAIL_FROM não configuradas');
    }

    const mailFrom = rawMailFrom.trim();
    const mailTo = rawMailTo
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (mailTo.length === 0) {
      throw new Error('Destinatário MAIL_TO inválido ou vazio');
    }

    const assunto = 'PedidosRenault';

    const corpo = `Item;Modelo;Versao;NomePeca;GfPg;Quantidade;ChavePedido;email;nomeprojeto;areademandante;mailestone|${pedido.item};${pedido.modelo};${pedido.versao};${pedido.nomePeca};${pedido.gfpg};${pedido.quantidade};${pedido.chavePedido || ''};${pedido.email};${pedido.projeto};${pedido.area};${pedido.milestone}`;

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
  },

  async enviarEmailPedidoLote(lote: PedidoLoteInput) {
    if (!resend) {
      throw new Error('RESEND_API_KEY não configurada');
    }

    const rawMailTo = process.env.MAIL_TO;
    const rawMailFrom = process.env.MAIL_FROM;

    if (!rawMailTo || !rawMailFrom) {
      throw new Error('Variáveis MAIL_TO ou MAIL_FROM não configuradas');
    }

    const mailFrom = rawMailFrom.trim();
    const mailTo = rawMailTo
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (mailTo.length === 0) {
      throw new Error('Destinatário MAIL_TO inválido ou vazio');
    }

    const assunto = 'PedidosRenault';

    // Header row
    const header = 'Item;Modelo;Versao;NomePeca;GfPg;Quantidade;ChavePedido;email;nomeprojeto;areademandante;mailestone';

    // Each item as a separate line
    const linhas = lote.itens.map(
      (item) => `${item.item};${item.modelo};${item.versao};${item.nomePeca};${item.gfpg};${item.quantidade};${lote.chavePedido || item.chavePedido || ''};${item.email};${item.projeto};${item.area};${item.milestone}`
    );

    const corpo = [header, ...linhas].join('|');

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
      console.error('Erro ao enviar e-mail lote pelo Resend:', error);
      throw error;
    }
  },
};
