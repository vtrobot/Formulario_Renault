"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoSchema = void 0;
const zod_1 = require("zod");
exports.pedidoSchema = zod_1.z.object({
    item: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    modelo: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    versao: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    nomePeca: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    gfpg: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
    quantidade: zod_1.z.string().min(1, "Obrigatório").refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
    }, { message: "Deve ser um número maior que zero" }),
    chavePedido: zod_1.z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
});
//# sourceMappingURL=pedidoSchema.js.map