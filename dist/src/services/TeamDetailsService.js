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
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../database"));
const cache_1 = __importDefault(require("../modules/shared/cache"));
const bugsnagHelper_1 = __importDefault(require("../helpers/bugsnagHelper"));
const { models: { TeamDetails } } = database_1.default;
const getTeamDetailsKey = (teamId) => `TEMBEA_V2_TEAMDETAILS_${teamId}`;
class TeamDetailsService {
    static getTeamDetailsByToken(botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield TeamDetails.findOne({
                where: { botToken },
            });
            return result.get();
        });
    }
    static getTeamDetails(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedValue = yield cache_1.default.fetch(getTeamDetailsKey(teamId));
            if (fetchedValue) {
                return fetchedValue;
            }
            try {
                const result = yield TeamDetails.findByPk(teamId);
                const data = result.get();
                yield cache_1.default.saveObject(getTeamDetailsKey(teamId), data);
                return data;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not get team details from DB');
            }
        });
    }
    static getTeamDetailsByTeamUrl(teamUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedValue = yield cache_1.default.fetch(getTeamDetailsKey(teamUrl));
            if (fetchedValue) {
                return fetchedValue;
            }
            try {
                const teamDetails = yield TeamDetails.findOne({
                    raw: true,
                    where: {
                        teamUrl: { [sequelize_1.default.Op.or]: [`https://${teamUrl}`, teamUrl] },
                    }
                });
                yield cache_1.default.saveObject(getTeamDetailsKey(teamUrl), teamDetails);
                return teamDetails;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not get the team details.');
            }
        });
    }
    static getTeamDetailsBotOauthToken(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botToken } = yield TeamDetailsService.getTeamDetails(teamId);
            return botToken;
        });
    }
    static getAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allTeams = yield TeamDetails.findAll();
                return allTeams;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not get all teamDetails from DB');
            }
        });
    }
    static saveTeamDetails(teamObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield TeamDetails.upsert(Object.assign({}, teamObject));
                yield cache_1.default.saveObject(getTeamDetailsKey(teamObject.teamId), teamObject);
                return teamObject;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not update teamDetails or write new teamDetails to DB');
            }
        });
    }
}
exports.default = TeamDetailsService;
//# sourceMappingURL=TeamDetailsService.js.map