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
Object.defineProperty(exports, "__esModule", { value: true });
const cab_service_1 = require("../cab.service");
const database_1 = require("../../../database");
const __mocks__1 = require("../../../database/__mocks__");
class MockCab extends __mocks__1.MockRepository {
    constructor(cabs = []) {
        super(database_1.Cab, cabs);
    }
    findOrCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const where = options.where;
                    const regNumber = where['regNumber'];
                    const existing = this.data
                        .find((cab) => cab.regNumber.includes(regNumber.replace(/[\$%]/g, '')));
                    if (existing) {
                        return resolve([this.wrapInModel(existing), false]);
                    }
                    const newCab = yield this.create(options.defaults);
                    resolve([newCab, true]);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    destroy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const [[key, value]] = Object.entries(options.where);
                    const cabIndex = this.data
                        .findIndex((d) => d[key.toString()] === value);
                    if (cabIndex !== -1) {
                        this.data.splice(cabIndex, 1);
                        return resolve([1]);
                    }
                    resolve([0]);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.mockCabRepo = new MockCab();
exports.mockCabService = new cab_service_1.CabService(exports.mockCabRepo);
//# sourceMappingURL=cab.service.js.map