"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthenticationController_1 = __importDefault(require("./AuthenticationController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const authenticationRouter = express_1.default.Router();
const { TokenValidator } = middlewares_1.default;
authenticationRouter.get('/auth/verify', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator), AuthenticationController_1.default.verifyUser);
exports.default = authenticationRouter;
//# sourceMappingURL=index.js.map