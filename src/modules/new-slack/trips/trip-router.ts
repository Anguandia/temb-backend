import UserTripBookingController from './user/user-trip-booking-controller';
import UserTripEditController from './user/user-trip-edit-controller';
import ItineraryController from './user/itinerary.controller';
import userTripActions, { itineraryActions } from './user/actions';
import userTripBlocks, { itineraryBlocks } from './user/blocks';
import SlackMessageAdapter from '@slack/interactive-messages/dist/adapter';
import { managerTripBlocks } from './manager/constants';
import TripController from './manager/trip.controller';
import userTripController from './user/trip.controller';
import TravelTripsActions from './travel/actions';
import travelTripBlocks from './travel/blocks';
import TravelTripController from './travel/travel.controller';
import availableRouteController from '../routes/user/seeAvailableRoute.controller';
import userRouteActions from '../routes/actions';
import userRouteBlocks from '../routes/blocks';
import SlackInteractions from '../../slack/SlackInteractions';
import JoinRouteController from '../routes/user/joinRoute.controller';
import RouteLocationController from '../routes/user/routeLocation.controller';
import RouteInputHandlers from '../../slack/RouteManagement/RouteInputHandler';

const userTripRoutes = [
  // TRIP BOOKING STARTS HERE
  {
    route: { actionId: userTripActions.scheduleATrip, blockId: userTripBlocks.start },
    handler: UserTripBookingController.startTripBooking,
  },
  {
    route: { actionId: userTripActions.forMe, blockId: userTripBlocks.start },
    handler: UserTripBookingController.forMe,
  },
  {
    route: { actionId: userTripActions.forSomeone, blockId: userTripBlocks.start },
    handler: UserTripBookingController.forMe,
  },
  {
    route: { actionId: userTripActions.back, blockId: userTripBlocks.navBlock },
    handler: UserTripBookingController.back,
  },
  {
    route: { actionId: userTripActions.cancel },
    handler: UserTripBookingController.cancel,
  },
  {
    route: { actionId: userTripActions.setPassenger, blockId: userTripBlocks.setRider },
    handler: UserTripBookingController.saveRider,
  },
  {
    route: { actionId: userTripActions.addExtraPassengers, blockId: userTripBlocks.addPassengers },
    handler: UserTripBookingController.saveExtraPassengers,
  },
  {
    route: { actionId: userTripActions.noPassengers, blockId: userTripBlocks.addPassengers },
    handler: UserTripBookingController.saveExtraPassengers,
  },
  {
    route: { blockId: userTripBlocks.selectDepartment },
    handler: UserTripBookingController.saveDepartment,
  },
  {
    route: { actionId: userTripActions.sendDest, blockId: userTripBlocks.getDestFields },
    handler: UserTripBookingController.sendDestinations,
  },
  {
    route: { actionId: userTripActions.sendDestEdit, blockId: userTripBlocks.getDestFields },
    handler: UserTripBookingController.sendDestinations,
  },
  {
    route: { blockId: userTripBlocks.confirmLocation },
    handler: UserTripBookingController.confirmLocation,
  },
  {
    route: { actionId: userTripActions.confirmTripRequest, blockId: userTripBlocks.confirmTrip },
    handler: UserTripBookingController.confirmTripRequest,
  },
  {
    route: { actionId: userTripActions.cancelTripRequest, blockId: userTripBlocks.confirmTrip },
    handler: UserTripBookingController.cancel,
  },
  {
    route: { actionId: userTripActions.editTripRequest, blockId: userTripBlocks.confirmTrip },
    handler: UserTripEditController.editRequest,
  },
  // TRIP BOOKING ENDS HERE

  // TRIP ITINERARY STARTS HERE
  {
    route: { actionId: itineraryActions.viewTripsItinerary, blockId: userTripBlocks.start },
    handler: ItineraryController.start,
  },
  {
    route: { actionId: itineraryActions.pastTrips, blockId: itineraryBlocks.start },
    handler: ItineraryController.getPast,
  },
  {
    route: { actionId: itineraryActions.upcomingTrips, blockId: itineraryBlocks.start },
    handler: ItineraryController.getUpcoming,
  },
  {
    route: {
      actionId: new RegExp(`^(${itineraryActions.reschedule}|${itineraryActions.cancelTrip})_\\d+$`, 'g'),
      blockId: new RegExp(`^${itineraryBlocks.tripActions}_\\d+$`, 'g'),
    },
    handler: ItineraryController.handleRescheduleOrCancel,
  },
  {
    route: {
      actionId: new RegExp(`^${itineraryActions.page}_\\d+$`, 'g'),
      blockId: itineraryBlocks.pagination,
    },
    handler: ItineraryController.nextOrPrevPage,
  },
  {
    route: { actionId: itineraryActions.skipPage, blockId: itineraryBlocks.pagination },
    handler: ItineraryController.skipPage,
  },
  // TRIP ITINERARY ENDS HERE

  // MANAGER APPROVE OR DECLINE A TRIP ACTIVITIES
  {
    route: { blockId: managerTripBlocks.confirmTripRequest },
    handler: TripController.approve,
  },

  // CHANGE LOCATION
  {
    route: { actionId: userTripActions.changeLocation },
    handler: userTripController.changeLocation,
  },
  {
    route: { actionId: TravelTripsActions.changeLocation },
    handler: userTripController.changeLocation,
  },
  {
    route: { blockId: userTripBlocks.selectLocation },
    handler: userTripController.selectLocation,
    // MANAGER APPROVE OR DECLINE A TRIP ACTIVITIES
  },
  // TRAVEL TRIP STARTS HERE
  {
    route: { actionId: TravelTripsActions.airportTransfer, blockId: travelTripBlocks.start },
    handler: TravelTripController.createTravel.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.editTravel },
    handler: TravelTripController.createTravel.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.cancel, blockId: travelTripBlocks.start },
    handler: TravelTripController.cancel.bind(TravelTripController),
  },
  {
    route: {
      actionId: TravelTripsActions.cancelTravelTripRequest,
      blockId: travelTripBlocks.confirmTravelTrip,
    },
    handler: TravelTripController.cancel.bind(TravelTripController),
  },
  {
    route: { blockId: travelTripBlocks.bookedTrip },
    handler: TravelTripController.handleItineraryActions.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.cancel, blockId: travelTripBlocks.bookedTrip },
    handler: TravelTripController.cancel.bind(TravelTripController),
  },
  {
    route: { blockId: travelTripBlocks.viewTrip },
    handler: TravelTripController.doneViewingTrip.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.changeLocation, blockId: travelTripBlocks.start },
    handler: TravelTripController.changeLocation.bind(TravelTripController),
  },
  {
    route: { blockId: travelTripBlocks.selectLocation },
    handler: TravelTripController.selectLocation.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.back, blockId: travelTripBlocks.navBlock },
    handler: TravelTripController.back.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.embassyVisit, blockId: travelTripBlocks.start },
    handler: TravelTripController.createTravel.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.editEmbassyVisit },
    handler: TravelTripController.createTravel.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.confirmTravel, blockId: travelTripBlocks.confirmTrip },
    handler: TravelTripController.confirmRequest.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.addNote, blockId: travelTripBlocks.confirmTrip },
    handler: TravelTripController.addTripNotes.bind(TravelTripController),
  },
  {
    route: { actionId: TravelTripsActions.cancel, blockId: travelTripBlocks.confirmTrip },
    handler: TravelTripController.cancel.bind(TravelTripController),
  },
  {
    route: {
      actionId: TravelTripsActions.submitDestination,
      blockId: travelTripBlocks.confirmLocation,
    },
    handler: TravelTripController.getLocationInfo.bind(TravelTripController),
  },
  // TRAVEL TRIP ENDS HERE

  // ROUTE STARTS HERE
  {
    route: {
      actionId: userRouteActions.showAvailableRoutes,
      blockId: userRouteBlocks.availableRoutes,
    },
    handler: availableRouteController.seeAvailableRoutes,
  },
  {
    route: { actionId: userRouteActions.back, blockId: userRouteBlocks.navBlock },
    handler: SlackInteractions.launch,
  },
  {
    route: {
      actionId: new RegExp(`^${userRouteActions.userJoinRoute}_\\d+$`, 'g'),
      blockId: new RegExp(`^${userRouteBlocks.joinRouteBlock}_\\d+$`, 'g'),
    },
    handler: JoinRouteController.joinARoute,
  },
  {
    route: { actionId: userRouteActions.confirmJoining, blockId: userRouteBlocks.confirmRoute },
    handler: JoinRouteController.confirmJoiningRoute,
  },
  {
    route: { actionId: userRouteActions.searchPopup, blockId: userRouteBlocks.searchRouteBlock },
    handler: availableRouteController.searchRoute,
  },
  {
    route: {
      actionId: new RegExp(`^${userRouteActions.page}_\\d+$`, 'g'),
      blockId: userRouteBlocks.pagination,
    },
    handler: availableRouteController.seeAvailableRoutes,
  },
  {
    route: { actionId: userRouteActions.skipPage, blockId: userRouteBlocks.pagination },
    handler: availableRouteController.skipPage,
  },
  {
    route: { blockId: userRouteBlocks.confirmLocation },
    handler: RouteLocationController.confirmLocation,
  },
  {
    route: { actionId: userRouteActions.confirmLocation,
      blockId: userRouteBlocks.confirmHomeLocation },
    handler: RouteInputHandlers.handleBusStopRoute,
  },
  // ROUTE ENDS HERE
];

export default (slackRouter: SlackMessageAdapter) => {
  userTripRoutes.forEach((route) => {
    slackRouter.action(route.route, route.handler);
  });
};
