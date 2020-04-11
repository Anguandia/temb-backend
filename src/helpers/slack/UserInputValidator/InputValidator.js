import { SlackDialogError } from '../../../modules/slack/SlackModels/SlackDialogModels';

class InputValidator {
  static isEmptySpace(param) {
    return /\s/g.test(param);
  }

  static checkNumberGreaterThanZero(number, fieldName, errorText) {
    return Number(number) > 0 ? [] : [new SlackDialogError(fieldName, `Minimum ${errorText} is 1`)];
  }

  static checkDuplicateFieldValues(fieldOne, fieldTwo, fieldOneName, fieldTwoName) {
    const trimFields = (field) => field.trim().toLowerCase();
    const errorMessage = `${fieldOneName} and ${fieldTwoName} cannot be the same.`;
    if (trimFields(fieldOne) === trimFields(fieldTwo)) {
      return [
        new SlackDialogError(fieldOneName, errorMessage),
        new SlackDialogError(fieldTwoName, errorMessage)
      ];
    }
    return [];
  }

  static checkValidCoordinates(coordinates, fieldName) {
    const validCoordinates = coordinates.trim().match(
      /^([A-Za-z0-9]{4,8})\+([A-Za-z0-9]{2})((\s)([a-zA-Z]+))((,)(\s)([a-zA-Z]+))?$/
    );
    if (!validCoordinates) {
      return [new SlackDialogError(
        fieldName, 'Not a valid plus code. Please input as shown in the hint'
      )];
    }
    return [];
  }
}

export default InputValidator;
