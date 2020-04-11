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
const sequelizePaginationHelper_1 = __importDefault(require("../../helpers/sequelizePaginationHelper"));
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const ProviderService_1 = __importDefault(require("../ProviderService"));
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
const __mocks__1 = require("../__mocks__");
const database_1 = __importDefault(require("../../database"));
const Notifications_1 = __importDefault(require("../../modules/slack/SlackPrompts/Notifications"));
const mockInformation_1 = require("../../modules/providers/notifications/__mocks__/mockInformation");
const { models: { Provider } } = database_1.default;
jest.mock('../../helpers/sequelizePaginationHelper', () => jest.fn());
describe(ProviderService_1.default, () => {
    describe(ProviderService_1.default.getProviders, () => {
        beforeEach(() => {
            sequelizePaginationHelper_1.default.mockClear();
            providerHelper_1.default.serializeDetails = jest.fn();
        });
        it('returns a list of providers', () => __awaiter(void 0, void 0, void 0, function* () {
            const getPageItems = jest.fn()
                .mockResolvedValue(__mocks__1.mockGetCabsData);
            sequelizePaginationHelper_1.default.mockImplementation(() => ({
                getPageItems
            }));
            yield ProviderService_1.default.getProviders({
                page: 1,
                size: 10,
            });
            expect(sequelizePaginationHelper_1.default).toHaveBeenCalled();
            expect(getPageItems).toHaveBeenCalledWith(1);
            expect(providerHelper_1.default.serializeDetails).toHaveBeenCalled();
        }));
        it('returns a list of providers when the page able parameter is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const getPageItems = jest.fn()
                .mockResolvedValue(__mocks__1.mockGetCabsData);
            sequelizePaginationHelper_1.default.mockImplementation(() => ({
                getPageItems
            }));
            yield ProviderService_1.default.getProviders();
            expect(sequelizePaginationHelper_1.default).toHaveBeenCalled();
            expect(getPageItems).toHaveBeenCalledWith(1);
            expect(providerHelper_1.default.serializeDetails).toHaveBeenCalled();
        }));
        it('returns a list of providers when page <= totalPages', () => __awaiter(void 0, void 0, void 0, function* () {
            const getPageItems = jest.fn()
                .mockResolvedValue(__mocks__1.mockGetCabsData);
            sequelizePaginationHelper_1.default.mockImplementation(() => ({
                getPageItems
            }));
            yield ProviderService_1.default.getProviders({
                page: 2,
                size: 10,
            });
            expect(sequelizePaginationHelper_1.default).toHaveBeenCalled();
            expect(getPageItems).toHaveBeenCalledWith(2);
        }));
    });
    describe(ProviderService_1.default.createProvider, () => {
        beforeEach(() => {
            jest.spyOn(Provider, 'create').mockResolvedValue(__mocks__1.mockCreatedProvider[0]);
        });
        it('test createProvider', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ProviderService_1.default.createProvider({
                name: 'Uber Kenya', providerUserId: 3
            });
            expect(Provider.create).toHaveBeenCalled();
            expect(result).toEqual(__mocks__1.mockCreatedProvider[0].get());
        }));
    });
    describe(ProviderService_1.default.deleteProvider, () => {
        beforeAll(() => {
            jest.spyOn(Provider, 'destroy').mockResolvedValue(1);
        });
        it('should delete a provider successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ProviderService_1.default.deleteProvider(1);
            expect(result).toEqual(1);
        }));
        it('should return zero for unexisting data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'destroy').mockResolvedValue(0);
            const result = yield ProviderService_1.default.deleteProvider(1);
            expect(result).toEqual(0);
        }));
    });
    describe(ProviderService_1.default.updateProvider, () => {
        it('should update provider details successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = [1, [{ name: 'Uber Uganda' }]];
            jest.spyOn(user_service_1.default, 'getUserByEmail')
                .mockReturnValue({
                dataValues: { id: 1 }
            });
            jest.spyOn(ProviderService_1.default, 'updateProvider').mockReturnValueOnce(mockData);
            const results = yield ProviderService_1.default.updateProvider({ name: 'Uber Uganda' }, 100);
            expect(results[1][0].name)
                .toEqual('Uber Uganda');
        }));
    });
    describe(ProviderService_1.default.findByPk, () => {
        it('should find provider by PK', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = { dataValues: Object.assign({}, __mocks__1.mockProviderRecord) };
            jest.spyOn(Provider, 'findByPk').mockReturnValue(mockResponse);
            const results = yield ProviderService_1.default.findByPk(1, true);
            expect(Provider.findByPk).toHaveBeenCalledWith(expect.any(Number), expect.any(Object));
            expect(results).toEqual(__mocks__1.mockProviderRecord);
        }));
    });
    describe(ProviderService_1.default.findProviderByUserId, () => {
        it('should find provider by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Provider, 'findOne').mockReturnValue(__mocks__1.mockProviderRecord);
            const results = yield ProviderService_1.default.findProviderByUserId(16);
            expect(results).toEqual(__mocks__1.mockProviderRecord);
        }));
    });
    describe(ProviderService_1.default.getViableProviders, () => {
        it('should get viable providers in providers drop down', () => __awaiter(void 0, void 0, void 0, function* () {
            const dummyProviders = [{
                    dataValues: {
                        vehicles: __mocks__1.mockCabsData.cabs, drivers: __mocks__1.mockDriversData
                    }
                }];
            jest.spyOn(Provider, 'findAll').mockResolvedValue(dummyProviders);
            yield ProviderService_1.default.getViableProviders();
            expect(Provider.findAll).toBeCalled();
        }));
    });
    describe(ProviderService_1.default.getProviderBySlackId, () => {
        it('should get provider by slack id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ProviderService_1.default.getProviderBySlackId(3);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id', 'name', 'providerUserId', 'createdAt', 'updatedAt');
        }));
        it('should get provider by slack id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ProviderService_1.default.getProviderBySlackId(1);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id', 'name', 'providerUserId', 'createdAt', 'updatedAt');
        }));
    });
    describe(ProviderService_1.default.getProviderByUserId, () => {
        it('should get provider by slack id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ProviderService_1.default.getProviderByUserId(16);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id', 'name', 'providerUserId', 'createdAt', 'updatedAt', 'deletedAt');
        }));
        it('should get provider by slack id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ProviderService_1.default.getProviderByUserId(2);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id', 'name', 'providerUserId', 'createdAt', 'updatedAt');
        }));
    });
    describe(ProviderService_1.default.notifyTripRequest, () => {
        it('should notify user using Direct message channel', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Notifications_1.default, 'sendNotification').mockResolvedValue(null);
            jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue(null);
            yield ProviderService_1.default.notifyTripRequest(mockInformation_1.mockProviderInformation, mockInformation_1.mockTeamDetailInformation, mockInformation_1.mockInformation.tripDetails);
        }));
    });
});
//# sourceMappingURL=ProviderService.spec.js.map