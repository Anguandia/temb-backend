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
const RoleService_1 = __importDefault(require("../RoleService"));
const database_1 = __importDefault(require("../../database"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
const { models: { Role, UserRole, User } } = database_1.default;
describe('Role Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should run createNewRole method and return a role', () => __awaiter(void 0, void 0, void 0, function* () {
        const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
        findOrCreateMock.mockResolvedValue(['Basic', true]);
        const result = yield RoleService_1.default.createNewRole('Ope');
        expect(result).toEqual('Basic');
        expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'Ope' } });
    }));
    it('should run createNewRole method and call HttpError method when role already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
        findOrCreateMock.mockResolvedValue(['Basic', false]);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation();
        yield RoleService_1.default.createNewRole('John');
        expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'John' } });
        expect(httpMock).toHaveBeenCalledWith(false, 'Role already exists', 409);
    }));
    it('should run createNewRole method and throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockErr = new Error('boo');
        const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
        findOrCreateMock.mockRejectedValue(mockErr);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull');
        expect.assertions(3);
        try {
            yield RoleService_1.default.createNewRole('John');
        }
        catch (error) {
            expect(error).toEqual(mockErr);
        }
        expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'John' } });
        expect(httpMock).not.toHaveBeenCalled();
    }));
    it('should run getRoles method and return roles', () => __awaiter(void 0, void 0, void 0, function* () {
        const findAllMock = jest.spyOn(Role, 'findAll');
        findAllMock.mockResolvedValue('Admin');
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation();
        const result = yield RoleService_1.default.getRoles();
        expect(result).toEqual('Admin');
        expect(findAllMock).toHaveBeenCalled();
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith('Admin', 'No Existing Roles');
    }));
    it('should run getRoles method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockErr = new Error('no roles');
        const findAllMock = jest.spyOn(Role, 'findAll').mockRejectedValue(mockErr);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation();
        try {
            yield RoleService_1.default.getRoles();
        }
        catch (error) {
            expect(error).toEqual(mockErr);
        }
        expect(findAllMock).toHaveBeenCalled();
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    it('should run getUserRoles method and return roles', () => __awaiter(void 0, void 0, void 0, function* () {
        const findUserMock = jest.spyOn(User, 'findOne');
        findUserMock.mockResolvedValue({ getRoles: () => ['Editor'] });
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation();
        const result = yield RoleService_1.default.getUserRoles('tomboy@email.com');
        expect(result).toEqual(['Editor']);
        expect(findUserMock).toHaveBeenCalledWith({ where: { email: 'tomboy@email.com' } });
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith('Editor', 'User has no role');
    }));
    it('should run getUserRoles method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMock = new Error('no roles');
        const findUserMock = jest.spyOn(User, 'findOne');
        findUserMock.mockRejectedValue(errorMock);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull');
        expect.assertions(3);
        try {
            yield RoleService_1.default.getUserRoles('tom@email.com');
        }
        catch (error) {
            expect(error).toEqual(errorMock);
        }
        expect(findUserMock).toHaveBeenCalledWith({ where: { email: 'tom@email.com' } });
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    it('should run getRole method and return roles', () => __awaiter(void 0, void 0, void 0, function* () {
        const getRoleMock = jest.spyOn(Role, 'findOne');
        getRoleMock.mockResolvedValue('Sales');
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull')
            .mockImplementation();
        const result = yield RoleService_1.default.getRole('Kuyoro');
        expect(result).toEqual('Sales');
        expect(getRoleMock).toHaveBeenCalledWith({ where: { name: 'Kuyoro' } });
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith('Sales', 'Role not found');
    }));
    it('should run getRole method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMock = new Error('Rolex');
        const getRoleMock = jest.spyOn(Role, 'findOne').mockRejectedValue(errorMock);
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull')
            .mockImplementation();
        try {
            yield RoleService_1.default.getRole('Oba');
        }
        catch (error) {
            expect(error).toEqual(errorMock);
        }
        expect(getRoleMock).toHaveBeenCalledWith({ where: { name: 'Oba' } });
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    it('should run createUser method and return userRole', () => __awaiter(void 0, void 0, void 0, function* () {
        const getUserMock = jest.spyOn(user_service_1.default, 'getUser')
            .mockResolvedValue({ id: 1 });
        const getRoleMock = jest.spyOn(RoleService_1.default, 'getRole')
            .mockResolvedValue({ id: 1, name: 'Executive' });
        jest.spyOn(UserRole, 'create').mockResolvedValue();
        const result = yield RoleService_1.default.createUserRole('boss@email.com', 'VIP');
        expect(result).toEqual(true);
        expect(getUserMock).toHaveBeenCalledWith('boss@email.com');
        expect(getRoleMock).toHaveBeenCalledWith('VIP');
    }));
    it('should return an error if user role already exists ', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUser')
            .mockResolvedValue({ id: 1 });
        jest.spyOn(RoleService_1.default, 'getRole')
            .mockResolvedValue({ id: 1, name: 'Executive' });
        jest.spyOn(UserRole, 'create').mockResolvedValue(Promise.reject());
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation();
        const result = yield RoleService_1.default.createUserRole('boss@email.com', 'VIP');
        expect(result).toEqual(true);
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith('', 'This Role is already assigned to this user', 409);
    }));
    it('should run createUser method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const failMock = new Error('Failed');
        const getUserMock = jest.spyOn(user_service_1.default, 'getUser').mockRejectedValue(failMock);
        const getRoleMock = jest.spyOn(RoleService_1.default, 'getRole').mockImplementation();
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull')
            .mockImplementation();
        try {
            yield RoleService_1.default.createUserRole('chief@email.com', 'SENATE');
        }
        catch (error) {
            expect(error).toEqual(failMock);
        }
        expect(getUserMock).toHaveBeenCalledWith('chief@email.com');
        expect(getRoleMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    describe('createOrFindRole', () => {
        it('should create new role and return full role object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Role, 'findOrCreate').mockResolvedValue({
                id: 1, name: 'Super Admin', createdAt: '2019-01-14 03:00:00+03'
            });
            const role = yield RoleService_1.default.createOrFindRole('Super Admin');
            expect(role).toEqual({
                id: 1, name: 'Super Admin', createdAt: '2019-01-14 03:00:00+03'
            });
        }));
    });
    describe('findUserRoles', () => {
        it('should create new role and return full role object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserRole, 'findAll').mockResolvedValue([]);
            const roles = yield RoleService_1.default.findUserRoles();
            expect(roles).toEqual([]);
        }));
    });
    describe('createUserRoles', () => {
        it('should create new role and return full role object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserRole, 'findOrCreate').mockResolvedValue([]);
            const roles = yield RoleService_1.default.findOrCreateUserRole(1, 1, 1);
            expect(roles).toEqual([]);
        }));
    });
});
//# sourceMappingURL=RoleService.spec.js.map