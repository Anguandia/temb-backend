"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TripCabController_1 = __importDefault(require("../TripCabController"));
const SlackInteractions_1 = __importDefault(require("../../SlackInteractions"));
const twilio_mocks_1 = require("../../../../modules/notifications/whatsapp/twilio.mocks");
twilio_mocks_1.mockWhatsappOptions();
describe('TripCabController', () => {
    let respond;
    beforeEach(() => {
        respond = jest.fn();
    });
    it('should send create cab Attacment', (done) => {
        const payload = {
            state: JSON.stringify({}),
            submission: {
                confirmationComment: 'comment'
            }
        };
        const result = TripCabController_1.default.sendCreateCabAttachment(payload, 'operations_approval_trip', null);
        expect(result.text).toEqual('*Proceed to Create New Cab*');
        done();
    });
    it('should handle provider assignment submission', (done) => {
        const data = {
            submission: {
                provider: 'DbrandTaxify, 1, UXTXFY'
            }
        };
        const handleTripActionsSpy = jest.spyOn(SlackInteractions_1.default, 'handleTripActions');
        TripCabController_1.default.handleSelectProviderDialogSubmission(data, respond);
        expect(handleTripActionsSpy).toHaveBeenCalled();
        done();
    });
});
//# sourceMappingURL=TripCabController.spec.js.map