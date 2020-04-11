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
const database_1 = require("../../database");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const base_service_1 = require("../shared/base.service");
const location_1 = __importDefault(require("../../database/models/location"));
class LocationService extends base_service_1.BaseService {
    findLocation(longitude, latitude, raiseError = false, includeAddress = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let include;
                if (includeAddress) {
                    include = ['address'];
                }
                const location = yield this.findOneByProp({ prop: database_1.Op.and, value: [{ latitude }, { longitude }] }, include);
                if (raiseError) {
                    errorHandler_1.default.throwErrorIfNull(location, 'Location not found');
                }
                return location;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.throwErrorIfNull(null, 'Could not find location record', 500);
            }
        });
    }
    createLocation(longitude, latitude) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [newlocation, created] = yield this.model.findOrCreate({
                    where: { longitude, latitude },
                    defaults: { longitude, latitude },
                });
                return newlocation.get();
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    getLocationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attributes = ['latitude', 'longitude'];
                const location = yield this.findById(parseInt(id, 10), [], attributes);
                return location;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
const locationService = new LocationService(location_1.default);
exports.default = locationService;
//# sourceMappingURL=location.service.js.map