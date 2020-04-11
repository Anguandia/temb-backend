import express from 'express';
import DepartmentsController from './DepartmentsController';
import middlewares from '../../middlewares';
import HomeBaseFilterValidator from '../../middlewares/HomeBaseFilterValidator';
import schemas, {
  updateDepartment,
  addDepartment,
  deleteDepartmentOrCountry,
  fetchDepartmentTrips
} from '../../middlewares/ValidationSchemas';

const departmentRouter = express.Router();
const { TokenValidator, mainValidator } = middlewares;
const { readDepartmentRecords } = schemas;

departmentRouter.use(
  '/departments',
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator),
);

/**
 * @swagger
 * /departments:
 *  put:
 *    summary: update department records
 *    tags:
 *      - Departments
 *    parameters:
 *      - id: path
 *      - name: body
 *      - headEmail: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: number
 *              description: The department Id
 *            headEmail:
 *              type: email
 *              description: The email for the head of department
 *            name:
 *              type: string
 *            headId:
 *              type: number
 *    responses:
 *      200:
 *        description: success response object
 */
departmentRouter.put(
  '/departments/:id',
  mainValidator(updateDepartment),
  DepartmentsController.updateDepartment
);

/**
 * @swagger
 * /departments:
 *  post:
 *    summary: add new deparments
 *    tags:
 *      - Departments
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - slackUrl
 *            - location
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              description: department head email address
 *              type: string
 *            slackUrl:
 *              type: string
 *            location:
 *              type: string
 *            homebaseId:
 *              type: number
 *              description: The homebase Id of the department
 *    responses:
 *      201:
 *        description: department created successfully
 */
departmentRouter.post(
  '/departments',
  mainValidator(addDepartment),
  DepartmentsController.addDepartment
);

/**
 * @swagger
 * /departments:
 *  get:
 *    summary: get all departments
 *    tags:
 *      - Departments
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
 *        description: success respoonse object containing all found departments
 *      404:
 *        description: no departments found on the database
 */
departmentRouter.get(
  '/departments',
  mainValidator(readDepartmentRecords),
  DepartmentsController.readRecords
);

/**
 * @swagger
 * /departments:
 *  delete:
 *    summary: delete a department
 *    tags:
 *      - Departments
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - id
 *            - name
 *          properties:
 *            id:
 *              type: number
 *            name:
 *              type: string
 *    responses:
 *      200:
 *        description: department deleted successfully
 *      400:
 *        description: one of the required inputs is missing or invalid
 */
departmentRouter.delete(
  '/departments',
  mainValidator(deleteDepartmentOrCountry),
  DepartmentsController.deleteRecord
);

/**
 * @swagger
 * /departments/trips:
 *  post:
 *    summary: fetch department trips with analytics data
 *    tags:
 *      - Departments
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
 *          properties:
 *            startDate:
 *              type: string
 *            endDate:
 *              type: string
 *            departments:
 *              description: array of departments
 *              type: array
 *    responses:
 *      200:
 *        description: department trips fetched successfully
 */
departmentRouter.post(
  '/departments/trips',
  mainValidator(fetchDepartmentTrips),
  HomeBaseFilterValidator.validateHomeBaseAccess,
  DepartmentsController.fetchDepartmentTrips
);

export default departmentRouter;
