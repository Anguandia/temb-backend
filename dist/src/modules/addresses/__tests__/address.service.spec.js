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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_service_1 = __importStar(require("../address.service"));
const database_1 = require("../../../database");
const location_service_1 = __importDefault(require("../../locations/location.service"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
describe(address_service_1.default, () => {
    let mockAddress;
    beforeEach(() => {
        mockAddress = {
            get: () => ({
                id: 123,
                address: 'gsg45',
            }),
        };
        jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockReturnValue(null);
        jest.spyOn(bugsnagHelper_1.default, 'log');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(address_service_1.default.prototype.createNewAddress, () => {
        it('should create new address', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockLocationModel = {
                longitude: 5677,
                latitude: 908998,
            };
            jest.spyOn(location_service_1.default, 'createLocation')
                .mockResolvedValue(mockLocationModel);
            jest.spyOn(database_1.Address, 'findOrCreate')
                .mockResolvedValue([mockAddress, true]);
            const newRecord = {
                isNewAddress: true,
            };
            const result = yield address_service_1.addressService.createNewAddress(1.0, -1.0, 'Address');
            expect(location_service_1.default.createLocation).toHaveBeenCalledWith(1.0, -1.0);
            expect(database_1.Address.findOrCreate).toHaveBeenCalledTimes(1);
            expect(result).toEqual(Object.assign(Object.assign(Object.assign({}, mockAddress.get()), newRecord), mockLocationModel));
        }));
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(location_service_1.default, 'createLocation')
                .mockRejectedValue('Could not create location');
            jest.spyOn(database_1.Address, 'create')
                .mockResolvedValue(mockAddress);
            yield address_service_1.addressService.createNewAddress(1.0, null, 'Address');
            expect(location_service_1.default.createLocation).toHaveBeenCalledWith(1.0, null);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.throwErrorIfNull)
                .toHaveBeenCalledWith(null, 'Could not create address', 500);
        }));
    });
    describe(address_service_1.default.prototype.updateAddress, () => {
        it('should update address model', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAddressModel = {
                get: () => ({
                    address: 'newAddress',
                    location: { longitude: -1.0, latitude: 1.0 },
                }),
            };
            jest.spyOn(database_1.Address, 'findOne').mockResolvedValue(mockAddressModel);
            jest.spyOn(database_1.Address, 'findByPk').mockResolvedValue(mockAddressModel);
            jest.spyOn(database_1.Address, 'update').mockResolvedValueOnce([, [mockAddressModel]]);
            const updatedAddress = yield address_service_1.addressService.updateAddress('address', -1, 1, 'newAddress');
            expect(updatedAddress.address).toEqual('newAddress');
            expect(updatedAddress.location.latitude).toEqual(1);
            expect(updatedAddress.location.longitude).toEqual(-1);
        }));
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_1.addressService, 'update')
                .mockRejectedValue(null);
            yield address_service_1.addressService.updateAddress('address', -1, 1, 'newAddress');
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.throwErrorIfNull)
                .toHaveBeenCalledWith(null, 'Could not update address record', 500);
        }));
    });
    describe(address_service_1.default.prototype.findAddress, () => {
        it('should find and return address', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = {
                get: (plainProp = { plain: false }) => {
                    if (plainProp.plain) {
                        return { test: 'dummy data' };
                    }
                },
            };
            jest.spyOn(database_1.Address, 'findOne').mockResolvedValue(value);
            const result = yield address_service_1.addressService.findAddress('');
            expect(result).toEqual(value.get({ plain: true }));
        }));
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = { test: 'dummy data' };
            jest.spyOn(database_1.Address, 'findOne').mockRejectedValue(value);
            yield address_service_1.addressService.findAddress('address');
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.throwErrorIfNull)
                .toHaveBeenCalledWith(null, 'Could not find address record', 404);
        }));
        it('should get address when ID is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield address_service_1.addressService.findAddressById(1);
            expect(result.address).toEqual('Andela Nairobi');
        }));
    });
    describe(address_service_1.default.prototype.getAddressesFromDB, () => {
        it('should return all addresses in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = [{
                    get: () => {
                        return { test: 'dummy data' };
                    },
                }];
            jest.spyOn(database_1.Address, 'findAll').mockResolvedValue(value);
            jest.spyOn(database_1.Address, 'count').mockResolvedValue(5);
            const result = yield address_service_1.addressService.getAddressesFromDB(1, 2);
            expect(result.rows)
                .toEqual(value.map((entry) => entry.get()));
        }));
    });
    describe(address_service_1.default.prototype.findOrCreateAddress, () => {
        beforeEach(() => {
            jest.spyOn(database_1.Address, 'findOrCreate').mockImplementation((value) => {
                const id = Math.ceil(Math.random() * 100);
                const newAddress = {
                    get: () => (Object.assign(Object.assign({}, value.defaults), { id })),
                };
                return [newAddress];
            });
            jest.spyOn(location_service_1.default, 'createLocation').mockImplementation((long, lat) => ({
                id: Math.ceil(Math.random() * 100),
                longitude: long,
                latitude: lat,
            }));
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should create a new address with supplied location', () => __awaiter(void 0, void 0, void 0, function* () {
            const testAddress = {
                address: 'Andela, Nairobi',
                location: {
                    longitude: 100,
                    latitude: 180,
                },
            };
            const result = yield address_service_1.addressService.findOrCreateAddress(testAddress.address, testAddress.location);
            expect(result.longitude).toEqual(100);
            expect(result.latitude).toEqual(180);
            expect(result.id).toBeDefined();
        }));
        it('should not create location when location is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const testAddress = {
                address: 'Andela, Nairobi',
            };
            const result = yield address_service_1.addressService.findOrCreateAddress(testAddress.address, '');
            expect(result.id).toBeDefined();
            expect(result.longitude).toBeUndefined();
            expect(location_service_1.default.createLocation).toHaveBeenCalledTimes(0);
        }));
    });
});
describe(address_service_1.default.prototype.findCoordinatesByAddress, () => {
    beforeEach(() => {
        const addressCoords = {
            get: () => ({
                address: 'dummy',
                id: 1,
                location: {
                    id: 1,
                    longitude: 1.2222,
                    latitude: 34.4444,
                },
            }),
        };
        jest.spyOn(database_1.Address, 'findOne').mockResolvedValue(addressCoords);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should get location when address is requested', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield address_service_1.addressService.findCoordinatesByAddress('dummy');
        expect(result.address).toEqual('dummy');
        expect(result.location.latitude).toEqual(34.4444);
        expect(result.id).toBeDefined();
    }));
});
describe(address_service_1.default.prototype.findAddressByCoordinates, () => {
    let addressDetails;
    beforeEach(() => {
        addressDetails = {
            id: 1,
            longitude: 1.2222,
            latitude: 34.4444,
            address: {
                id: 1,
                address: 'Sample Provider',
            },
        };
        jest.spyOn(location_service_1.default, 'findLocation').mockResolvedValue(addressDetails);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should get address when coordinated are passed', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield address_service_1.addressService.findAddressByCoordinates(1.2343, -1.784);
        expect(result).toEqual(addressDetails.address);
    }));
});
describe(address_service_1.default.prototype.getAddressListByHomebase, () => {
    const addresses = [
        {
            get: (plainProp = { plain: false }) => {
                if (plainProp.plain) {
                    return { address: 'address1' };
                }
            },
        },
        {
            get: (plainProp = { plain: false }) => {
                if (plainProp.plain) {
                    return { address: 'address2' };
                }
            },
        },
    ];
    it('should return a list of addresses', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(database_1.Address, 'findAll').mockResolvedValue(addresses);
        const response = yield address_service_1.addressService.getAddressListByHomebase('SomeHomebase');
        expect(response).toEqual(addresses.map((e) => e.get({ plain: true }).address));
    }));
});
//# sourceMappingURL=address.service.spec.js.map