import locationService from './location.service';
import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';

class LocationController {
  /**
   * @description get location in the database
   * @param {object} req
   * @returns {object} latitude and longitude location
   */
  static async getLocation(req, res) {
    try {
      const { id } = req.params;
      const location = await locationService.getLocationById(id);
      return res.json({ location }).status(200);
    } catch (error) {
      HttpError.sendErrorResponse(error);
      bugsnagHelper.log(error);
    }
  }
}

export default LocationController;
