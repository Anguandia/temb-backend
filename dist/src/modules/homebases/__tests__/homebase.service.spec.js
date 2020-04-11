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
const faker_1 = __importDefault(require("faker"));
const database_1 = __importDefault(require("../../../database"));
const __mocks__1 = require("../__mocks__");
const user_service_1 = __importDefault(require("../../users/user.service"));
const helpers_1 = require("../../../../integrations/support/helpers");
const homebase_1 = __importDefault(require("../../../database/models/homebase"));
const homeBase_service_1 = require("../__mocks__/homeBase.service");
const address_service_1 = require("../../addresses/address.service");
jest.mock('../../../helpers/sequelizePaginationHelper', () => jest.fn());
const { models: { Country } } = database_1.default;
describe('test HomebaseService', () => {
    const homebaseDetails = {
        id: 0,
        name: 'Nairobi',
        addressId: 1,
        channel: 'UO23D'
    };
    const homebaseMock = [
        [{
                get: () => (homebaseDetails),
            }],
        [{
                get: ({ plain }) => {
                    if (plain)
                        return homebaseDetails;
                },
            }],
    ];
    const filterParams = {
        country: 'kenya',
        name: 'NairobI',
    };
    const where = {
        country: 'Kenya',
    };
    beforeEach(() => {
        jest.spyOn(homeBase_service_1.mockHomeBaseService, 'formatName');
        jest.spyOn(homeBase_service_1.mockHomeBaseService, 'createFilter');
        jest.spyOn(homeBase_service_1.mockHomeBaseService, 'getAllHomebases');
        jest.spyOn(homeBase_service_1.mockHomeBaseService, 'getHomeBaseBySlackId');
        jest.spyOn(address_service_1.addressService, 'findOrCreateAddress').mockReturnValue({
            id: 1,
            latitude: 53,
            longitude: 23,
        });
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it.only('creates a homebase successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const testData = {
            name: 'Nairobi',
            channel: 'UO23D',
            address: {
                address: 'nairobi',
                location: {
                    longitude: 23, latitude: 53,
                },
            },
            countryId: 1,
            currency: 'KES',
        };
        const result = yield homeBase_service_1.mockHomeBaseService.createHomebase(testData);
        expect(homeBase_service_1.mockHomeBaseService.formatName).toHaveBeenCalledWith(testData.name);
        expect(result.homebase).toEqual(expect.objectContaining(__mocks__1.mockCreatedHomebase.homebase));
    }));
    it.only('createFilter', () => {
        const res = homeBase_service_1.mockHomeBaseService.createFilter(where);
        expect(Object.keys(res).length).toEqual(2);
        expect(res).toHaveProperty('where');
        expect(res).toHaveProperty('include');
    });
    it.only('formatName', () => {
        const res = homeBase_service_1.mockHomeBaseService.formatName('naIRoBi');
        expect(res).toEqual('Nairobi');
    });
    it.only('whereClause', () => {
        const res = homeBase_service_1.mockHomeBaseService.getWhereClause(filterParams);
        expect(homeBase_service_1.mockHomeBaseService.formatName).toHaveBeenCalledTimes(2);
        expect(res).toEqual({
            country: 'Kenya', name: 'Nairobi',
        });
    });
    it('getHomebases', () => __awaiter(void 0, void 0, void 0, function* () {
        const pageable = {
            page: 1,
            size: 10,
        };
        const homebases = yield homeBase_service_1.mockHomeBaseService.getHomebases(pageable);
        expect(homebases.homebases.length).toBe(1);
        expect(homebases.homebases[0]).toHaveProperty('channel', 'UO23D');
        expect(homeBase_service_1.mockHomeBaseService.createFilter).toHaveBeenCalledWith({});
    }));
    it.only('should get all Homebases', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homeBase_service_1.mockHomeBaseService, 'findAll');
        const homebases = yield homeBase_service_1.mockHomeBaseService.getAllHomebases();
        expect(homeBase_service_1.mockHomeBaseService.findAll).toBeCalledWith({
            attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency'],
            include: [],
            order: [['name', 'ASC']],
        });
        expect(homebases).toEqual([homebaseMock[1][0].get({ plain: true })]);
    }));
    it('should get all Homebases with foreignKey', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_1.default, 'findAll').mockResolvedValue(homebaseMock[1]);
        yield homeBase_service_1.mockHomeBaseService.getAllHomebases(true);
        expect(homebase_1.default.findAll).toBeCalledWith({
            attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency'],
            include: [{ as: 'country', attributes: ['name'], model: Country }],
            order: [['name', 'ASC']],
        });
    }));
    it('should get homebase by User slack ID', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
        jest.spyOn(homebase_1.default, 'findByPk').mockResolvedValue(homebaseMock[1][0]);
        const homebase = yield homeBase_service_1.mockHomeBaseService.getHomeBaseBySlackId('1');
        expect(homebase_1.default.findByPk).toBeCalled();
        expect(homebase).toEqual(homebaseMock[1][0].get({ plain: true }));
    }));
    it('should get homebase by User slack ID with foreignKey', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
        jest.spyOn(homebase_1.default, 'findByPk').mockResolvedValue(homebaseMock[1][0]);
        const homebase = yield homeBase_service_1.mockHomeBaseService.getHomeBaseBySlackId('1', true);
        expect(homebase_1.default.findByPk).toBeCalled();
        expect(homebase_1.default.findByPk).toBeCalledWith(1, {
            attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency'],
            include: [{ as: 'country', attributes: ['name'], model: Country }],
        });
        expect(homebase).toEqual(homebaseMock[1][0].get({ plain: true }));
    }));
    it('should get homebase by Slack Channel ID', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_1.default, 'findOne').mockResolvedValue(homebaseMock[1][0]);
        const result = yield homeBase_service_1.mockHomeBaseService.findHomeBaseByChannelId('CELT35X40');
        expect(homebase_1.default.findOne).toBeCalled();
        expect(result).toEqual(homebaseMock[1][0].get({ plain: true }));
    }));
});
describe('update HomeBase', () => {
    let mockHomeBase;
    const testAddress = {
        address: faker_1.default.address.county(),
        location: {
            longitude: 123,
            latitude: 86,
        },
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mockCountry = yield helpers_1.createCountry({ name: faker_1.default.address.country().concat('z') });
        mockHomeBase = yield homeBase_service_1.mockHomeBaseService.createHomebase({
            name: faker_1.default.address.city().concat('z'),
            channel: 'U123K',
            countryId: mockCountry.id,
            address: testAddress,
            currency: 'NGN',
        });
        yield homeBase_service_1.mockHomeBaseService.createHomebase({
            name: 'Duplicatetest',
            channel: 'U123K',
            countryId: mockCountry.id,
            address: testAddress,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.default.close();
    }));
    it('should update the homebase', () => __awaiter(void 0, void 0, void 0, function* () {
        const { homebase: { id, countryId, currency } } = mockHomeBase;
        const homeBaseName = faker_1.default.address.county().concat('t');
        const result = yield homeBase_service_1.mockHomeBaseService.updateDetails(homeBaseName, id, 'U08ETD', countryId, testAddress, currency);
        expect(result.name).toBe(homeBaseName);
    }));
    it('should filter the homebase', () => __awaiter(void 0, void 0, void 0, function* () {
        const filtered = homeBase_service_1.mockHomeBaseService.filterHomebase({ name: 'name' }, [{ name: 'name' }, { name: 'name 1' }]);
        expect(filtered).toEqual([{ name: 'name 1' }]);
    }));
    it('should filte the homebase', () => __awaiter(void 0, void 0, void 0, function* () {
        const filtered = homeBase_service_1.mockHomeBaseService.filterHomebase({ name: 'name 1' }, [{ name: 'name' }]);
        expect(filtered).toEqual([{ name: 'name' }]);
    }));
});
//# sourceMappingURL=homebase.service.spec.js.map