import appEventService from '../app-event.service';
import TravelEventHandlers from '../travel-events.handlers';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import TripEventsHandlers from '../trip-events.handlers';
import SlackNotifications from '../../slack/SlackPrompts/Notifications';

describe(TravelEventHandlers, () => {
  const botToken = 'xoxp-12782892';
  const testData = {
    botToken,
    data: { id: 3 },
    payload: { user: { id: 9 } },
    trip: { id: 5 },
    respond: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should register trip events subscriptions', () => {
    jest.spyOn(appEventService, 'subscribe');
    TravelEventHandlers.init();
    expect(appEventService.subscribe).toHaveBeenCalled();
  });

  describe('TravelEventHandlers.handleCompletedTrip', () => {
    it('should call managerTripApproval', async () => {
      jest.spyOn(TripEventsHandlers, 'managerTripApproval').mockResolvedValue(null);
      await TravelEventHandlers.handleCompletedTrip(testData);
      expect(TripEventsHandlers.managerTripApproval)
        .toHaveBeenCalledWith(expect.objectContaining({ data: { id: 3 } }));
    });

    it('should handle error', async () => {
      jest.spyOn(BugsnagHelper, 'log').mockReturnValue(null);
      jest.spyOn(TripEventsHandlers, 'managerTripApproval').mockRejectedValue('just fail please');
      await TravelEventHandlers.handleCompletedTrip(testData);
      expect(BugsnagHelper.log).toHaveBeenCalled();
    });
  });

  describe('TravelEventHandlers.handleTravelCancelledByRider', () => {
    it('should send cancel notifications', async () => {
      jest.spyOn(SlackNotifications, 'sendManagerCancelNotification').mockResolvedValue(null);
      jest.spyOn(SlackNotifications, 'sendOpsCancelNotification').mockResolvedValue(null);
      await TravelEventHandlers.handleTravelCancelledByRider(testData);
      expect(SlackNotifications.sendManagerCancelNotification).toHaveBeenCalledTimes(1);
      expect(SlackNotifications.sendOpsCancelNotification).toHaveBeenCalledTimes(1);
    });

    it('should handle error', async () => {
      jest.spyOn(BugsnagHelper, 'log').mockReturnValue(null);
      jest.spyOn(SlackNotifications, 'sendOpsCancelNotification').mockRejectedValue('just fail please');
      await TravelEventHandlers.handleTravelCancelledByRider(testData);
      expect(BugsnagHelper.log).toHaveBeenCalled();
    });
  });
});
