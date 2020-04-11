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
const cabsMocks_1 = __importDefault(require("../__mocks__/cabsMocks"));
const cab_controller_1 = require("../cab.controller");
const cab_service_1 = require("../__mocks__/cab.service");
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
describe(cab_controller_1.CabsController, () => {
    let cabController;
    beforeAll(() => {
        cabController = new cab_controller_1.CabsController(cab_service_1.mockCabService);
    });
    const res = { code: null, body: null };
    res.status = (status) => {
        if (status) {
            res.code = status;
            return {
                send: (object) => res.body = object,
                json: (object) => res.body = object,
            };
        }
        return res.code;
    };
    let req = {
        body: {
            regNumber: cabsMocks_1.default.payload.regNumber,
            model: cabsMocks_1.default.payload.model,
            capacity: cabsMocks_1.default.payload.capacity,
            providerId: cabsMocks_1.default.payload.providerId,
        },
    };
    describe(cab_controller_1.CabsController.prototype.createCab, () => {
        it('should return success true', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cabController.createCab(req, res);
            expect(res.status()).toBe(201);
            expect(res.body.message).toBe('You have successfully created a cab');
            expect(res.body.success).toBe(true);
            expect(res.body.cab).toEqual(expect.objectContaining({
                regNumber: 'KCA 545',
                capacity: 1,
                model: 'Limo',
            }));
        }));
        it('should return success false if there is a conflict', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cabController.createCab(req, res);
            expect(res.status()).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Cab with registration number already exists');
        }));
        it('should catch any server error', () => __awaiter(void 0, void 0, void 0, function* () {
            req = {
                boddy: [],
            };
            yield cabController.createCab(req, res);
            expect(res.status()).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Oops! Something went terribly wrong');
        }));
    });
    describe(cab_controller_1.CabsController.prototype.getAllCabs, () => {
        it('should return the first page of cabs by default', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { query: {} };
            yield cabController.getAllCabs(req, res);
            expect(res.body.message).toBe('1 of 1 page(s).');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('pageMeta');
            expect(res.body.data).toHaveProperty('data');
        }));
        it('pagination should work as expected', () => __awaiter(void 0, void 0, void 0, function* () {
            const requests = cabsMocks_1.default.cabs.map((c) => Object.assign({ body: c }));
            requests.forEach((request) => __awaiter(void 0, void 0, void 0, function* () { return yield cabController.createCab(request, res); }));
            req = { query: { page: 2, size: 2 } };
            yield cabController.getAllCabs(req, res);
            const { body } = res;
            expect(body.data.pageMeta).toEqual({
                itemsPerPage: 2,
                pageNo: 2,
                totalItems: 7,
                totalPages: 4,
            });
        }));
        it('should handle internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            req = {};
            yield cabController.updateCabDetails(req, res);
            expect(res.status()).toBe(500);
            expect(res.body.message).toBe('Oops! Something went terribly wrong');
        }));
    });
    describe(cab_controller_1.CabsController.prototype.updateCabDetails, () => {
        let updateReq = {
            params: { id: -1 },
            body: { regNumber: 'KCA 545' },
        };
        it('should return 409 if there is a conflict', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cabController.updateCabDetails(updateReq, res);
            expect(res.status()).toBe(409);
            expect(res.body.message).toBe('Cab with registration number already exists');
        }));
        it('should update cab details successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            updateReq = {
                params: { id: 0 },
                body: {
                    regNumber: 'KCA 545',
                    model: cabsMocks_1.default.updateData.model,
                    capacity: cabsMocks_1.default.updateData.capacity,
                },
            };
            yield cabController.updateCabDetails(updateReq, res);
            expect(res.status()).toBe(200);
            expect(res.body.data.regNumber).toEqual(cabsMocks_1.default.updateData.regNumber);
            expect(res.body.message).toBe('Cab details updated successfully');
        }));
        it('should return 404 if cab not found', () => __awaiter(void 0, void 0, void 0, function* () {
            updateReq = {
                params: { id: 67 },
                body: { regNumber: 'KCA 546 M' },
            };
            yield cabController.updateCabDetails(updateReq, res);
            expect(res.status()).toBe(404);
            expect(res.body.message).toEqual('Update Failed. Cab does not exist');
        }));
        it('should handle internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            updateReq = {};
            yield cabController.updateCabDetails(updateReq, res);
            expect(res.status()).toBe(500);
            expect(res.body.message).toBe('Oops! Something went terribly wrong');
        }));
    });
    describe(cab_controller_1.CabsController.prototype.deleteCab, () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'findActiveRouteWithDriverOrCabId').mockImplementationOnce(() => ([]));
            yield cabController.createCab(req, res);
        }));
        it('should delete a cab successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            req = {
                params: { id: 0 },
                body: {
                    slackUrl: 'segun-andela.slack.com',
                },
            };
            yield cabController.deleteCab(req, res);
            expect(res.status()).toBe(200);
            expect(res.body.message).toBe('Cab successfully deleted');
            expect(res.body.success).toBe(true);
        }));
        it('should return cab does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            req = {
                params: { id: 10 },
                body: {
                    slackUrl: 'segun-andela.slack.com',
                },
            };
            yield cabController.deleteCab(req, res);
            expect(res.status()).toBe(404);
            expect(res.body.message).toBe('Cab does not exist');
        }));
        it('should return server error', () => __awaiter(void 0, void 0, void 0, function* () {
            req = {
                param: { id: 10 },
                body: {
                    slackUrl: 'segun-andela.slack.com',
                },
            };
            yield cabController.deleteCab(req, res);
            expect(res.status()).toBe(500);
            expect(res.body.message).toBe('Server Error. Could not complete the request');
        }));
    });
});
//# sourceMappingURL=cab.controller.spec.js.map