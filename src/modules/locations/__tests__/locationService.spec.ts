import locationService from '../location.service';
import Location from '../../../database/models/location';
import BugsnagHelper from '../../../helpers/bugsnagHelper';

describe('locationservice', () => {
  let findLocationSpy: any;
  let findOrCreateLocationSpy: any;
  const mockLocationData = {
    get: (plainProp = { plain: false }) => {
      if (plainProp.plain) {
        return { id: 1, longitude: -1.2345, latitude: 1.5673 };
      }
    },
  };

  beforeEach(() => {
    findLocationSpy = jest.spyOn(Location, 'findOne');
    findOrCreateLocationSpy = jest.spyOn(Location, 'findOrCreate');
  });
  describe('findLocation', () => {
    it('should raise error when having invalid parameters', async () => {
      findLocationSpy.mockRejectedValue(new Error('Error'));
      try {
        await locationService.findLocation(1, 1, true, true);
      } catch (error) {
        expect(error.message).toBe('Could not find location record');
      }
    });

    it('should find location', async () => {
      findLocationSpy.mockResolvedValue(mockLocationData);
      const result = await locationService.findLocation(1, 1, true, true);
      expect(result).toEqual(mockLocationData.get({ plain: true }));
      expect(Location.findOne).toHaveBeenCalled();
    });
  });
  describe('createLocation', () => {
    const mockReturnedValue = { dataValues: mockLocationData };

    it('should create a new loaction', async () => {
      findOrCreateLocationSpy.mockResolvedValue([mockReturnedValue]);
      await locationService.createLocation(
        mockLocationData.get({ plain: true }).longitude,
        mockLocationData.get({ plain: true }).latitude,
      );
      expect(Location.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
    });
    it('should throw error', async () => {
      findOrCreateLocationSpy.mockRejectedValue(new Error('Error Message'));
      jest.spyOn(BugsnagHelper, 'log');
      await locationService.createLocation(
        mockLocationData.get({ plain: true }).longitude, null,
      );
      expect(Location.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
