"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notifications_1 = __importDefault(require("../SlackPrompts/Notifications"));
const index_1 = __importDefault(require("../SlackPrompts/notifications/ManagerRouteRequest/index"));
const slackEvents_1 = require("./slackEvents");
const OperationsRouteRequest_1 = __importDefault(require("../SlackPrompts/notifications/OperationsRouteRequest"));
const RouteNotifications_1 = __importDefault(require("../SlackPrompts/notifications/RouteNotifications"));
const joinRoute_notifications_1 = __importDefault(require("../../new-slack/routes/user/joinRoute.notifications"));
const ProviderNotifications_1 = __importDefault(require("../SlackPrompts/notifications/ProviderNotifications"));
const OperationsHelper_1 = __importDefault(require("../helpers/slackHelpers/OperationsHelper"));
const interactions_1 = __importDefault(require("../../new-slack/trips/manager/interactions"));
const slackEvents = slackEvents_1.SlackEvents;
slackEvents.handle(slackEvents_1.slackEventNames.TRIP_WAITING_CONFIRMATION, interactions_1.default.sendRequesterApprovedNotification);
slackEvents.handle(slackEvents_1.slackEventNames.RECEIVE_NEW_ROUTE_REQUEST, Notifications_1.default.sendOperationsNewRouteRequest);
slackEvents.handle(slackEvents_1.slackEventNames.DECLINED_TRIP_REQUEST, Notifications_1.default.sendRequesterDeclinedNotification);
slackEvents.handle(slackEvents_1.slackEventNames.NEW_TRAVEL_TRIP_REQUEST, Notifications_1.default.sendOperationsTripRequestNotification);
slackEvents.handle(slackEvents_1.slackEventNames.NEW_ROUTE_REQUEST, index_1.default.sendManagerNotification);
slackEvents.handle(slackEvents_1.slackEventNames.MANAGER_DECLINED_ROUTE_REQUEST, index_1.default.sendManagerDeclineMessageToFellow);
slackEvents.handle(slackEvents_1.slackEventNames.MANAGER_APPROVED_ROUTE_REQUEST, index_1.default.sendManagerApproval);
slackEvents.handle(slackEvents_1.slackEventNames.OPERATIONS_DECLINE_ROUTE_REQUEST, OperationsRouteRequest_1.default.completeOperationsDeclineAction);
slackEvents.handle(slackEvents_1.slackEventNames.NOTIFY_ROUTE_RIDERS, RouteNotifications_1.default.sendRouteNotificationToRouteRiders);
slackEvents.handle(slackEvents_1.slackEventNames.UPDATE_ROUTE_DRIVER, ProviderNotifications_1.default.sendProviderReasignDriverMessage);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE, joinRoute_notifications_1.default.sendManagerJoinRequest);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST, joinRoute_notifications_1.default.sendFilledCapacityJoinRequest);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.RIDERS_CONFIRM_ROUTE_USE, RouteNotifications_1.default.sendRouteUseConfirmationNotificationToRider);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.RIDER_CANCEL_TRIP, Notifications_1.default.sendManagerCancelNotification);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.NOTIFY_OPS_CANCELLED_TRIP, Notifications_1.default.sendOpsCancelNotification);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.SEND_PROVIDER_VEHICLE_REMOVAL_NOTIFICATION, ProviderNotifications_1.default.sendVehicleRemovalProviderNotification);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.SEND_PROVIDER_CREATED_ROUTE_REQUEST, ProviderNotifications_1.default.sendRouteApprovalNotification);
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.COMPLETE_ROUTE_APPROVAL, OperationsHelper_1.default.completeRouteApproval);
exports.default = slackEvents;
//# sourceMappingURL=index.js.map