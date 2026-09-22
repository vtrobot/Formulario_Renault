"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pedidoRoutes_1 = require("./routes/pedidoRoutes");
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
// Configurar CORS (ajuste para a origem do seu frontend)
app.register(cors_1.default, {
    origin: '*', // MVP: aceita de qualquer lugar. Em prod, use a origem exata.
});
// Registrar rotas
app.register(pedidoRoutes_1.pedidoRoutes, { prefix: '/api' });
exports.default = app;
//# sourceMappingURL=app.js.map