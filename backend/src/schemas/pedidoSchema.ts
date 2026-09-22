import { z } from 'zod';

export const pedidoSchema = z.object({
  codigoPedido: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  cliente: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  produto: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  quantidade: z.string().min(1, "Obrigatório").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: "Deve ser um número maior que zero" }),
  dataPedido: z.string().min(1, "Obrigatório").max(10, "Formato DD/MM/AAAA").regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato inválido"),
  centroCusto: z.string().max(100, "Máximo de 100 caracteres").optional().or(z.literal("")),
  responsavel: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  unidade: z.string().max(100, "Máximo de 100 caracteres").optional().or(z.literal("")),
  valorPedido: z.string().max(100, "Máximo de 100 caracteres").optional().or(z.literal("")),
  observacao: z.string().max(500, "Máximo de 500 caracteres").optional().or(z.literal(""))
});

export type PedidoInput = z.infer<typeof pedidoSchema>;
