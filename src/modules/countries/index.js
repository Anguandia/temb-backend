import express from 'express';
import CountriesController from './countriesController';
import middlewares from '../../middlewares';

const {
  mainValidator, CountryValidator, TokenValidator, GeneralValidator
} = middlewares;
const countryRouter = express.Router();

countryRouter.use(
  '/countries',
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator),
);

/**
 * @swagger
 * /countries:
 *  post:
 *    summary: creates a new country
 *    tags:
 *      - Countries
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - name
 *          properties:
 *            name:
 *              type: string
 *    responses:
 *      201:
 *        description: country created successfully
 */
countryRouter.post(
  '/countries',
  CountryValidator.validateCountryReqBody,
  CountryValidator.validateCountryExistence,
  CountryValidator.setToActiveIfDeleted,
  CountriesController.addCountry
);

/**
 * @swagger
 * /countries:
 *  put:
 *    summary: updates a country
 *    tags:
 *      - Countries
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - newName
 *          properties:
 *            name:
 *              type: string
 *            newName:
 *              type: string
 *    responses:
 *      200:
 *        description: country updated successfully
 */
countryRouter.put(
  '/countries',
  CountryValidator.validateUpdateReqBody,
  CountryValidator.validateNamedCountryExists,
  CountryValidator.validateIfCountryNameIsTaken,
  CountriesController.updateCountry
);

/**
 * @swagger
 * /countries:
 *  delete:
 *    summary: deletes a country
 *    tags:
 *      - Countries
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - id
 *          properties:
 *            name:
 *              type: string
 *            id:
 *              type: number
 *    responses:
 *      200:
 *        description: country deleted successfully
 *      400:
 *        description: one of the required inputs is missing or invalid
 */
countryRouter.delete(
  '/countries',
  mainValidator('deleteDepartmentOrCountry', { params: false, body: true, query: false }),
  CountriesController.deleteCountry
);
/**
 * @swagger
 * /countries:
 *  get:
 *    summary: gets all countries
 *    tags:
 *      - Countries
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
 *    responses:
 *      200:
 *        description: success response object containing all found countries
 *      404:
 *        description: no countries found in the database
 */
countryRouter.get(
  '/countries',
  GeneralValidator.validateQueryParams,
  CountriesController.getAllCountries
);

export default countryRouter;
