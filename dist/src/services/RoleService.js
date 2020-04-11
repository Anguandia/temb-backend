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
const database_1 = __importDefault(require("../database"));
const errorHandler_1 = __importDefault(require("../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../modules/users/user.service"));
const { models: { Role, UserRole, Homebase, User } } = database_1.default;
class RoleService {
    static createNewRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [role, created] = yield RoleService.createOrFindRole(name);
            if (created) {
                return role;
            }
            errorHandler_1.default.throwErrorIfNull(false, 'Role already exists', 409);
        });
    }
    static getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield Role.findAll();
            errorHandler_1.default.throwErrorIfNull(roles, 'No Existing Roles');
            return roles;
        });
    }
    static getUserRoles(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findOne({ where: { email } });
            const roles = yield user.getRoles();
            errorHandler_1.default.throwErrorIfNull(roles[0], 'User has no role');
            return roles;
        });
    }
    static getRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield Role.findOne({ where: { name } });
            errorHandler_1.default.throwErrorIfNull(role, 'Role not found');
            return role;
        });
    }
    static createUserRole(email, roleName, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, role] = yield Promise.all([
                user_service_1.default.getUser(email),
                RoleService.getRole(roleName)
            ]);
            try {
                yield UserRole.create({ userId: user.id, roleId: role.id, homebaseId });
            }
            catch (e) {
                errorHandler_1.default.throwErrorIfNull('', 'This Role is already assigned to this user', 409);
            }
            return true;
        });
    }
    static createOrFindRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield Role.findOrCreate({ where: { name } });
            return role;
        });
    }
    static findUserRoles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield UserRole.findAll({
                where: { userId },
                include: [{ model: Homebase }, { model: Role }]
            });
            return result;
        });
    }
    static findOrCreateUserRole(userId, roleId, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield UserRole.findOrCreate({ where: { userId, roleId, homebaseId } });
            return result;
        });
    }
}
exports.default = RoleService;
//# sourceMappingURL=RoleService.js.map