import { z } from 'zod';

export const pedidoSchema = z.object({
  item: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  modelo: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  versao: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  nomePeca: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  gfpg: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  quantidade: z.string().min(1, "Obrigatório").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: "Deve ser um número maior que zero" }),
  chavePedido: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;
