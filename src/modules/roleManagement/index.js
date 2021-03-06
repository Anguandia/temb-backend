import express from 'express';
import RoleManagementController from './RoleManagementController';
import middlewares from '../../middlewares';
import HomebaseValidator from '../../middlewares/HomebaseValidator';

const roleManagementRouter = express.Router();
const { TokenValidator, UserValidator } = middlewares;
const userRoleHandler = [
  TokenValidator.attachJwtSecretKey.bind(TokenValidator),
  TokenValidator.authenticateToken.bind(TokenValidator),
  TokenValidator.validateRole.bind(TokenValidator),
];
/**
 * @swagger
 * /roles/user:
 *  post:
 *    summary: assign role to user
 *    description: only **Super Admins** can make use of this route
 *    tags:
 *      - Roles
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - roleName
 *            - homebaseId
 *          properties:
 *            email:
 *              type: string
 *            roleName:
 *              type: string
 *            homebaseId:
 *              type: number
 *    responses:
 *      200:
 *        description: successfully assigned role to user
 *      401:
 *        description: API requester not authenticated or not a super admin
 *      404:
 *        description: Role or User not found. (_Role should be "Admin"_ & _User email address must already exist on the app_)
 */
roleManagementRouter.post(
  '/roles/user',
  ...userRoleHandler,
  UserValidator.validateAssignRole,
  HomebaseValidator.validateHomeBaseExists,
  RoleManagementController.assignRoleToUser
);

/**
 * @swagger
 * /roles/user:
 *  get:
 *    summary: get a user's role
 *    tags:
 *      - Roles
 *    parameters:
 *      - name: email
 *        in: query
 *        required: true
 *        description: email of user to check
 *        type: string
 *    responses:
 *      200:
 *        description: response object containing user info
 *      400:
 *        description: provide email address not valid
 *      404:
 *        description: user with the specified email has no role or user not found
 */
roleManagementRouter.get(
  '/roles/user',
  ...userRoleHandler,
  UserValidator.getUserRoles,
  RoleManagementController.readUserRole
);

/**
 * @swagger
 * /roles:
 *  post:
 *    summary: create a new role
 *    tags:
 *      - Roles
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - roleName
 *            - homebaseId
 *          properties:
 *            roleName:
 *              type: string
 *          homebaseId:
 *              type: number
 *    responses:
 *      200:
 *        description: new role successfully created
 *      400:
 *        description: no roleName provided
 */
roleManagementRouter.post(
  '/roles',
  ...userRoleHandler,
  UserValidator.validateNewRole,
  RoleManagementController.newRole
);

/**
 * @swagger
 * /roles:
 *  get:
 *    summary: get all available roles
 *    tags:
 *      - Roles
 *    responses:
 *      200:
 *        description: response object containing all available roles on the application
 */
roleManagementRouter.get(
  '/roles',
  ...userRoleHandler,
  RoleManagementController.readRoles
);

roleManagementRouter.delete(
  '/roles/user/:userId',
  ...userRoleHandler,
  RoleManagementController.removeUserToRole
);
export default roleManagementRouter;
