"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const countriesController_1 = __importDefault(require("./countriesController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const { mainValidator, CountryValidator, TokenValidator, GeneralValidator } = middlewares_1.default;
const countryRouter = express_1.default.Router();
countryRouter.use('/countries', TokenValidator.attachJwtSecretKey.bind(TokenValidator), TokenValidator.authenticateToken.bind(TokenValidator));
countryRouter.post('/countries', CountryValidator.validateCountryReqBody, CountryValidator.validateCountryExistence, CountryValidator.setToActiveIfDeleted, countriesController_1.default.addCountry);
countryRouter.put('/countries', CountryValidator.validateUpdateReqBody, CountryValidator.validateNamedCountryExists, CountryValidator.validateIfCountryNameIsTaken, countriesController_1.default.updateCountry);
countryRouter.delete('/countries', mainValidator('deleteDepartmentOrCountry', { params: false, body: true, query: false }), countriesController_1.default.deleteCountry);
countryRouter.get('/countries', GeneralValidator.validateQueryParams, countriesController_1.default.getAllCountries);
exports.default = countryRouter;
//# sourceMappingURL=index.js.map