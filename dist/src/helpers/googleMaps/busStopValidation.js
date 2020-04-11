"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SlackDialogModels_1 = require("../../modules/slack/SlackModels/SlackDialogModels");
const index_1 = __importDefault(require("./index"));
const validateBusStop = (otherBusStop, selectBusStop) => {
    if (!otherBusStop && !selectBusStop) {
        const error = new SlackDialogModels_1.SlackDialogError('otherBusStop', 'One of the fields must be filled.');
        return { errors: [error] };
    }
    if (otherBusStop && selectBusStop) {
        const error = new SlackDialogModels_1.SlackDialogError('otherBusStop', 'You can not fill in this field if you selected a stop in the drop down');
        return { errors: [error] };
    }
    const busStop = selectBusStop || otherBusStop;
    if (!index_1.default.isCoordinate(busStop)) {
        return {
            errors: [
                new SlackDialogModels_1.SlackDialogError('otherBusStop', 'You must submit a valid coordinate')
            ]
        };
    }
};
exports.default = validateBusStop;
//# sourceMappingURL=busStopValidation.js.map