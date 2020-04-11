"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = __importDefault(require("./address.controller"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { AddressValidator, TokenValidator, GeneralValidator } = middlewares_1.default;
const addressRouter = express_1.default.Router();
addressRouter.use('/addresses', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
addressRouter.post('/addresses', AddressValidator.validateAddressBody, AddressValidator.validateaddress, address_controller_1.default.addNewAddress);
addressRouter.put('/addresses', AddressValidator.validateAddressUpdateBody, AddressValidator.validateUpdateaddress, address_controller_1.default.updateAddress);
addressRouter.get('/addresses', GeneralValidator.validateQueryParams, address_controller_1.default.getAddresses);
addressRouter.get('/addresses/:id', GeneralValidator.validateIdParam, address_controller_1.default.getSingleAddress);
exports.default = addressRouter;
//# sourceMappingURL=index.js.map