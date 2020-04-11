"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExportsController_1 = __importDefault(require("./ExportsController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const exportsRouter = express_1.Router();
const { TokenValidator } = middlewares_1.default;
exportsRouter.use('/export', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
exportsRouter.get('/export/pdf', ExportsController_1.default.exportToPDF);
exportsRouter.get('/export/csv', ExportsController_1.default.exportToCSV);
exports.default = exportsRouter;
//# sourceMappingURL=index.js.map