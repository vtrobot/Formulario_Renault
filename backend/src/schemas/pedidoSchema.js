"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoSchema = void 0;
const zod_1 = require("zod");
exports.pedidoSchema = zod_1.z.object({
    codigoPedido: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    cliente: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    produto: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    quantidade: zod_1.z.string().min(1, "Obrigatório").refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
    }, { message: "Deve ser um número maior que zero" }),
    dataPedido: zod_1.z.string().min(1, "Obrigatório").max(10, "Formato DD/MM/AAAA").regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato inválido"),
    centroCusto: zod_1.z.string().max(100, "Máximo de 100 caracteres").optional().or(zod_1.z.literal("")),
    responsavel: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    unidade: zod_1.z.string().max(100, "Máximo de 100 caracteres").optional().or(zod_1.z.literal("")),
    valorPedido: zod_1.z.string().max(100, "Máximo de 100 caracteres").optional().or(zod_1.z.literal("")),
    observacao: zod_1.z.string().max(500, "Máximo de 500 caracteres").optional().or(zod_1.z.literal(""))
});
//# sourceMappingURL=pedidoSchema.js.map