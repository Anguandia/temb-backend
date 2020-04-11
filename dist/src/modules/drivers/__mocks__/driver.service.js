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
const database_1 = require("../../../database");
const __mocks__1 = require("../../../database/__mocks__");
const sequelize_1 = require("sequelize");
const driver_service_1 = __importDefault(require("../driver.service"));
class MockDriverRepositoy extends __mocks__1.MockRepository {
    constructor(drivers = []) {
        super(database_1.Driver, drivers);
    }
    findOrCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const where = options.where;
                    const testNumber = where['driverNumber'][sequelize_1.Op.like];
                    const existing = yield this.data.find((driver) => driver.driverNumber.includes(testNumber.replace(/[\$%]/g, '')));
                    if (existing) {
                        return resolve([existing, false]);
                    }
                    const newDriver = yield this.create(options.defaults);
                    resolve([newDriver, true]);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    destroy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const driverId = options.where['id'];
                const driverIndex = this.data.findIndex((a) => a.id === driverId);
                if (driverIndex !== -1) {
                    this.data.splice(driverIndex, 1);
                    return Promise.resolve([1]);
                }
                return Promise.resolve([0]);
            }
            catch (error) {
                Promise.reject(error);
            }
        });
    }
}
exports.default = MockDriverRepositoy;
exports.mockDriverRespository = new MockDriverRepositoy();
exports.mockDriverService = new driver_service_1.default(exports.mockDriverRespository);
//# sourceMappingURL=driver.service.js.map