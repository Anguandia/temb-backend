import { Op } from 'sequelize';
import database, { Address, Location } from '../../database';
import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import locationService from '../locations/location.service';
import Homebase from '../../database/models/homebase';
import { BaseService } from '../shared/base.service';
import { homebaseService } from '../homebases/homebase.service';

export default class AddressService extends BaseService<Address, number> {
  constructor(model = database.getRepository(Address)) {
    super(model);
  }
  /**
   * @description Get the address by address from the database
   * @param  {string} address The address of the address on the db
   * @returns {object} The http response object
   */
  async findAddress(address: string) {
    try {
      const place = await this.findOneByProp({ prop: 'address', value: address }, ['location']);
      return place;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(null, 'Could not find address record', 404);
    }
  }
  async findAddressByCoordinates(longitude: number, latitude:number) {
    const location = await locationService.findLocation(longitude, latitude, false, true);
    if (location) return location.address as Address;
  }

  async findOrCreateAddress(address:string, location?: any) {
    let theLocation: {
      id?: number,
      longitude?: number;
      latitude?: number;
    } = {};
    if (location) {
      theLocation = await locationService.createLocation(
        location.longitude, location.latitude,
      );
    }
    const { data } = await this.findOrCreate(address, theLocation.id);

    return {
      ...data,
      longitude: theLocation.longitude,
      latitude: theLocation.latitude,
    };
  }

  async findOrCreate(address: string, locationId: number) {
    const result = await this.model.findOrCreate({
      where: {
        address: { [Op.iLike]: `${address}%` },
      },
      defaults: { address, locationId },
    });
    const [data, created] = result;
    return { created, data: data.get() as Address };
  }

  /**
   * @description Saves the new address and location record
   * @param  {number} longitude The longitude of the location
   * @param  {number} latitude The latitude of the location
   * @param  {string} address The address of thr location
   * @returns {object} The newly created address and location info
   */
  async createNewAddress(longitude: number, latitude: number, address: string) {
    try {
      const location = await locationService.createLocation(longitude, latitude);
      const { data, created } = await this.findOrCreate(address, location.id);
      const newAddressData = {
        id: data.id,
        address: data.address,
        longitude: location.longitude,
        latitude: location.latitude,
        isNewAddress: created,
      };
      return newAddressData;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(null, 'Could not create address', 500);
    }
  }

  /**
   * @description updates address and location record
   * @param  {string} address The address to be updated
   * @param  {string} newAddress The new address
   * @param  {number} newLongitude The new longitude of the location
   * @param  {number} newLatitude The new latitude of the location
   * @returns {object} The newly created address and location info
   */
  async updateAddress(address: string, newLongitude: number,
    newLatitude: number, newAddress: string) {
    try {
      const addressData = await this.findAddress(address);
      const { id: locationId } = await locationService.createLocation(
        newLongitude || addressData.location.get('longitude'),
        newLatitude || addressData.location.get('latitude'));

      const updated = await this.update(addressData.id, {
        locationId,
        address: (newAddress || addressData.address).trim(),
      }, {
        returning: true,
        include: ['location'],
      });

      return updated as Address;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(null, 'Could not update address record', 500);
    }
  }

  /**
   * @description Get's paginated address records from db
   * @param  {number} size The size of a single page
   * @param  {number} page The page number
   * @returns {object} An array of addresses
   */
  async getAddressesFromDB(size: number, page: number) {
    const {
      pageMeta: { count, totalPages },
      data,
     } = await this.getPaginated({
       page,
       limit: size,
       defaultOptions: {
         include: ['location'],
         order: [['id', 'DESC']],
       },
     });
    return { count, totalPages, rows: data };
  }

  /**
   * @description Get's coordinates records from db using address
   * @param  {string} address The address of the location
   * @returns {object} An array of addresses
   */
  async findCoordinatesByAddress(address: string) {
    const addressCoords = await this.findOneByProp(
      { prop: 'address', value: address }, ['location']);
    return addressCoords;
  }

  async getAddressListByHomebase(homebaseName: string) {
    const addressesList = await this.findAll({
      where: { isDefault: true },
      include: [{
        model: Homebase,
        where: { name: { [Op.iLike]: `%${homebaseName}%` } },
        attributes: [],
      }],
      attributes: ['address'],
    }).then((addresses) => addresses.map((a) => a.address));
    return addressesList;
  }

  async searchAddressListByHomebase(homebase: string, searchKey: string) {
    const addressesList = await this.findAll({
      where: { isDefault: true, address: { [Op.iLike]: `%${searchKey}%` } },
      include: [{
        model: Homebase,
        where: { name: { [Op.iLike]: `%${homebase}%` } },
      }],
      attributes: ['address'],
    }).then((addresses) => addresses.map((a) => a.address));
    return addressesList;
  }

  async findAddressIfExists(addressToCheck: string) {
    const listOfPosssibleAddresses = await Address.findAll({
      where: {
        address: {
          [Op.like]: `%${homebaseService.formatName(addressToCheck)}%`,
        },
      },
      include: [{
        model: Location,
        attributes: ['latitude', 'longitude'],
      }],
    });
    return listOfPosssibleAddresses;
  }

  async findAddressById(id: number) {
    const includeLocation = {
      model: Location,
      attributes: ['latitude', 'longitude'],
    };
    const address = await this.findById(id, [includeLocation], ['address']);
    return address;
  }
}

export const addressService = new AddressService();
