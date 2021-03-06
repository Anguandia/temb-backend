import { homebaseService } from '../modules/homebases/homebase.service';
import Homebase from '../database/models/homebase';
import Country from '../database/models/country';


export const homeBaseModelHelper = () => {
  const homeBaseInclude = {
    model: Homebase,
    as: 'homebase',
    attributes: ['id', 'name'],
    include: [{ model: Country, as: 'country', attributes: ['name', 'id', 'status'] }],

  };
  return homeBaseInclude;
};

class HomeBaseHelper {
  /**
   * @description This middleware checks if the HomeBase ID is valid
   * @param  {number} id The id of the homeBase
   * @return {any} A boolean value
   */
  static async checkIfHomeBaseExists(id) {
    const homeBase = await homebaseService.getById(id);
    return homeBase;
  }
}
export default HomeBaseHelper;
