import type { PedidoInput } from '../schemas/pedidoSchema';
export declare const emailService: {
    enviarEmailPedido(pedido: PedidoInput): Promise<{
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }>;
};
//# sourceMappingURL=emailService.d.ts.map