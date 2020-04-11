import weeklyReportGenerator from '../../../services/report/weeklyReportGenerator';
import WeeklyReportSender from '../weeklyReportSender';
import BugsnagHelper from '../../bugsnagHelper';
import userService from '../../../modules/users/user.service';
import { mockUserTrip1, mockUserRoute, mockEmailData, userEmails } from '../../../services/report/__mocks__/weeklyReportMock';

describe('WeeklyReportSender', () => {
  const weeklyReporter = new WeeklyReportSender();
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('send', () => {
    it('should send mail to expected recipients', async () => {
      jest.spyOn(weeklyReporter, 'getWeeklyEmailReport')
      .mockImplementation(() => (new Promise((resolve) => resolve(mockEmailData))));
      jest.spyOn(weeklyReporter, 'sendMail').mockResolvedValue(true);
      await weeklyReporter.send();

      expect(weeklyReporter.sendMail).toHaveBeenCalled();
    });

    it('should log to bugsnag if something goes wrong', async () => {
      jest.spyOn(weeklyReporter, 'getWeeklyEmailReport')
      .mockImplementation(() => (new Promise((resolve) => resolve(mockEmailData))));
      const mockError = new Error('failed to send mail');
      jest.spyOn(weeklyReporter, 'sendMail').mockRejectedValue(mockError);
      jest.spyOn(BugsnagHelper, 'log').mockReturnValue('');

      await weeklyReporter.send();

      expect(BugsnagHelper.log).toHaveBeenCalledWith(mockError);
    });
  });

  describe('sendMail', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });
    it('should send mail to expected people', async () => {
      jest.spyOn(weeklyReporter.emailService, 'sendMail')
      .mockImplementation(() => (new Promise((resolve) => resolve(''))));
      await weeklyReporter.sendMail(mockEmailData, userEmails);
      expect(weeklyReporter.emailService.sendMail).toHaveBeenCalled();
    });

    it('should log to bugsnag if something goes wrong', async () => {
      delete process.env.TEMBEA_MAIL_ADDRESS;
      jest.spyOn(BugsnagHelper, 'log');
      await weeklyReporter.sendMail(mockEmailData, userEmails);

      expect(BugsnagHelper.log).toHaveBeenCalledWith('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
    });
  });

  describe('getWeeklyEmailReport', () => {
    it('should return object of name and email', async () => {
      jest.spyOn(userService, 'getWeeklyCompletedTrips')
      .mockImplementation(() => (new Promise((resolve) => resolve([mockUserTrip1]))));
      jest.spyOn(userService, 'getWeeklyCompletedRoutes')
      .mockImplementation(() => (new Promise((resolve) => resolve([mockUserRoute]))));
      jest.spyOn(weeklyReportGenerator, 'generateEmailData');
      await weeklyReporter.getWeeklyEmailReport();
      expect(userService.getWeeklyCompletedTrips).toHaveBeenCalled();
      expect(userService.getWeeklyCompletedRoutes).toHaveBeenCalled();
      expect(weeklyReportGenerator.generateEmailData).toHaveBeenCalled();
    });
  });
});
