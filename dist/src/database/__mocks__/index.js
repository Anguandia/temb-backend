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
const sequelize_typescript_1 = require("sequelize-typescript");
const path_1 = __importDefault(require("path"));
const modelPaths = path_1.default.join(__dirname, '../models');
const database = new sequelize_typescript_1.Sequelize({
    models: [modelPaths],
});
class MockRepository {
    constructor(model, initialData = []) {
        this.model = database.getRepository(model);
        this.data = initialData;
    }
    wrapInModel(value) {
        return Object.assign(Object.assign({}, value), { get: () => value, getDataValue: () => value });
    }
    findByPk(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkField = this.model.primaryKeyAttribute;
            const result = this.data.find((m) => m[pkField] === identifier);
            return Promise.resolve(this.wrapInModel(result));
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = this.data;
            return Promise.resolve(this.wrapInModel(result));
        });
    }
}
exports.MockRepository = MockRepository;
exports.default = database;
//# sourceMappingURL=index.js.map