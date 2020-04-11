import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import SlackInteractionsHelpers from '../SlackInteractionsHelpers';
import OpsTripActions from '../../../TripManagement/OpsTripActions';
import OpsDialogPrompts from '../../../SlackPrompts/OpsDialogPrompts';
import tripService from '../../../../trips/trip.service';
import { mockWhatsappOptions } from '../../../../../modules/notifications/whatsapp/twilio.mocks';

mockWhatsappOptions();

describe('SlackHelpers', () => {
  let payload;
  beforeEach(() => {
    payload = {
      actions: [{
        value: '123'
      }]
    };
  });

  describe('handleOpsSelectAction', () => {
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValue('token');
    jest.spyOn(OpsTripActions, 'sendUserCancellation').mockReturnValue({});
    jest.spyOn(OpsDialogPrompts, 'selectDriverAndCab').mockResolvedValue({});
    jest.spyOn(SlackInteractionsHelpers, 'handleSelectProviderAction').mockReturnValue({});

    it('should send  User Cancellation notification', async () => {
      jest.spyOn(tripService, 'getById').mockReturnValue({ tripStatus: 'Cancelled' });
      await SlackInteractionsHelpers.handleOpsSelectAction('Cancelled', 1, 'TEAM', 'UGHA',
        2, '1223453', payload);
      expect(OpsTripActions.sendUserCancellation).toBeCalled();
    });

    it('should send selectDriverAndCab dialog', async () => {
      jest.spyOn(tripService, 'getById').mockReturnValue({ tripStatus: 'Confirmed' });
      await SlackInteractionsHelpers.handleOpsSelectAction('assignCab', 1, 'TEAM', 'UGHA',
        2, '1223453', payload);
      expect(OpsDialogPrompts.selectDriverAndCab).toBeCalled();
    });

    it('should call handle Select ProviderAction', async () => {
      jest.spyOn(tripService, 'getById').mockReturnValue({ tripStatus: 'Confirmed' });
      await SlackInteractionsHelpers.handleOpsSelectAction('assignProvider', 1, 'TEAM', 'UGHA',
        2, '1223453', payload);
      expect(SlackInteractionsHelpers.handleSelectProviderAction).toBeCalled();
    });
  });
});
