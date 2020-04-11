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
const driver_service_1 = __importDefault(require("../driver.service"));
const database_1 = __importDefault(require("../../../database"));
const driver_service_2 = require("../__mocks__/driver.service");
describe('Driver Service', () => {
    let testDriver;
    let providerId;
    beforeAll(() => {
        providerId = 1;
        testDriver = {
            providerId,
            driverName: 'Muhwezi Deo2',
            driverPhoneNo: '070533111166',
            driverNumber: 'UB5422424344',
        };
    });
    describe('Test DriverCreatioon', () => {
        it('should create driver successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield driver_service_2.mockDriverService.create(testDriver);
            expect(driver).toBeDefined();
            expect(driver[0].driverName).toEqual('Muhwezi Deo2');
        }));
        it('should create second driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield driver_service_2.mockDriverService.create({
                driverName: 'mike',
                driverNumber: 'adbjhsbdjk',
                driverPhoneNo: '0789888652',
            });
            expect(driver[0].driverName).toEqual('mike');
        }));
        it('should return not create driver if driverNumber exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const drivers = yield driver_service_2.mockDriverService.getDrivers();
            const driver = yield driver_service_2.mockDriverService.create(testDriver);
            expect(drivers.data.length).toEqual(2);
            expect(driver[0].driverName).toEqual('Muhwezi Deo2');
        }));
    });
    describe('getProviders', () => {
        it('returns a list of drivers', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield driver_service_2.mockDriverService.getDrivers({ page: 2, size: 10 }, {});
            expect(result.data[0]).toHaveProperty('driverName', 'Muhwezi Deo2');
            expect(result.data[1]).toHaveProperty('driverName', 'mike');
            expect(result.data.length).toEqual(2);
            expect(result).toHaveProperty('pageMeta');
        }));
    });
    describe('TestDriverUpdate', () => {
        it('Should return an error if driver does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield driver_service_2.mockDriverService.driverUpdate(10, null);
            expect(result).toEqual({ message: 'Update Failed. Driver does not exist' });
        }));
        it('should update a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield driver_service_2.mockDriverService.driverUpdate(1, { driverName: 'peter' });
            expect(result).toHaveProperty('driverName', 'peter');
        }));
        it('should check if a driver already exists when updating', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.default, 'query').mockResolvedValue([[{ count: true }]]);
            const driverExists = yield driver_service_1.default.exists('deo@andela.com', '891293', '123123', 1);
            expect(driverExists).toBe(true);
        }));
    });
    describe('Test getDriverByID', () => {
        it('should get driver by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield driver_service_2.mockDriverService.getDriverById(1);
            expect(driver).toHaveProperty('driverName', 'peter');
        }));
    });
    describe('Test exists()', () => {
        it('should check if a driver already exists when adding a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.default, 'query').mockResolvedValue([[{ count: true }]]);
            const driverExists = yield driver_service_1.default.exists('deo@andela.com', '891293', '123123', 1);
            expect(driverExists).toBe(true);
        }));
    });
    describe('Delete Driver', () => {
        it('Should delete driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const drivers = yield driver_service_2.mockDriverService.getDrivers();
            const result = yield driver_service_2.mockDriverService.deleteDriver({ id: 0 });
            const newDrivers = yield driver_service_2.mockDriverService.getDrivers();
            expect(result).toEqual([1]);
            expect(drivers.data.length - newDrivers.data.length).toEqual(1);
        }));
        it('Should return correct response if failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const drivers = yield driver_service_2.mockDriverService.getDrivers();
            const result = yield driver_service_2.mockDriverService.deleteDriver({ id: 10 });
            const newDrivers = yield driver_service_2.mockDriverService.getDrivers();
            expect(result).toEqual([0]);
            expect(drivers.data.length).toEqual(newDrivers.data.length);
        }));
    });
    describe('Test findOneDriver()', () => {
        it('Should findOne driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const options = { where: { id: 1 } };
            const result = yield driver_service_2.mockDriverService.findOneDriver(options);
            expect(result.get()).toHaveProperty('driverName', 'peter');
        }));
    });
});
//# sourceMappingURL=driver.service.spec.js.map