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
const location_service_1 = __importDefault(require("../location.service"));
const location_1 = __importDefault(require("../../../database/models/location"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
describe('locationservice', () => {
    let findLocationSpy;
    let findOrCreateLocationSpy;
    const mockLocationData = {
        get: (plainProp = { plain: false }) => {
            if (plainProp.plain) {
                return { id: 1, longitude: -1.2345, latitude: 1.5673 };
            }
        },
    };
    beforeEach(() => {
        findLocationSpy = jest.spyOn(location_1.default, 'findOne');
        findOrCreateLocationSpy = jest.spyOn(location_1.default, 'findOrCreate');
    });
    describe('findLocation', () => {
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            findLocationSpy.mockRejectedValue(new Error('Error'));
            try {
                yield location_service_1.default.findLocation(1, 1, true, true);
            }
            catch (error) {
                expect(error.message).toBe('Could not find location record');
            }
        }));
        it('should find location', () => __awaiter(void 0, void 0, void 0, function* () {
            findLocationSpy.mockResolvedValue(mockLocationData);
            const result = yield location_service_1.default.findLocation(1, 1, true, true);
            expect(result).toEqual(mockLocationData.get({ plain: true }));
            expect(location_1.default.findOne).toHaveBeenCalled();
        }));
    });
    describe('createLocation', () => {
        const mockReturnedValue = { dataValues: mockLocationData };
        it('should create a new loaction', () => __awaiter(void 0, void 0, void 0, function* () {
            findOrCreateLocationSpy.mockResolvedValue([mockReturnedValue]);
            yield location_service_1.default.createLocation(mockLocationData.get({ plain: true }).longitude, mockLocationData.get({ plain: true }).latitude);
            expect(location_1.default.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
        }));
        it('should throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            findOrCreateLocationSpy.mockRejectedValue(new Error('Error Message'));
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield location_service_1.default.createLocation(mockLocationData.get({ plain: true }).longitude, null);
            expect(location_1.default.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
        }));
    });
});
//# sourceMappingURL=locationService.spec.js.map