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
const app_event_service_1 = __importDefault(require("../app-event.service"));
const reports_events_handlers_1 = require("../reports-events.handlers");
describe('ReportsEventHandlers', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should register report events subscriptions', () => {
        jest.spyOn(app_event_service_1.default, 'subscribe');
        reports_events_handlers_1.reportEventHandler.init();
        expect(app_event_service_1.default.subscribe).toHaveBeenCalled();
    });
    it('should trigger the send mail method', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(reports_events_handlers_1.reportEventHandler.weeklyReport, 'send');
        yield reports_events_handlers_1.reportEventHandler.sendWeeklyReport();
        expect(reports_events_handlers_1.reportEventHandler.weeklyReport.send).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=reports-events.handlers.spec.js.map