"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = __importDefault(require("./locationController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { TokenValidator, GeneralValidator, } = middlewares_1.default;
const locationRouter = express_1.default.Router();
locationRouter.use('/locations', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
locationRouter.get('/locations/:id', GeneralValidator.validateQueryParams, locationController_1.default.getLocation);
exports.default = locationRouter;
//# sourceMappingURL=index.js.map