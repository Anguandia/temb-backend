import appEvents from './app-event.service';
import { reportSchedules } from './reports-events.constants';
import WeeklyReportSender from '../../helpers/email/weeklyReportSender';

class ReportsEventHandlers {
  weeklyReport: WeeklyReportSender;
  constructor () {
    this.weeklyReport = new WeeklyReportSender();
  }

  init() {
    appEvents.subscribe(reportSchedules.weeklyReport, this.sendWeeklyReport);
  }

  async sendWeeklyReport() {
    await this.weeklyReport.send();
  }
}

export const reportEventHandler = new ReportsEventHandlers();
export default ReportsEventHandlers;
