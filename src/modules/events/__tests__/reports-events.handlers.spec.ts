import appEventService from '../app-event.service';
import { reportEventHandler } from '../reports-events.handlers';

describe('ReportsEventHandlers', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should register report events subscriptions', () => {
    jest.spyOn(appEventService, 'subscribe');
    reportEventHandler.init();
    expect(appEventService.subscribe).toHaveBeenCalled();
  });

  it('should trigger the send mail method', async () => {
    jest.spyOn(reportEventHandler.weeklyReport, 'send');
    await reportEventHandler.sendWeeklyReport();
    expect(reportEventHandler.weeklyReport.send).toHaveBeenCalled();
  });
});
