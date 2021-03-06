import { Router } from 'express';
import middlewares from '../../middlewares';
import TripsController from './TripsController';
import HomeBaseFilterValidator from '../../middlewares/HomeBaseFilterValidator';


const { TripValidator, TokenValidator, GeneralValidator, } = middlewares;

const tripsRouter = Router();

tripsRouter.use('/trips',
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator));

/**
 * @swagger
 * /trips:
 *  get:
 *    summary: fetch all trips
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: page
 *        in: query
 *        required: false
 *        description: page number (defaults to **1**)
 *        type: number
 *      - name: size
 *        in: query
 *        required: false
 *        description: number of items per page
 *        type: number
 *      - name: status
 *        in: query
 *        required: false
 *        description: trip status
 *        type: string
 *        enum:
 *          - Pending
 *          - Approved
 *          - Confirmed
 *      - name: department
 *        in: query
 *        required: false
 *        description: department of the trip taker
 *        type: string
 *      - name: departureTime
 *        in: query
 *        required: false
 *        description: format - before:YYYY-MM-DD;after:YYYY-MM-DD (example - before:2018-12-30;after:2018-01-01)
 *        example: before:2018-12-30;after:2018-01-01
 *        type: string
 *      - name: requestedOn
 *        in: query
 *        required: false
 *        description: format - before:YYYY-MM-DD;after:YYYY-MM-DD
 *        type: string
 *      - name: type
 *        in: query
 *        required: false
 *        description: type of trip
 *        type: string
 *        enum:
 *          - Regular Trip
 *          - Airport Transfer
 *          - Embassy Visit
 *      - name: searchterm
 *        in: query
 *        required: false
 *        description: filters trips by requester, rider, origin and destination
 *        type: string
 *    responses:
 *      200:
 *        description: response object containing all trips from the database
 */
tripsRouter.get(
  '/trips',
  TripValidator.validateGetTripsParam,
  HomeBaseFilterValidator.validateHomeBaseAccess,
  TripsController.getTrips
);

/**
 * @swagger
 * /trips/{tripId}:
 *  put:
 *    summary: updates trip status
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: tripId
 *        in: path
 *        required: true
 *        description: id of trip to be updated
 *        type: number
 *      - name: action
 *        in: query
 *        required: true
 *        type: string
 *        enum:
 *          - "confirm"
 *          - "decline"
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - slackUrl
 *            - comment
 *          properties:
 *            slackUrl:
 *              type: string
 *              example: andela-tembea.slack.com
 *            comment:
 *              type: string
 *            providerId:
 *              type: number
 *              description: This is required when "action" is "confirm"
 *    responses:
 *      200:
 *        description: trip confirmed or trip declined
 */
tripsRouter.put(
  '/trips/:tripId',
  TripValidator.validateAll,
  TripsController.updateTrip
);

/**
 * @swagger
 * /trips/travel:
 *  post:
 *    summary: fetch travel trips for specified period by department
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - startDate
 *            - endDate
 *            - departmentList
 *          properties:
 *            startDate:
 *              type: string
 *            endDate:
 *              type: string
 *            departmentList:
 *              description: array of departments
 *              type: array
 *    responses:
 *      200:
 *        description: travel trips fetched successfully
 *      400:
 *        description: bad format  request body parameters
 */
tripsRouter.post(
  '/trips/travel',
  HomeBaseFilterValidator.validateHomeBaseAccess,
  TripValidator.validateTravelTrip,
  TripsController.getTravelTrips
);

/**
 * @swagger
 * /trips/routetrips:
 *  post:
 *    summary: fetch route trips for a specified period
 *    deprecated: true
 *    tags:
 *      - Trips
 *    parameters:
 *      - name: page
 *        in: query
 *        required: false
 *      - name: size
 *        in: query
 *        required: false
 *    responses:
 *      200:
 *        description: route trips fetched successfully
 *      400:
 *        description: bad request
 */
tripsRouter.get(
  '/trips/routetrips',
  HomeBaseFilterValidator.validateHomeBaseAccess,
  GeneralValidator.validateQueryParams,
  TripsController.getRouteTrips
);

export default tripsRouter;
