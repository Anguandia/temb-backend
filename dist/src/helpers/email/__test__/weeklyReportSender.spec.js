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
const weeklyReportGenerator_1 = __importDefault(require("../../../services/report/weeklyReportGenerator"));
const weeklyReportSender_1 = __importDefault(require("../weeklyReportSender"));
const bugsnagHelper_1 = __importDefault(require("../../bugsnagHelper"));
const user_service_1 = __importDefault(require("../../../modules/users/user.service"));
const weeklyReportMock_1 = require("../../../services/report/__mocks__/weeklyReportMock");
describe('WeeklyReportSender', () => {
    const weeklyReporter = new weeklyReportSender_1.default();
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('send', () => {
        it('should send mail to expected recipients', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(weeklyReporter, 'getWeeklyEmailReport')
                .mockImplementation(() => (new Promise((resolve) => resolve(weeklyReportMock_1.mockEmailData))));
            jest.spyOn(weeklyReporter, 'sendMail').mockResolvedValue(true);
            yield weeklyReporter.send();
            expect(weeklyReporter.sendMail).toHaveBeenCalled();
        }));
        it('should log to bugsnag if something goes wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(weeklyReporter, 'getWeeklyEmailReport')
                .mockImplementation(() => (new Promise((resolve) => resolve(weeklyReportMock_1.mockEmailData))));
            const mockError = new Error('failed to send mail');
            jest.spyOn(weeklyReporter, 'sendMail').mockRejectedValue(mockError);
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue('');
            yield weeklyReporter.send();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(mockError);
        }));
    });
    describe('sendMail', () => {
        const OLD_ENV = process.env;
        beforeEach(() => {
            jest.resetModules();
            process.env = Object.assign({}, OLD_ENV);
        });
        afterEach(() => {
            process.env = OLD_ENV;
        });
        it('should send mail to expected people', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(weeklyReporter.emailService, 'sendMail')
                .mockImplementation(() => (new Promise((resolve) => resolve(''))));
            yield weeklyReporter.sendMail(weeklyReportMock_1.mockEmailData, weeklyReportMock_1.userEmails);
            expect(weeklyReporter.emailService.sendMail).toHaveBeenCalled();
        }));
        it('should log to bugsnag if something goes wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            delete process.env.TEMBEA_MAIL_ADDRESS;
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield weeklyReporter.sendMail(weeklyReportMock_1.mockEmailData, weeklyReportMock_1.userEmails);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
        }));
    });
    describe('getWeeklyEmailReport', () => {
        it('should return object of name and email', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getWeeklyCompletedTrips')
                .mockImplementation(() => (new Promise((resolve) => resolve([weeklyReportMock_1.mockUserTrip1]))));
            jest.spyOn(user_service_1.default, 'getWeeklyCompletedRoutes')
                .mockImplementation(() => (new Promise((resolve) => resolve([weeklyReportMock_1.mockUserRoute]))));
            jest.spyOn(weeklyReportGenerator_1.default, 'generateEmailData');
            yield weeklyReporter.getWeeklyEmailReport();
            expect(user_service_1.default.getWeeklyCompletedTrips).toHaveBeenCalled();
            expect(user_service_1.default.getWeeklyCompletedRoutes).toHaveBeenCalled();
            expect(weeklyReportGenerator_1.default.generateEmailData).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=weeklyReportSender.spec.js.map