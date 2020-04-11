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
const app_event_service_1 = __importDefault(require("./app-event.service"));
const reports_events_constants_1 = require("./reports-events.constants");
const weeklyReportSender_1 = __importDefault(require("../../helpers/email/weeklyReportSender"));
class ReportsEventHandlers {
    constructor() {
        this.weeklyReport = new weeklyReportSender_1.default();
    }
    init() {
        app_event_service_1.default.subscribe(reports_events_constants_1.reportSchedules.weeklyReport, this.sendWeeklyReport);
    }
    sendWeeklyReport() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.weeklyReport.send();
        });
    }
}
exports.reportEventHandler = new ReportsEventHandlers();
exports.default = ReportsEventHandlers;
//# sourceMappingURL=reports-events.handlers.js.map