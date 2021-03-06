"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const dateHelpers_1 = require("../dateHelpers");
class InteractivePromptSlackHelper {
    static sendTripError() {
        return new SlackMessageModels_1.SlackInteractiveMessage('Dang! I hit an error with this trip');
    }
    static passedTimeOutLimit() {
        return new SlackMessageModels_1.SlackInteractiveMessage('Sorry! This trip cant be rescheduled one hour prior the pick-up time');
    }
    static rescheduleConfirmedApprovedError() {
        return new SlackMessageModels_1.SlackInteractiveMessage('Sorry! This trip has been approved and cannot be rescheduled but cancelled.');
    }
    static sendCancelRequestResponse(respond) {
        const message = new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea. Your request has been cancelled');
        respond(message);
    }
    static sendError(message = 'Dang! I hit an error with this request. Please contact Tembea Technical support') {
        return new SlackMessageModels_1.SlackInteractiveMessage(message);
    }
    static sendCompletionResponse(respond, requestId, riderId, isReschedule = false) {
        const attachment = new SlackMessageModels_1.SlackAttachment();
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('view', 'View', requestId),
            new SlackMessageModels_1.SlackButtonAction('reschedule', 'Reschedule ', requestId),
            new SlackMessageModels_1.SlackCancelButtonAction('Cancel Trip', requestId, 'Are you sure you want to cancel this trip', 'cancel_trip'),
            new SlackMessageModels_1.SlackCancelButtonAction()
        ]);
        attachment.addOptionalProps('itinerary_actions');
        const message = new SlackMessageModels_1.SlackInteractiveMessage(isReschedule
            ? 'Your trip request has been successfully rescheduled'
            : `Success! Trip request for <@${riderId}> has been submitted.`, [attachment]);
        respond(message);
    }
    static formatUpcomingTrip(trip, payload, attachments) {
        const { id } = payload.user;
        const attachment = new SlackMessageModels_1.SlackAttachment();
        const journey = `From ${trip.origin.address} To ${trip.destination.address}`;
        const time = `Departure Time:  ${dateHelpers_1.getSlackDateString(trip.departureTime)}`;
        const requestedBy = id === trip.requester.slackId
            ? `Requested By: ${trip.requester.name} (You)`
            : `Requested By: ${trip.requester.name}`;
        const rider = id !== trip.rider.slackId || id !== trip.requester.slackId
            ? `Rider: ${trip.rider.name}`
            : null;
        attachment.addFieldsOrActions('fields', [new SlackMessageModels_1.SlackAttachmentField(journey, time)]);
        attachment.addFieldsOrActions('fields', [new SlackMessageModels_1.SlackAttachmentField(requestedBy, rider)]);
        attachment.addFieldsOrActions('actions', [
            new SlackMessageModels_1.SlackButtonAction('reschedule', 'Reschedule ', trip.id),
            new SlackMessageModels_1.SlackCancelButtonAction('Cancel Trip', trip.id, 'Are you sure you want to cancel this trip', 'cancel_trip')
        ]);
        attachment.addOptionalProps('itinerary_actions');
        attachments.push(attachment);
        return attachments;
    }
    static openDestinationDialog() {
        const attachment = new SlackMessageModels_1.SlackAttachment('', '', '', '', '', 'default', 'warning');
        const actions = [
            new SlackMessageModels_1.SlackButtonAction('openDestination', 'Select Destination', 'destination'),
            new SlackMessageModels_1.SlackCancelButtonAction('Cancel Travel Request', 'cancel', 'Are you sure you want to cancel this travel request', 'cancel_request')
        ];
        attachment.addFieldsOrActions('actions', actions);
        attachment.addOptionalProps('travel_trip_destinationSelection', 'fallback', undefined, 'default');
        const message = new SlackMessageModels_1.SlackInteractiveMessage('*Travel Trip Request *', [
            attachment
        ]);
        return message;
    }
}
exports.default = InteractivePromptSlackHelper;
//# sourceMappingURL=InteractivePromptSlackHelper.js.map