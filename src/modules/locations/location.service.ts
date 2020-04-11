import database, { Op } from '../../database';
import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { BaseService } from '../shared/base.service';
import Location from '../../database/models/location';

class LocationService extends BaseService<Location, number> {
  /**
   * @description Get location by longitude and latitude from the database
   * @param {number} longitude The longitude of the location on the db
   * @param {number} latitude The latitude of the location on the db
   * @param {boolean} raiseError
   * @param {boolean} includeAddress
   * @return {Promise<object>} location model
   */

  async findLocation(
    longitude: number,
    latitude: number,
    raiseError: boolean = false,
    includeAddress: boolean = false,
  ) {
    try {
      let include;
      if (includeAddress) {
        include = ['address'];
      }
      const location = await this.findOneByProp(
        { prop: Op.and, value: [{ latitude }, { longitude }] },
        include,
      );
      if (raiseError) {
        HttpError.throwErrorIfNull(location, 'Location not found');
      }

      return location;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(null, 'Could not find location record', 500);
    }
  }

  /**
   * @description creates a new location on the database if it does not exist
   * @param  {number} longitude The longitude of the location on the db
   * @param  {number} latitude The latitude of the location on the db
   * @returns {object} The new location datavalues
   */
  async createLocation(longitude: number, latitude: number) {
    try {
      const [newlocation, created] = await this.model.findOrCreate({
        where: { longitude, latitude },
        defaults: { longitude, latitude },
      });
      return newlocation.get();
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  async getLocationById(id: string) {
    try {
      const attributes = ['latitude', 'longitude'];
      const location = await this.findById(parseInt(id, 10), [], attributes);
      return location;
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }
}

const locationService = new LocationService(Location);
export default locationService;
