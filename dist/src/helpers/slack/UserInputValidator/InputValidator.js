"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackDialogModels_1 = require("../../../modules/slack/SlackModels/SlackDialogModels");
class InputValidator {
    static isEmptySpace(param) {
        return /\s/g.test(param);
    }
    static checkNumberGreaterThanZero(number, fieldName, errorText) {
        return Number(number) > 0 ? [] : [new SlackDialogModels_1.SlackDialogError(fieldName, `Minimum ${errorText} is 1`)];
    }
    static checkDuplicateFieldValues(fieldOne, fieldTwo, fieldOneName, fieldTwoName) {
        const trimFields = (field) => field.trim().toLowerCase();
        const errorMessage = `${fieldOneName} and ${fieldTwoName} cannot be the same.`;
        if (trimFields(fieldOne) === trimFields(fieldTwo)) {
            return [
                new SlackDialogModels_1.SlackDialogError(fieldOneName, errorMessage),
                new SlackDialogModels_1.SlackDialogError(fieldTwoName, errorMessage)
            ];
        }
        return [];
    }
    static checkValidCoordinates(coordinates, fieldName) {
        const validCoordinates = coordinates.trim().match(/^[-?\d]+(\.[\d]+)?,[ ]*[-?\d]+(\.[\d]+)?$/);
        if (!validCoordinates) {
            return [new SlackDialogModels_1.SlackDialogError(fieldName, 'Not a valid coordinate. Please input as shown in the hint')];
        }
        return [];
    }
}
exports.default = InputValidator;
//# sourceMappingURL=InputValidator.js.map