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
const cab_service_1 = require("../cab.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
const cab_service_2 = require("../__mocks__/cab.service");
const cabsMocks_1 = __importDefault(require("../__mocks__/cabsMocks"));
describe(cab_service_1.CabService, () => {
    let cabService;
    const updated = {
        regNumber: 'KCA 545',
        capacity: 1,
        id: 0,
        model: 'Toyota',
        providerId: 3,
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        cabService = new cab_service_1.CabService(cab_service_2.mockCabRepo);
    }));
    beforeEach(() => {
        jest.spyOn(logger_1.mockLogger, 'log');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(cab_service_1.CabService.prototype.findOrCreateCab, () => {
        it("return newly created cab if it doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const newCab = cabsMocks_1.default.payload;
            const { cab } = yield cabService.findOrCreateCab(newCab.regNumber, newCab.capacity, newCab.model, newCab.providerId);
            expect(cab).toMatchObject(newCab);
        }));
    });
    describe(cab_service_1.CabService.prototype.updateCab, () => {
        it('should update cab details successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cabService.findOrCreateCab('KCA 545', 1, 'Limo', 3);
            const updateCab = { model: 'Toyota' };
            const newCab = yield cabService.updateCab(0, updateCab);
            expect(newCab).toEqual(updated);
        }));
        it('should return not found message if cab doesnot exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cabService.updateCab(8, { driverName: 'Muhwezi Dee' });
            expect(result).toEqual({ message: 'Update Failed. Cab does not exist' });
        }));
    });
    describe(cab_service_1.CabService.prototype.getById, () => {
        it('should return cab data successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const foundCab = yield cabService.findById(0);
            expect(foundCab).toMatchObject(updated);
        }));
    });
    describe(cab_service_1.CabService.prototype.findByRegNumber, () => {
        it('should return cab details from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const cabDetails = yield cabService.findByRegNumber(cabsMocks_1.default.payload.regNumber);
            expect(cabDetails).toMatchObject(updated);
        }));
    });
    describe(cab_service_1.CabService.prototype.getCabs, () => {
        beforeAll(() => {
            cabsMocks_1.default.cabs.map((cab) => __awaiter(void 0, void 0, void 0, function* () {
                yield cabService.findOrCreateCab(cab.regNumber, cab.providerId, cab.model, cab.capacity);
            }));
        });
        it('should return array of cabs from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cabService.getCabs();
            expect(result.pageMeta.pageNo).toBe(1);
            expect(result.data.length).toEqual(7);
            expect(result.pageMeta.totalPages).toBe(1);
        }));
        it('total items per page should be 2 when size provided is 2', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageable = { page: 2, size: 1 };
            const result = yield cabService.getCabs(pageable);
            expect(result.pageMeta.pageNo).toBe(2);
            expect(result.pageMeta.itemsPerPage).toBe(1);
            expect(result).toEqual(expect.objectContaining({
                data: expect.arrayContaining([]),
                pageMeta: expect.objectContaining({
                    itemsPerPage: expect.any(Number),
                }),
            }));
        }));
        it('pageNo should be 3 when the third page is requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageable = { page: 3, size: 2 };
            const result = yield cabService.getCabs(pageable);
            expect(result.pageMeta.pageNo).toBe(3);
            expect(result.pageMeta.itemsPerPage).toBe(2);
            expect(result).toEqual(expect.objectContaining({
                data: expect.arrayContaining([]),
                pageMeta: expect.objectContaining({
                    itemsPerPage: expect.any(Number),
                }),
            }));
        }));
    });
    describe(cab_service_1.CabService.prototype.deleteCab, () => {
        it('should delete a cab successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cabService.deleteCab(0);
            expect(result).toEqual([1]);
        }));
        it('should return zero for unexisting data', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cabService.deleteCab(40);
            expect(result).toEqual([0]);
        }));
    });
});
//# sourceMappingURL=cab.service.spec.js.map