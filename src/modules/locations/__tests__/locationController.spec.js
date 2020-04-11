import HttpError from '../../../helpers/errorHandler';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import locationController from '../locationController';
import locationService from '../location.service';
import {
  mockLocation
} from '../../../services/__mocks__';

describe('Test locationController', () => {
  const res = {
    status() {
      return this;
    },
    json() {
      return this;
    }
  };
  HttpError.sendErrorResponse = jest.fn();
  bugsnagHelper.log = jest.fn();
  beforeEach(() => {
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('test getLocation', () => {
    const newReq = {
      params: {
        id: 1
      }
    };
    const { params: { id } } = newReq;
    let getLocationSpy;
    beforeEach(() => {
      getLocationSpy = jest.spyOn(locationService, 'getLocationById');
    });

    it('returns a single location', async () => {
      getLocationSpy.mockResolvedValue(mockLocation);
      await locationController.getLocation(newReq, res);
      expect(locationService.getLocationById).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
