"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await app_1.default.listen({ port, host: '0.0.0.0' });
        console.log(`Server is running at http://localhost:${port}`);
    }
    catch (err) {
        app_1.default.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map