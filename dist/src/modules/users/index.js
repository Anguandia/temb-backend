"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsersController_1 = __importDefault(require("./UsersController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { UserValidator, TokenValidator, GeneralValidator } = middlewares_1.default;
const userRouter = express_1.default.Router();
userRouter.use('/users', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
userRouter.put('/users', UserValidator.validateUpdateBody, UsersController_1.default.updateRecord);
userRouter.post('/users', UserValidator.validateNewBody, UsersController_1.default.newUserRecord);
userRouter.get('/users', GeneralValidator.validateQueryParams, UsersController_1.default.readRecords);
exports.default = userRouter;
//# sourceMappingURL=index.js.map