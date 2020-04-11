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
const DriverController_1 = __importDefault(require("../DriverController"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const driver_service_1 = require("../__mocks__/driver.service");
const ProviderService_1 = __importDefault(require("../../../services/ProviderService"));
const logger_1 = require("../../shared/logging/__mocks__/logger");
const __mocks__1 = require("../__mocks__");
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
const providersController_mock_1 = require("../../slack/RouteManagement/__mocks__/providersController.mock");
describe('driverController', () => {
    logger_1.mockLogger.log = jest.fn();
    let createDriverSpy;
    let updateDriverSpy;
    let driverController;
    let res;
    responseHelper_1.default.sendResponse = jest.fn();
    beforeAll(() => {
        driverController = new DriverController_1.default(driver_service_1.mockDriverService, logger_1.mockLogger);
    });
    beforeEach(() => {
        createDriverSpy = jest.spyOn(driver_service_1.mockDriverService, 'create');
        res = {
            status: jest.fn(() => ({
                json: jest.fn(() => { }),
            })),
        };
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('DriverController_addDriver', () => {
        it('should create driver successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(ProviderService_1.default, 'findByPk').mockReturnValue({});
            createDriverSpy.mockReturnValue(__mocks__1.mockData);
            yield driverController.addProviderDriver(__mocks__1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 201, true, 'Driver added successfully', __mocks__1.expected);
        }));
        it('should return errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            createDriverSpy.mockReturnValue({
                errors: [{ message: 'driverPhoneNo must be unique' }],
            });
            yield driverController.addProviderDriver({}, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 400, false, 'driverPhoneNo must be unique');
        }));
        it('should return error if a driver with a number exists', () => __awaiter(void 0, void 0, void 0, function* () {
            createDriverSpy.mockReturnValue(__mocks__1.existingUserMock);
            yield driverController.addProviderDriver(__mocks__1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 409, false, `Driver with  driver Number ${__mocks__1.createReq.body.driverNumber} already exists`);
        }));
        it('should throw an error if creating a driver fails', () => __awaiter(void 0, void 0, void 0, function* () {
            createDriverSpy.mockRejectedValue('Something went wrong');
            yield driverController.addProviderDriver(__mocks__1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 500, false, 'An error occurred in the creation of the driver');
        }));
    });
    describe('Update driver', () => {
        beforeEach(() => {
            updateDriverSpy = jest.spyOn(driver_service_1.mockDriverService, 'driverUpdate');
            Object.assign(__mocks__1.createReq, { params: { driverId: 1 } });
        });
        it('update a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            updateDriverSpy.mockResolvedValue({});
            yield driverController.update(__mocks__1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 200, true, 'Driver updated successfully', {});
        }));
        it('should respond with an error if the driver does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            updateDriverSpy.mockResolvedValue({ message: 'Update Failed. Driver does not exist' });
            yield driverController.update(__mocks__1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, 'Update Failed. Driver does not exist');
        }));
        it('should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(logger_1.mockLogger, 'log');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            const errorMessage = 'could not update the driver details';
            updateDriverSpy.mockRejectedValue(errorMessage);
            yield driverController.update(__mocks__1.createReq, res);
            expect(logger_1.mockLogger.log).toHaveBeenCalledWith(errorMessage);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith(errorMessage, res);
        }));
    });
    describe('driverController.deleteDriver', () => {
        it('should successfully delete a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = { dataValues: { id: 2, providerId: 1 } };
            const req = { body: { slackUrl: 'adaeze-tembea.slack.com' } };
            res.locals = { driver };
            jest.spyOn(routeBatch_service_1.routeBatchService, 'findActiveRouteWithDriverOrCabId').mockResolvedValue([providersController_mock_1.route]);
            jest.spyOn(driver_service_1.mockDriverService, 'deleteDriver').mockResolvedValue(1);
            yield driverController.deleteDriver(req, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
        }));
    });
    describe('DriversController_getAllDrivers', () => {
        let req;
        beforeEach(() => {
            req = { query: { page: 1, size: 3 } };
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { }),
                })),
            };
            jest.spyOn(driver_service_1.mockDriverService, 'findAll').mockResolvedValue(__mocks__1.payloadData.findAllMock);
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('Should get all drivers and return a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { successMessage, returnedData: { data, pageMeta }, } = __mocks__1.payloadData;
            req.query.providerId = 1;
            jest.spyOn(responseHelper_1.default, 'sendResponse');
            jest.spyOn(driver_service_1.mockDriverService, 'getDrivers').mockReturnValue({ data, pageMeta });
            yield driverController.getDrivers(req, res);
            expect(driver_service_1.mockDriverService.getDrivers).toBeCalledWith({ page: 1, size: 3 }, { providerId: 1 });
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 200, true, successMessage, { data, pageMeta });
        }));
        it('Should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            jest.spyOn(driver_service_1.mockDriverService, 'getDrivers')
                .mockRejectedValue(error);
            jest.spyOn(logger_1.mockLogger, 'log');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield driverController.getDrivers(req, res);
            expect(logger_1.mockLogger.log).toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledWith(error, res);
        }));
    });
});
//# sourceMappingURL=driver.controller.spec.js.map