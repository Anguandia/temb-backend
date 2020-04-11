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
const TeamDetailsService_1 = __importDefault(require("../TeamDetailsService"));
const database_1 = __importDefault(require("../../database"));
const cache_1 = __importDefault(require("../../modules/shared/cache"));
const { models: { TeamDetails } } = database_1.default;
describe('Team details service', () => {
    const data = { data: 'team details' };
    beforeAll(() => {
        cache_1.default.fetch = jest.fn((teamId) => {
            if (teamId === 'teamDetails_SAVEDTEAMID') {
                return {
                    data: 'team details'
                };
            }
        });
    });
    it('should get team details from cache', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(data);
        const teamDetails = yield TeamDetailsService_1.default.getTeamDetails('SAVEDTEAMID');
        expect(teamDetails).toEqual(data);
    }));
    it('should fetch team details from DB', (done) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(data);
        jest.spyOn(TeamDetails, 'findByPk').mockReturnValue({ teamId: 'TEAMID1', teamName: 'Team 1' });
        const teamDetails = yield TeamDetailsService_1.default.getTeamDetails('TEAMID1');
        expect(teamDetails).toEqual(data);
        done();
    }));
    it('should throw a db error', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield TeamDetailsService_1.default.getTeamDetails({});
        }
        catch (error) {
            expect(error.message).toBe('Could not get team details from DB');
        }
    }));
    it('should save new team details', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TeamDetailsService_1.default.saveTeamDetails({
            botId: 'XXXXXXX',
            botToken: 'XXXXXXXXXXXXX',
            teamId: 'XXXXXXX',
            teamName: 'Fake Team',
            userId: 'XXXXXXXXXXXXX',
            userToken: 'XXXXXXXXXXX',
            webhookConfigUrl: 'XXXXXXXXXXXXX',
            opsChannelId: 'XXXXXXXXXXXXX',
            teamUrl: 'faketeam.slack.come'
        });
        expect(result).toEqual({
            botId: 'XXXXXXX',
            botToken: 'XXXXXXXXXXXXX',
            teamId: 'XXXXXXX',
            teamName: 'Fake Team',
            userId: 'XXXXXXXXXXXXX',
            userToken: 'XXXXXXXXXXX',
            webhookConfigUrl: 'XXXXXXXXXXXXX',
            opsChannelId: 'XXXXXXXXXXXXX',
            teamUrl: 'faketeam.slack.come'
        });
    }));
    it('should throw an error on team details', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield TeamDetailsService_1.default.saveTeamDetails();
        }
        catch (error) {
            expect(error.message).toEqual('Could not update teamDetails or write new teamDetails to DB');
        }
    }));
    describe('TeamDetailsService_getAllTeams', () => {
        beforeEach(() => {
            jest.spyOn(TeamDetails, 'findAll').mockImplementation().mockResolvedValue([{
                    teamId: 'TEAMID2',
                    botId: 'BOTID2',
                    botToken: 'BOTTOKEN2',
                    teamName: 'TEAMNAME2',
                    teamUrl: 'https://ACME.slack.com'
                }]);
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should fetch all team details from DB', () => __awaiter(void 0, void 0, void 0, function* () {
            const allTeams = yield TeamDetailsService_1.default.getAllTeams();
            expect(TeamDetails.findAll).toBeCalled();
            expect(allTeams[0].teamId).toEqual('TEAMID2');
            expect(allTeams).not.toBeNaN();
        }));
        it('should throw an error when it cannot get team details', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TeamDetails, 'findAll').mockImplementation(() => {
                throw new Error();
            });
            try {
                yield TeamDetailsService_1.default.getAllTeams();
            }
            catch (error) {
                expect(error.message).toEqual('Could not get all teamDetails from DB');
            }
        }));
    });
});
describe('getTeamDetailsByTeamUrl', () => {
    const teamUrl = 'teamUrl';
    const data = { data: 'team details' };
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
    });
    it('should fetch team details from catch', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(data);
        const result = yield TeamDetailsService_1.default.getTeamDetailsByTeamUrl(teamUrl);
        expect(TeamDetails.findOne).not.toHaveBeenCalled();
        expect(cache_1.default.fetch).toBeCalledTimes(1);
        expect(result).toEqual(data);
    }));
    it('should fetch team details from database and save it in cache', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(null);
        jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
        cache_1.default.saveObject = jest.fn(() => { });
        const result = yield TeamDetailsService_1.default.getTeamDetailsByTeamUrl(teamUrl);
        expect(cache_1.default.saveObject).toBeCalledWith(`TEMBEA_V2_TEAMDETAILS_${teamUrl}`, data);
        expect(result).toEqual(data);
    }));
    it('should fail on get team details by URL', () => __awaiter(void 0, void 0, void 0, function* () {
        cache_1.default.fetch = jest.fn(() => null);
        TeamDetails.findOne = jest.fn(() => Promise.reject(new Error('')));
        expect(TeamDetailsService_1.default.getTeamDetailsByTeamUrl(teamUrl))
            .rejects.toThrow('Could not get the team details.');
    }));
});
//# sourceMappingURL=teamDetailsService.spec.js.map