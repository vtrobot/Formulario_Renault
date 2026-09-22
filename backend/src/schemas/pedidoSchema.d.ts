import { z } from 'zod';
export declare const pedidoSchema: z.ZodObject<{
    codigoPedido: z.ZodString;
    cliente: z.ZodString;
    produto: z.ZodString;
    quantidade: z.ZodString;
    dataPedido: z.ZodString;
    centroCusto: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    responsavel: z.ZodString;
    unidade: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    valorPedido: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    observacao: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type PedidoInput = z.infer<typeof pedidoSchema>;
//# sourceMappingURL=pedidoSchema.d.ts.map