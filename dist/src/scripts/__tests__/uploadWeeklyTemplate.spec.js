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
const uploadWeeklyTemplate_1 = __importDefault(require("../uploadWeeklyTemplate"));
describe('UploadWeeklyTemplate', () => {
    let upload;
    beforeEach(() => {
        upload = new uploadWeeklyTemplate_1.default();
        upload.client.post = (link, info) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve, reject) => resolve('Template stored.'));
        });
    });
    it('should upload weekly Template', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(console, 'log');
        yield upload.pushTemplate();
        expect(upload.client).toBeDefined();
        expect(console.log).toHaveBeenCalledWith('Template stored.');
    }));
});
//# sourceMappingURL=uploadWeeklyTemplate.spec.js.map