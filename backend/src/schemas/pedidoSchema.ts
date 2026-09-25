import { z } from 'zod';

export const pedidoSchema = z.object({
  item: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  modelo: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  versao: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  nomePeca: z.string().min(1, "Obrigatório").max(200, "Máximo de 200 caracteres"),
  gfpg: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  quantidade: z.string().min(1, "Obrigatório").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: "Deve ser um número maior que zero" }),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;

export const pedidoLoteSchema = z.object({
  itens: z.array(pedidoSchema).min(1, "Pelo menos um item é obrigatório"),
});

export type PedidoLoteInput = z.infer<typeof pedidoLoteSchema>;
