"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HomebaseController_1 = __importDefault(require("./HomebaseController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { TokenValidator, HomebaseValidator, GeneralValidator } = middlewares_1.default;
const homebaseRouter = express_1.default.Router();
homebaseRouter.use('/homebases', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
homebaseRouter.post('/homebases', HomebaseValidator.validateHomeBase, HomebaseValidator.validateCountryExists, HomebaseController_1.default.addHomeBase);
homebaseRouter.get('/homebases', GeneralValidator.validateQueryParams, HomebaseController_1.default.getHomebases);
homebaseRouter.put('/homebases/:id', HomebaseValidator.validateHomeBaseIdQueryParam, HomebaseValidator.validateUpdateHomeBase, HomebaseValidator.validateHomeBaseExists, HomebaseValidator.validateCountryExists, HomebaseController_1.default.update);
exports.default = homebaseRouter;
//# sourceMappingURL=index.js.map