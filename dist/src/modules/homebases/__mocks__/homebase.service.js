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
const __mocks__1 = require("../../../database/__mocks__");
const database_1 = require("../../../database");
const homebase_service_1 = __importDefault(require("../homebase.service"));
const sequelize_1 = require("sequelize");
class MockHomeBaseRepository extends __mocks__1.MockRepository {
    constructor(homebases = []) {
        super(database_1.Homebase, homebases);
    }
    findOrCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const where = options.where;
                    const targetHomebase = where['name'][sequelize_1.Op.iLike] || '';
                    const existing = this.data
                        .find((a) => a.name.includes(targetHomebase.replace(/[\$%]/, '')));
                    if (existing) {
                        resolve([this.wrapInModel(existing), false]);
                    }
                    const newBase = yield this.create(options.defaults);
                    resolve([this.wrapInModel(newBase), true]);
                }
                catch (err) {
                    reject(new Error('error creating new requests'));
                }
            }));
        });
    }
}
exports.MockHomeBaseRepository = MockHomeBaseRepository;
exports.mockHomeBaseRepository = new MockHomeBaseRepository();
exports.mockHomeBaseService = new homebase_service_1.default(exports.mockHomeBaseRepository);
//# sourceMappingURL=homebase.service.js.map