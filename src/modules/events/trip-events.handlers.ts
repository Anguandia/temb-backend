import appEvents, { IEventPayload } from './app-event.service';
import Notifications from '../slack/SlackPrompts/Notifications';
import { tripEvents } from './trip-events.contants';
import TripNotifications from '../slack/SlackPrompts/notifications/TripNotifications';
import TripJobs from '../../services/jobScheduler/jobs/TripJobs';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import tripService from '../trips/trip.service';
import TripRequest, { TripStatus } from '../../database/models/trip-request';
import ManagerTripHelpers from '../new-slack/trips/manager/trip.helpers';

export default class TripEventsHandlers {
  /**
   * Registers trip subscriptions
   */
  static init() {
    appEvents.subscribe(tripEvents.newTripRequested,
      (arg: IEventPayload) => TripEventsHandlers.handleNewTripCreated(arg, 'newTrip'));
    appEvents.subscribe(tripEvents.autoApprovalNotification, TripEventsHandlers.handleAutoApproval);
    appEvents.subscribe(tripEvents.takeOffReminder, TripEventsHandlers.handleTakeOffReminder);
    appEvents.subscribe(tripEvents.tripCompleted, TripEventsHandlers.handleTripCompletion);
    appEvents.subscribe(tripEvents.managerApprovedTrip, TripEventsHandlers.managerTripApproval);
    appEvents.subscribe(tripEvents.managerDeclinedTrip, TripEventsHandlers.managerTripDeclined);
    appEvents.subscribe(tripEvents.rescheduled,
      (arg: IEventPayload) => TripEventsHandlers.handleNewTripCreated(arg, 'rescheduled'));
  }

  static async handleNewTripCreated({ data, botToken }: IEventPayload, type: string) {
    try {
      const tripDetails = await tripService.getById(data.id, true) as TripRequest;
      await Promise.all([
        ManagerTripHelpers.sendManagerTripRequestNotification(tripDetails, botToken, type),
        TripJobs.scheduleAutoApprove({ botToken, data: tripDetails }),
      ]);
    } catch (err) {
      bugsnagHelper.log(err);
    }
  }

  static async handleAutoApproval({ data, botToken }: IEventPayload) {
    try {
      const tripDetails = await tripService.getById(data.id, true) as TripRequest;
      if (tripDetails.tripStatus === TripStatus.pending) {
        await Notifications.sendOpsApprovalNotification(tripDetails, botToken);
      }
    } catch (err) { bugsnagHelper.log(err); }
  }

  static async handleTakeOffReminder({ data, botToken }: IEventPayload) {
    try {
      const tripDetails = await tripService.getById(data.id, true) as TripRequest;
      await TripNotifications.sendTripReminderNotifications(tripDetails, botToken);
      await TripJobs.scheduleCompletionReminder({ botToken, data: tripDetails });
    } catch (err) { bugsnagHelper.log(err); }
  }

  static async handleTripCompletion({ data, botToken }: IEventPayload) {
    try {
      const trip = await tripService.getById(data.id, true) as TripRequest;
      await TripNotifications.sendCompletionNotification(trip, botToken);
    } catch (err) { bugsnagHelper.log(err); }
  }

  static async managerTripApproval({ data, botToken }: IEventPayload) {
    try {
      const trip = await tripService.getById(data.id, true) as TripRequest;
      await Notifications.sendOperationsTripRequestNotification(trip, botToken);
    } catch (err) { bugsnagHelper.log(err); }
  }

  static async managerTripDeclined({ data, botToken }: IEventPayload) {
    try {
      const trip = await tripService.getById(data.id, true) as TripRequest;
      await Notifications.sendRequesterDeclinedNotification(trip, botToken);
    } catch (err) { bugsnagHelper.log(err); }
  }
}
