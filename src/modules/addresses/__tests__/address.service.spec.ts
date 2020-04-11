import AddressService, { addressService } from '../address.service';
import { Address, Location } from '../../../database';
import locationService from '../../locations/location.service';
import HttpError from '../../../helpers/errorHandler';
import bugsnagHelper  from '../../../helpers/bugsnagHelper';

describe(AddressService, () => {
  let mockAddress: any;

  beforeEach(() => {
    mockAddress = {
      get: () => ({
        id: 123,
        address: 'gsg45',
      }),
    };
    jest.spyOn(HttpError, 'throwErrorIfNull').mockReturnValue(null);
    jest.spyOn(bugsnagHelper, 'log');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe(AddressService.prototype.createNewAddress, () => {
    it('should create new address', async () => {
      const mockLocationModel = {
        longitude: 5677,
        latitude: 908998,
      };

      jest.spyOn(locationService, 'createLocation')
        .mockResolvedValue(mockLocationModel);
      jest.spyOn(Address, 'findOrCreate')
        .mockResolvedValue([mockAddress, true]);
      const newRecord = {
        isNewAddress: true,
      };
      const result = await addressService.createNewAddress(1.0, -1.0, 'Address');
      expect(locationService.createLocation).toHaveBeenCalledWith(1.0, -1.0);
      expect(Address.findOrCreate).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        { ...mockAddress.get(), ...newRecord, ...mockLocationModel },
      );
    });

    it('should raise error when having invalid parameters', async () => {
      jest.spyOn(locationService, 'createLocation')
        .mockRejectedValue('Could not create location');
      jest.spyOn(Address, 'create')
        .mockResolvedValue(mockAddress);
      await addressService.createNewAddress(1.0, null, 'Address');
      expect(locationService.createLocation).toHaveBeenCalledWith(1.0, null);
      expect(bugsnagHelper.log).toHaveBeenCalled();
      expect(HttpError.throwErrorIfNull)
        .toHaveBeenCalledWith(null, 'Could not create address', 500);
    });
  });

  describe(AddressService.prototype.updateAddress, () => {
    it('should update address model', async () => {
      const mockAddressModel = {
        get: () => ({
          address: 'newAddress',
          location: { longitude: -1.0, latitude: 1.0 },
        }),
      };
      jest.spyOn(Address, 'findOne').mockResolvedValue(mockAddressModel);
      jest.spyOn(Address, 'findByPk').mockResolvedValue(mockAddressModel);
      jest.spyOn(Address, 'update').mockResolvedValueOnce([, [mockAddressModel]]);

      const updatedAddress =  await addressService.updateAddress('address', -1, 1, 'newAddress');
      expect(updatedAddress.address).toEqual('newAddress');
      expect(updatedAddress.location.latitude).toEqual(1);
      expect(updatedAddress.location.longitude).toEqual(-1);
    });

    it('should raise error when having invalid parameters', async () => {
      jest.spyOn(addressService, 'update')
        .mockRejectedValue(null);
      await addressService.updateAddress('address', -1, 1, 'newAddress');
      expect(bugsnagHelper.log).toHaveBeenCalled();
      expect(HttpError.throwErrorIfNull)
        .toHaveBeenCalledWith(null, 'Could not update address record', 500);
    });
  });

  describe(AddressService.prototype.findAddress, () => {
    it('should find and return address', async () => {
      const value = {
        get: (plainProp = { plain: false }) => {
          if (plainProp.plain) {
            return { test: 'dummy data' };
          }
        },
      };
      jest.spyOn(Address, 'findOne').mockResolvedValue(value);
      const result = await addressService.findAddress('');
      expect(result).toEqual(value.get({ plain: true }));
    });
    it('should raise error when having invalid parameters', async () => {
      const value = { test: 'dummy data' };
      jest.spyOn(Address, 'findOne').mockRejectedValue(value);
      await addressService.findAddress('address');
      expect(bugsnagHelper.log).toHaveBeenCalled();
      expect(HttpError.throwErrorIfNull)
        .toHaveBeenCalledWith(null, 'Could not find address record', 404);
    });
    it('should get address when ID is passed', async () => {
      const result: any = await addressService.findAddressById(1);
      expect(result.address).toEqual('Andela Nairobi');
    });
  });
  describe(AddressService.prototype.getAddressesFromDB, () => {
    it('should return all addresses in the database', async () => {
      const value = [{
        get: () => {
          return { test: 'dummy data' };
        },
      }];
      jest.spyOn(Address, 'findAll').mockResolvedValue(value);
      jest.spyOn(Address, 'count').mockResolvedValue(5);
      const result = await addressService.getAddressesFromDB(1, 2);
      expect(result.rows)
        .toEqual(value.map((entry) => entry.get()));
    });
  });
  describe(AddressService.prototype.findOrCreateAddress, () => {
    beforeEach(() => {
      jest.spyOn(Address, 'findOrCreate').mockImplementation((value) => {
        const id = Math.ceil(Math.random() * 100);
        const newAddress = {
          get: () => ({ ...value.defaults, id }),
        };
        return [newAddress];
      });

      jest.spyOn(locationService, 'createLocation').mockImplementation((long, lat) => ({
        id: Math.ceil(Math.random() * 100),
        longitude: long,
        latitude: lat,
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should create a new address with supplied location', async () => {
      const testAddress = {
        address: 'Andela, Nairobi',
        location: {
          longitude: 100,
          latitude: 180,
        },
      };

      const result = await addressService.findOrCreateAddress(
        testAddress.address, testAddress.location,
      );

      expect(result.longitude).toEqual(100);
      expect(result.latitude).toEqual(180);
      expect(result.id).toBeDefined();
    });

    it('should not create location when location is not provided', async () => {
      const testAddress = {
        address: 'Andela, Nairobi',
      };
      const result = await addressService.findOrCreateAddress(testAddress.address, '');

      expect(result.id).toBeDefined();
      expect(result.longitude).toBeUndefined();
      expect(locationService.createLocation).toHaveBeenCalledTimes(0);
    });
  });
});

describe(AddressService.prototype.findCoordinatesByAddress, () => {
  beforeEach(() => {
    const addressCoords = {
      get: () => ({
        address: 'dummy',
        id: 1,
        location: {
          id: 1,
          longitude: 1.2222,
          latitude: 34.4444,
        },
      }),
    };
    jest.spyOn(Address, 'findOne').mockResolvedValue(addressCoords);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get location when address is requested', async () => {
    const result = await addressService.findCoordinatesByAddress('dummy');
    expect(result.address).toEqual('dummy');
    expect(result.location.latitude).toEqual(34.4444);
    expect(result.id).toBeDefined();
  });
});

describe(AddressService.prototype.findAddressByCoordinates, () => {
  let addressDetails: Location;
  beforeEach(() => {
    addressDetails = {
      id: 1,
      longitude: 1.2222,
      latitude: 34.4444,
      address: {
        id: 1,
        address: 'Sample Provider',
      },
    } as Location;
    jest.spyOn(locationService, 'findLocation').mockResolvedValue(addressDetails);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get address when coordinated are passed', async () => {
    const result = await addressService.findAddressByCoordinates(1.2343, -1.784);
    expect(result).toEqual(addressDetails.address);
  });
});

describe(AddressService.prototype.getAddressListByHomebase, () => {
  const addresses = [
    {
      get: (plainProp = { plain: false }) => {
        if (plainProp.plain) {
          return { address: 'address1' };
        }
      },
    },
    {
      get: (plainProp = { plain: false }) => {
        if (plainProp.plain) {
          return { address: 'address2' };
        }
      },
    },
  ];
  it('should return a list of addresses', async () => {
    jest.spyOn(Address, 'findAll').mockResolvedValue(addresses);
    const response = await addressService.getAddressListByHomebase('SomeHomebase');
    expect(response).toEqual(addresses.map((e) => e.get({ plain: true }).address));
  });
});
