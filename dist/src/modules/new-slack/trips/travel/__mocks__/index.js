"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slack_block_models_1 = require("../../../models/slack-block-models");
const slack_helpers_1 = __importDefault(require("../../../helpers/slack-helpers"));
const user_trip_mocks_1 = require("../../user/__mocks__/user-trip-mocks");
exports.trip = {
    id: 1,
    origin: {
        address: 'Andela Nairobi',
    },
    destination: {
        address: 'Jomo Kenyata Airport',
    },
};
exports.dependencyMocks = {
    actionRespond: jest.fn(),
    modalRespond: {
        send: jest.fn(),
        clear: jest.fn(),
        update: jest.fn(),
        error: jest.fn(),
    },
    bugsnagErrorHelperMock: {
        log: jest.fn(),
    },
    travelHelpersMock: {
        getStartMessage: jest.fn().mockReturnValue({}),
        processTripRequest: jest.fn(),
        createTravelSummary: jest.fn().mockResolvedValue({}),
        getTripDetailsModal: jest.fn().mockResolvedValue({}),
        getCompletionResponse: jest.fn(),
        getFlightDetailsModal: jest.fn().mockResolvedValue({}),
        selectLocation: jest.fn().mockReturnValue({}),
        changeLocation: jest.fn().mockReturnValue({}),
    },
    cacheMock: {
        save: jest.fn(),
        fetch: jest.fn(),
    },
    interactionsMock: {
        sendContactDetailsModal: jest.fn(),
        sendAddNoteModal: jest.fn(),
        simpleTextResponse: jest.fn().mockReturnValue({}),
        goodByeMessage: jest.fn().mockResolvedValue({}),
        sendLocationModal: jest.fn(),
    },
    rescheduleHelperMock: {
        sendTripRescheduleModal: jest.fn(),
    },
    itineraryHelpersMock: {
        cancelTrip: jest.fn(),
    },
    teamDetailsServiceMock: {
        getTeamDetailsBotOauthToken: jest.fn().mockResolvedValue('TE2K8PGF8'),
    },
    tripServiceMock: {
        getById: jest.fn().mockResolvedValue(exports.trip),
        updateRequest: jest.fn(),
        createRequest: jest.fn().mockResolvedValue(exports.trip),
    },
    homebaseServiceMock: {
        getHomeBaseEmbassies: jest.fn().mockResolvedValue([]),
        getHomeBaseBySlackId: jest.fn().mockResolvedValue({ id: 1, name: 'Nairobi' }),
        getAllHomebases: jest.fn().mockResolvedValue(user_trip_mocks_1.homeBases),
        filterHomebase: jest.fn().mockReturnValue([user_trip_mocks_1.homeBases[0]]),
    },
    appEventsMock: {
        broadcast: jest.fn(),
    },
    newSlackHelpersMock: {
        modalValidator: jest.fn().mockReturnValue({
            date: '2019-12-12',
            time: '14:55',
        }),
        toSlackSelectOptions: jest.fn().mockReturnValue([{
                text: new slack_block_models_1.SlackText('We here'),
                value: 'some value',
            }]),
        getCancelButton: slack_helpers_1.default.getCancelButton,
        getHomeBaseMessage: jest.fn().mockResolvedValue({}),
        getNavBlock: jest.fn().mockResolvedValue('back_to_launch'),
    },
    slackHelpersMock: {
        getLocationCountryFlag: jest.fn().mockResolvedValue({ country: 'Kenya' }),
    },
    departmentServiceMock: {
        getById: jest.fn().mockResolvedValue({}),
        getAllDepartments: jest.fn().mockResolvedValue({ rows: [] }),
    },
    addressServiceMock: {
        getAddressListByHomebase: jest.fn().mockResolvedValue(['Jomo Kenyata airport']),
        findOrCreateAddress: jest.fn().mockResolvedValue({ id: 8 }),
    },
    dateDialogHelperMock: {
        transformDate: jest.fn().mockReturnValue(''),
    },
    utilsMock: {
        removeHoursFromDate: jest.fn().mockReturnValue(''),
    },
    userServiceMock: {
        getUserBySlackId: jest.fn().mockResolvedValue({ id: 3, homebase: { id: 6 } }),
        updateDefaultHomeBase: jest.fn().mockResolvedValue({ slackId: 'FGFHFHFH', id: 1 }),
    },
    tripDetailsServiceMock: {
        createDetails: jest.fn().mockResolvedValue({ id: 9 }),
    },
    getSlackViewsMock: jest.fn()
        .mockImplementation((botToken) => ({ open: jest.fn().mockResolvedValue(true) })),
    updateSlackMessageHelperMock: {
        sendMessage: jest.fn().mockResolvedValue({}),
    },
};
exports.context = {
    homebase: {
        id: 3,
        name: 'Nairobi',
        channel: 'DP7BH7X4H',
        addressId: 1,
        address: {
            id: 39,
            address: 'nairobi',
        },
    },
    botToken: 'xoxb-478654798518-866490429252-2cmJvC4E1DWlRPrCVFT2Qe9l',
};
exports.tripPayload = {
    tripType: 'Airport Transfer',
    contactDetails: {
        rider: 'UNR0N82AD',
        department: {
            id: 1,
            name: 'TDD',
        },
        passengers: 2,
        riderPhoneNo: '+250788654999',
        travelTeamPhoneNo: '+250788654933',
        requester: 'UNR0N82AD',
    },
    tripDetails: {
        id: 4,
        flightNumber: 'FL11TGH',
        date: '2019-12-19',
        pickup: 'Andela Nairobi',
        destination: 'Embassy of Senegal',
        time: '12:35',
        reason: 'dfgsfd sfdgdf',
        dateTime: '2019-12-19T07:35:00.000Z',
        flightDateTime: '2019-12-19T09:35:00.000Z',
        embassyVisitDateTime: '2019-12-19T09:35:00.000Z',
        tripNotes: 'I always travel with first class',
    },
};
exports.payload = {
    type: 'block_actions',
    team: {
        id: 'TE2K8PGF8',
        domain: 'deshchantinc',
    },
    user: {
        id: 'TE2K8PGF8',
        username: 'patrick.ngabonziza',
        name: 'patrick.ngabonziza',
        team_id: 'TNZ9397ST',
    },
    api_app_id: 'TE2K8PGF8',
    token: 'tbKUAd2nfqNf6of2mQRMVRSD',
    container: {
        type: 'message',
        message_ts: '1575967022.000300',
        channel_id: 'DNXEYMB7F',
        is_ephemeral: false,
    },
    trigger_id: '868631628151.781309313911.3071e69cc600c311b9382f0193c21fab',
    channel: {
        id: 'DNXEYMB7F',
        name: 'directmessage',
    },
    message: {
        type: 'message',
        subtype: 'bot_message',
        text: 'Hello, <@UNR0N82AD>, here is your trip preview',
        ts: '1575967022.000300',
        username: 'TembeaBot',
        bot_id: 'BNZANTXFH',
        blocks: [
            {
                type: 'section',
                block_id: 'mYcTa',
                text: {
                    type: 'mrkdwn',
                    text: '*Trip request preview*',
                    verbatim: false,
                },
            },
            {
                type: 'section',
                block_id: 'SM2MF',
                text: {
                    type: 'mrkdwn',
                    text: '*N.B.* Pickup time is fixed at 2hrs before appointment time',
                    verbatim: false,
                },
            },
            {
                type: 'divider',
                block_id: 'iarI',
            },
            {
                type: 'section',
                block_id: 'BYi',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: '*Passenger*\n<@UNR0N82AD>',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: "*Passenger's Phone Number*\n250788654999",
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Department*\nTDD',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Number of Passengers*\n2',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Travel Team Phone Number*\n250788654933',
                        verbatim: false,
                    },
                ],
            },
            {
                type: 'section',
                block_id: 'pVGY',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: '*Trip Type*\nEmbassy Visit',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Pickup Location*\nAndela Nairobi',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Destination*\nJomo Kenyata Airport',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Pickup Time*\n<!date^1576740900^{date_long} 2019 at {time}|Thu, Dec 19th 2019 09:35 am>',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Appointment Time*\n<!date^1576748100^{date_long} 2019 at {time}|Thu, Dec 19th 2019 11:35 am>',
                        verbatim: false,
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Trip Notes*\nfasdfs',
                        verbatim: false,
                    },
                ],
            },
            {
                type: 'actions',
                block_id: 'travel_trip_confirm_request',
                elements: [
                    {
                        type: 'button',
                        action_id: 'travel_trip_confrim_travel_request',
                        text: {
                            type: 'plain_text',
                            text: 'Confirm Trip Request',
                            emoji: true,
                        },
                        style: 'primary',
                        value: 'confirm',
                    },
                    {
                        type: 'button',
                        action_id: 'travel_trip_add_trip_notes',
                        text: {
                            type: 'plain_text',
                            text: 'Add Trip Note',
                            emoji: true,
                        },
                        style: 'primary',
                        value: 'udpate_note',
                    },
                    {
                        type: 'button',
                        action_id: 'travel_trip_cancel',
                        text: {
                            type: 'plain_text',
                            text: 'Cancel Travel Request',
                            emoji: true,
                        },
                        style: 'danger',
                        value: 'cancel',
                        confirm: {
                            title: {
                                type: 'plain_text',
                                text: 'Are you sure?',
                                emoji: true,
                            },
                            text: {
                                type: 'plain_text',
                                text: 'Are you sure you want to cancel this trip request',
                                emoji: true,
                            },
                            confirm: {
                                type: 'plain_text',
                                text: 'Yes',
                                emoji: true,
                            },
                            deny: {
                                type: 'plain_text',
                                text: 'No',
                                emoji: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
    response_url: 'https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT',
    actions: [
        {
            action_id: 'travel_trip_confrim_travel_request',
            block_id: 'travel_trip_confirm_request',
            text: {
                type: 'plain_text',
                text: 'Confirm Trip Request',
                emoji: true,
            },
            value: 'confirm',
            style: 'primary',
            type: 'button',
            action_ts: '1575967025.065775',
        },
    ],
};
exports.expectedBlocks = {
    blocks: [
        {
            type: 'section',
            text: {
                text: 'Welcome to Tembea! :tembea\n[object Object]\n*I am your trip operations assistant at Andela*\nWhat would you like to do today?',
                type: 'mrkdwn',
            },
        },
        {
            type: 'actions',
            block_id: 'travel_trip_start',
            elements: [
                {
                    type: 'button',
                    text: {
                        text: 'Airport Transfer',
                        type: 'plain_text',
                    },
                    value: 'airportTransfer',
                    action_id: 'travel_trip_airport_transfer',
                    style: 'primary',
                },
                {
                    type: 'button',
                    text: {
                        text: 'Embassy Visit',
                        type: 'plain_text',
                    },
                    value: 'embassyVisit',
                    action_id: 'travel_trip_embassy_visit',
                    style: 'primary',
                },
                {
                    type: 'button',
                    text: {
                        text: 'Change Location',
                        type: 'plain_text',
                    },
                    value: 'changeLocation',
                    action_id: 'travel_trip_change_location',
                    style: 'primary',
                },
                {
                    type: 'button',
                    text: {
                        text: 'Cancel',
                        type: 'plain_text',
                    },
                    value: 'cancel',
                    action_id: 'user_trip_cancel',
                    style: 'danger',
                    confirm: {
                        title: {
                            text: 'Are you sure?',
                            type: 'plain_text',
                        },
                        text: {
                            text: 'Do you really want to cancel',
                            type: 'plain_text',
                        },
                        confirm: {
                            text: 'Yes',
                            type: 'plain_text',
                        },
                        deny: {
                            text: 'No',
                            type: 'plain_text',
                        },
                    },
                },
            ],
        },
    ],
};
exports.expectedPreview = {
    blocks: [
        {
            type: 'section',
            text: {
                text: '*Trip request preview*',
                type: 'mrkdwn',
            },
        },
        {
            type: 'section',
            text: {
                text: '*N.B.* Pickup time is fixed at 3 hrs before flight time',
                type: 'mrkdwn',
            },
        },
        {
            type: 'divider',
        },
        {
            type: 'section',
            fields: [
                {
                    text: '*Passenger*\n<@UX8083BH7>',
                    type: 'mrkdwn',
                },
                {
                    text: "*Passenger's Phone Number*\n+250788654999",
                    type: 'mrkdwn',
                },
                {
                    text: '*Department*\nTDD',
                    type: 'mrkdwn',
                },
                {
                    text: '*Number of Passengers*\n2',
                    type: 'mrkdwn',
                },
                {
                    text: '*Travel Team Phone Number*\n+250788654933',
                    type: 'mrkdwn',
                },
            ],
        },
        {
            type: 'section',
            fields: [
                {
                    text: '*Trip Type*\nAirport Transfer',
                    type: 'mrkdwn',
                },
                {
                    text: '*Pickup Location*\nAndela Nairobi',
                    type: 'mrkdwn',
                },
                {
                    text: '*Destination*\nEmbassy of Senegal',
                    type: 'mrkdwn',
                },
                {
                    text: '*Pickup Time*\n<!date^1576740900^{date_long} 2019 at {time}|Thu, Dec 19th 2019 09:35 am>',
                    type: 'mrkdwn',
                },
                {
                    text: '*Flight Time*\n<!date^1576748100^{date_long} 2019 at {time}|Thu, Dec 19th 2019 11:35 am>',
                    type: 'mrkdwn',
                },
                {
                    text: '*Trip Notes*\nI always travel with first class',
                    type: 'mrkdwn',
                },
                {
                    text: '*Flight Number* \nFL11TGH',
                    type: 'mrkdwn',
                },
            ],
        },
        {
            type: 'actions',
            block_id: 'travel_trip_confirm_request',
            elements: [
                {
                    type: 'button',
                    text: {
                        text: 'Confirm Trip Request',
                        type: 'plain_text',
                    },
                    value: 'confirm',
                    action_id: 'travel_trip_confrim_travel_request',
                    style: 'primary',
                },
                {
                    type: 'button',
                    text: {
                        text: 'Add Trip Note',
                        type: 'plain_text',
                    },
                    value: 'udpate_note',
                    action_id: 'travel_trip_add_trip_notes',
                    style: 'primary',
                },
                {
                    type: 'button',
                    text: {
                        text: 'Cancel Travel Request',
                        type: 'plain_text',
                    },
                    value: 'cancel',
                    action_id: 'travel_trip_cancel',
                    style: 'danger',
                    confirm: {
                        title: {
                            text: 'Are you sure?',
                            type: 'plain_text',
                        },
                        text: {
                            text: 'Are you sure you want to cancel this trip request',
                            type: 'plain_text',
                        },
                        confirm: {
                            text: 'Yes',
                            type: 'plain_text',
                        },
                        deny: {
                            text: 'No',
                            type: 'plain_text',
                        },
                    },
                },
            ],
        },
    ],
    channel: '',
    text: 'Hello, <@UX8083BH7>, here is your trip preview',
};
//# sourceMappingURL=index.js.map