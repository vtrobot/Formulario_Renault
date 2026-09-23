import { z } from 'zod';
export declare const pedidoSchema: z.ZodObject<{
    item: z.ZodString;
    modelo: z.ZodString;
    versao: z.ZodString;
    nomePeca: z.ZodString;
    gfpg: z.ZodString;
    quantidade: z.ZodString;
    chavePedido: z.ZodString;
}, z.core.$strip>;
export type PedidoInput = z.infer<typeof pedidoSchema>;
//# sourceMappingURL=pedidoSchema.d.ts.map