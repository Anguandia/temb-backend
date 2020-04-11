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
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const locationController_1 = __importDefault(require("../locationController"));
const location_service_1 = __importDefault(require("../location.service"));
const __mocks__1 = require("../../../services/__mocks__");
describe('Test locationController', () => {
    const res = {
        status() {
            return this;
        },
        json() {
            return this;
        }
    };
    errorHandler_1.default.sendErrorResponse = jest.fn();
    bugsnagHelper_1.default.log = jest.fn();
    beforeEach(() => {
        jest.spyOn(res, 'status');
        jest.spyOn(res, 'json');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('test getLocation', () => {
        const newReq = {
            params: {
                id: 1
            }
        };
        const { params: { id } } = newReq;
        let getLocationSpy;
        beforeEach(() => {
            getLocationSpy = jest.spyOn(location_service_1.default, 'getLocationById');
        });
        it('returns a single location', () => __awaiter(void 0, void 0, void 0, function* () {
            getLocationSpy.mockResolvedValue(__mocks__1.mockLocation);
            yield locationController_1.default.getLocation(newReq, res);
            expect(location_service_1.default.getLocationById).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
});
//# sourceMappingURL=locationController.spec.js.map