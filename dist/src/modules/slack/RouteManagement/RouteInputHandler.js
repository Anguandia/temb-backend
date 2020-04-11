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
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const cache_1 = __importDefault(require("../../shared/cache"));
const DialogPrompts_1 = __importDefault(require("../SlackPrompts/DialogPrompts"));
const LocationPrompts_1 = __importDefault(require("../SlackPrompts/LocationPrompts"));
const PreviewPrompts_1 = __importDefault(require("../SlackPrompts/PreviewPrompts"));
const googleMapsHelpers_1 = require("../../../helpers/googleMaps/googleMapsHelpers");
const GoogleMapsPlaceDetails_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsPlaceDetails"));
const googleMaps_1 = __importDefault(require("../../../services/googleMaps"));
const GoogleMapsStatic_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsStatic"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const busStopValidation_1 = __importDefault(require("../../../helpers/googleMaps/busStopValidation"));
const UserInputValidator_1 = __importDefault(require("../../../helpers/slack/UserInputValidator"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const events_1 = __importDefault(require("../events"));
const slackEvents_1 = require("../events/slackEvents");
const RouteInputHandlerHelper_1 = __importDefault(require("./RouteInputHandlerHelper"));
const formHelper_1 = require("../helpers/formHelper");
const InteractivePromptSlackHelper_1 = __importDefault(require("../helpers/slackHelpers/InteractivePromptSlackHelper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../helpers/slack/updatePastMessageHelper"));
const location_helpers_1 = __importDefault(require("../../new-slack/helpers/location-helpers"));
const actions_1 = __importDefault(require("../../new-slack/routes/actions"));
const blocks_1 = __importDefault(require("../../new-slack/routes/blocks"));
const RouteInputHandlers = {
    home: (payload, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { submission: { location: locationSearchString } } = payload;
            if (payload.type === 'dialog_submission') {
                const result = yield RouteInputHandlerHelper_1.default
                    .checkIfAddressExistOnDatabase(payload, respond, locationSearchString);
                if (result)
                    return;
            }
            const { user: { id: userId }, submission: { location } } = payload;
            const locationOptions = {
                selectBlockId: blocks_1.default.confirmLocation,
                selectActionId: actions_1.default.pickupLocation,
                navBlockId: blocks_1.default.navBlock,
                navActionId: actions_1.default.back,
                backActionValue: 'back_to_routes_launch',
            };
            const message = yield location_helpers_1.default.getLocationVerificationMsg(location, userId, locationOptions);
            respond(message);
        }
        catch (error) {
            respond(InteractivePromptSlackHelper_1.default.sendError());
            bugsnagHelper_1.default.log(error);
        }
    }),
    suggestions: (payload, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const place = yield googleMapsHelpers_1.RoutesHelper.getReverseGeocodePayload(payload);
            if (!place) {
                LocationPrompts_1.default.sendLocationCoordinatesNotFound(respond);
                return;
            }
            const { geometry: { location: { lat: latitude } } } = place;
            const { geometry: { location: { lng: longitude } } } = place;
            const locationGeometry = `${latitude},${longitude}`;
            const placeDetails = yield GoogleMapsPlaceDetails_1.default.getPlaceDetails(place.place_id);
            const address = `${placeDetails.result.name}, ${placeDetails.result.formatted_address}`;
            const locationMarker = new googleMapsHelpers_1.Marker('red', 'H');
            locationMarker.addLocation(locationGeometry);
            const staticMapString = GoogleMapsStatic_1.default.getLocationScreenshot([locationMarker]);
            const staticMapUrl = RouteInputHandlerHelper_1.default.convertStringToUrl(staticMapString);
            yield cache_1.default.save(payload.user.id, 'homeAddress', { address, latitude, longitude });
            LocationPrompts_1.default
                .sendLocationConfirmationResponse(respond, staticMapUrl, address, locationGeometry);
        }
        catch (error) {
            InteractivePromptSlackHelper_1.default.sendError();
            bugsnagHelper_1.default.log(error);
        }
    }),
    locationNotFound: (payload, respond) => {
        const { value } = payload.actions[0];
        if (value === 'no') {
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
            return DialogPrompts_1.default.sendLocationCoordinatesForm(payload);
        }
        if (value === 'retry') {
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Noted...'));
            return DialogPrompts_1.default.sendLocationForm(payload);
        }
    },
    handleBusStopRoute: (payload, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (payload.actions[0].name === 'not_listed') {
                RouteInputHandlerHelper_1.default.continueWithTheFlow(payload, respond);
                return;
            }
            const { value: location } = payload.actions[0].name === 'DatabaseSuggestions'
                ? JSON.parse(payload.actions[0].selected_options[0].value)
                : payload.actions[0];
            const maps = new googleMaps_1.default();
            const result = yield maps.findNearestBusStops(location);
            if (payload.actions[0].name === 'DatabaseSuggestions') {
                yield RouteInputHandlerHelper_1.default.cacheLocationAddress(payload);
            }
            const busStageList = googleMaps_1.default.mapResultsToCoordinates(result);
            const resolvedList = yield RouteInputHandlerHelper_1.default.generateResolvedBusList(busStageList, location, payload);
            if (resolvedList) {
                return DialogPrompts_1.default.sendBusStopForm(payload, resolvedList);
            }
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Sorry, we could not find a bus-stop close to your location'));
        }
        catch (e) {
            bugsnagHelper_1.default.log(e);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Please Try again, Request Timed out'));
        }
    }),
    handleBusStopSelected: (payload, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otherBusStop, selectBusStop } = payload.submission;
            const busStopCoordinate = selectBusStop || otherBusStop;
            const errors = busStopValidation_1.default(otherBusStop, selectBusStop);
            if (errors)
                return errors;
            const previewData = yield RouteInputHandlerHelper_1.default.resolveDestinationPreviewData(payload, busStopCoordinate);
            const { validationError } = previewData;
            if (validationError)
                return validationError;
            yield updatePastMessageHelper_1.default.updateMessage(payload.state, { text: 'Noted...' });
            yield RouteInputHandlerHelper_1.default.savePreviewDataToCache(payload.user.id, previewData);
            const previewMessage = PreviewPrompts_1.default.displayDestinationPreview(previewData);
            respond(previewMessage);
        }
        catch (error) {
            bugsnagHelper_1.default.log(error);
        }
    }),
    runValidations: (payload) => {
        if (payload.submission && payload.submission.coordinates) {
            const errors = [];
            errors.push(...UserInputValidator_1.default.validateCoordinates(payload));
            return errors;
        }
    },
    handleNewRouteRequest: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { value } = payload.actions[0];
        if (value === 'launchNewRoutePrompt') {
            return DialogPrompts_1.default.sendNewRouteForm(payload);
        }
    }),
    handlePreviewPartnerInfo: (payload, respond) => __awaiter(void 0, void 0, void 0, function* () {
        const { user: { id: userId }, team: { id: teamId } } = payload;
        const [requester, cached, partnerInfo] = yield Promise.all([
            slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId),
            yield cache_1.default.fetch(userId),
            yield formHelper_1.getFellowEngagementDetails(userId, teamId)
        ]);
        const { locationInfo } = cached;
        const { submission } = payload;
        const errors = UserInputValidator_1.default.validateEngagementForm(submission);
        if (errors)
            return errors;
        yield updatePastMessageHelper_1.default.updateMessage(payload.state, { text: 'Noted...' });
        if (locationInfo) {
            const message = yield PreviewPrompts_1.default.sendPartnerInfoPreview(Object.assign(Object.assign({}, payload), { partnerName: partnerInfo.partnerStatus }), locationInfo, requester);
            respond(message);
        }
    }),
    handlePartnerForm: (payload, respond) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { team: { id: teamId } } = payload;
            const routeRequest = yield RouteInputHandlerHelper_1.default.handleRouteRequestSubmission(payload);
            events_1.default.raise(slackEvents_1.slackEventNames.NEW_ROUTE_REQUEST, respond, {
                routeRequestId: routeRequest.id,
                teamId
            });
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Your Route Request has been successfully submitted'));
        }
        catch (e) {
            bugsnagHelper_1.default.log(e);
            respond(new SlackMessageModels_1.SlackInteractiveMessage('Unsuccessful request. Please Try again, Request Timed out'));
        }
    })
};
exports.default = RouteInputHandlers;
//# sourceMappingURL=RouteInputHandler.js.map