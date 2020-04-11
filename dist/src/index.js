"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const http_1 = __importDefault(require("http"));
const environment_1 = __importDefault(require("./config/environment"));
const app_1 = __importDefault(require("./app"));
const startUpHelper_1 = __importDefault(require("./scripts/startUpHelper"));
const logger = debug_1.default('log');
const server = http_1.default.createServer(app_1.default);
startUpHelper_1.default.ensureSuperAdminExists();
startUpHelper_1.default.registerEventHandlers();
server.listen(environment_1.default.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    app_1.default.set('host', `http://localhost:${environment_1.default.PORT}`);
    logger(`Find me on http://localhost:${environment_1.default.PORT}`);
}));
//# sourceMappingURL=index.js.map