import express from 'express';
import LocationController from './locationController';
import middlewares from '../../middlewares';

const {
  TokenValidator, GeneralValidator,
} = middlewares;
const locationRouter = express.Router();

locationRouter.use(
  '/locations',
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator),
);

/**
 * @swagger
 * /locations:
 *  get:
 *    summary: get location by ID
 *    tags:
 *      - Location
 *    parameters:
 *      - name: page
 *        in: query
 *        required: false
 *        description: page number
 *        type: number
 *      - name: size
 *        in: query
 *        required: false
 *        description: number of items per page
 *        type: number
 *      - name: country
 *        in: query
 *        required: false
 *        description: country name
 *        type: string
 *      - name: name
 *        in: query
 *        required: false
 *        description: name of location
 *        type: string
 *    responses:
 *      200:
 *        description: success response object containing location object
 *      404:
 *        description: no location found on the database
 */
locationRouter.get(
  '/locations/:id',
  GeneralValidator.validateQueryParams,
  LocationController.getLocation,
);

export default locationRouter;
