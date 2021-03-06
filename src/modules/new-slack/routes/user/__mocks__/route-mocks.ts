import { PagedResult } from '../../../../shared/base.service';
import { RouteBatch } from '../../../../../database';

export const routeData: RouteBatch = {
  id: 59,
  inUse: 1,
  takeOff: '01:30',
  batch: 'A',
  capacity: 4,
  status: 'Active',
  routeId: 59,
  cabId: 1,
  driverId: 1,
  homebaseId: 2,
  providerId: 7,
  cabDetails:
  { id: 1,
    regNumber: 'KCX 505',
    capacity: '4',
  },
  route:
  { id: 59,
    name: 'Road 5',
    imageUrl: null,
    destinationId: 72,
    homebaseId: 2,
  },
  driver:
  { id: 1,
    driverName: 'Eric driver',
    driverPhoneNo: '33134',
    driverNumber: '99408',
    providerId: 7,
    userId: 12,
  },
  riders: [],
};

export const routesMock: PagedResult<RouteBatch> = {
  data: [routeData],
  pageMeta: { totalPages: 3, limit: 10, count: 25, page: 1 },
};
export const notFoundRoutes: PagedResult<RouteBatch> = { data: {} };

export const token = 'xoxb-795661858933-795210869172-292pMtSStjoVFpkwqcpts1f0';
export const payload = { type: 'block_actions',
  team: { id: 'TPDKFR8TF', domain: 'tembeaherve' },
  user:
  { id: 'UP0RTRL02',
    username: 'herve.nkurikiyimfura',
    name: 'herve.nkurikiyimfura',
    team_id: 'TPDKFR8TF' },
  api_app_id: 'AP76LSN9F',
  token: 'X1Mdhs51tctJfA5b8kbCCBro',
  container:
  { type: 'message',
    message_ts: '1578318174.000100',
    channel_id: 'CP256NYAF',
    is_ephemeral: true },
  trigger_id: '882339353538.795661858933.f3e76c3ad7471266f0f4ce5e6e352512',
  channel: { id: 'CP256NYAF', name: 'tembea' },
  response_url:
   'https://hooks.slack.com/actions/TPDKFR8TF/882339353378/m2uRREOKWd12SiSlftnXhtqa',
  actions:
  [{ action_id: 'user_route_skip_page',
    block_id: 'user_route_pagination',
    text: [Object],
    value: 'availableRoutes',
    style: 'primary',
    type: 'button',
    action_ts: '1578336458.348057' }] };

export const state = 'https://hooks.slack.com/actions/TPDKFR8TF/884085122337/swdPpUnPeLaFUV905q73HuvM';

export const joinRequest = {
  manager: { id: 12,
    name: 'Hervera',
    slackId: 'UP0RTRL02',
    email: 'herve.nkurikiyimfura@andela.com',
    homebaseId: 2,
    createdAt: '2019 - 11 - 05',
    updatedAt: '2019 - 11 - 05',
    homebase:
    { id: 2,
      name: 'Nairobi',
      channel: 'CQBAAEZ42',
      countryId: 2,
      addressId: 1,
      locationId: 39,
      currency: 'KES',
      createdAt: '2019 - 11 - 05',
      updatedAt: '2019 - 11 - 05',
    },
  },
  startDate: '21/11/2018',
  endDate: '21/11/2022',
  partnerStatus: 'Microsoft Technology',
};

export const routeBatch = {
  id: 59,
  inUse: 1,
  takeOff: '01:30',
  batch: 'A',
  capacity: 4,
  comments: null,
  status: 'Active',
  routeId: 59,
  cabId: 1,
  driverId: 1,
  homebaseId: 2,
  providerId: 7,
  createdAt: '2019-12-11',
  updatedAt: '2019-12-12',
  riders: [],
  cabDetails:{
    id: 1,
    regNumber: 'KCX 505',
    capacity: '4',
    model: 'motor',
    providerId: 7,
    createdAt: '2019-12-11',
    updatedAt: '2019-12-12',
  },
  driver:{
    id: 1,
    driverName: 'Eric driver',
    driverPhoneNo: '33134',
    driverNumber: '99408',
    providerId: 7,
    userId: 12,
    createdAt: '2019-12-11',
    updatedAt: '2019-12-12',
    user: [Object],
  },
  route: {
    id: 59,
    name: 'kisumu12',
    imageUrl: 'https://snazzy-maps-cdn.azureedge.net/assets/127403-no-label-bright-colors.png?v=00010101120000',
    destinationId: 74,
    homebaseId: 2,
    createdAt: '2019-12-11',
    updatedAt: '2019-12-12',
    destination: [Object],
  },
  homebase: { id: 2, name: 'Nairobi', country: [Object] },
  engagement:{
    fellow: {
      id: 12,
      name: 'Hervera',
      slackId: 'UP0RTRL02',
      email: 'herve.nkurikiyimfura@andela.com',
      homebaseId: 2,
      createdAt: '2019-11-05',
      updatedAt : '2019-12-17',
      homebase : [Object] },
    partner: { name: 'Pepsi Kenya',
    },
    workHours: '20:00 - 00:00',
    startDate: '2018-11-20',
    endDate: '2022-11-20',
  },
};
