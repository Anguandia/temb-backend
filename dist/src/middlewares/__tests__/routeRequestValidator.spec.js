"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RouteRequestValidator_1 = __importDefault(require("../RouteRequestValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
describe('RouteRequestValidator', () => {
    describe('validateParams', () => {
        const res = {
            status: () => ({
                json: () => { }
            })
        };
        const next = jest.fn();
        beforeEach(() => {
            jest.spyOn(res, 'status');
        });
        it('should return 400 when requestId is not a number', () => {
            const req = {
                params: {
                    requestId: 'sd'
                }
            };
            RouteRequestValidator_1.default.validateParams(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).toHaveBeenCalledTimes(0);
        });
        it('should return status 400 requesting for URL query', () => {
            const req = {};
            RouteRequestValidator_1.default.validateRatingsStartEndDateAndLocalCountry(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).toHaveBeenCalledTimes(0);
        });
        it('should respond with invalid slackURL', () => {
            const req = {
                params: {
                    routeId: 1
                },
                body: {
                    newOpsStatus: 'decline',
                    comment: 'some comment',
                    teamUrl: 'stuffslack.com'
                }
            };
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(next).toHaveBeenCalledTimes(0);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
        });
        it('should call validateRouteStatus', () => {
            const req = {
                params: {
                    routeId: 1
                },
                body: {
                    newOpsStatus: 'approve',
                    comment: 'some comment',
                    teamUrl: 'stuff.slack.com',
                    routeName: 'sample route',
                    takeOff: '10:00',
                    provider: {
                        id: 1,
                        name: 'Andela Kenya',
                        providerUserId: 15,
                        isDirectMessage: true,
                        user: {}
                    }
                }
            };
            jest.spyOn(RouteRequestValidator_1.default, 'validateParams');
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('validateRequestBody', () => {
        const next = jest.fn();
        const res = {
            status: () => ({
                json: () => { }
            })
        };
        beforeEach(() => {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
        });
        it('should respond with a 400 status code when some properties are missing', () => {
            const req = {
                params: {
                    requestId: 1
                },
                body: {
                    comment: 'some comment'
                }
            };
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
        });
        it('should validate request body for approval request', () => {
            const req = {
                params: {
                    requestId: 1
                },
                body: {
                    newOpsStatus: 'approve',
                    comment: 'some comment'
                }
            };
            jest.spyOn(res, 'status');
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(res.status).toBeCalledWith(400);
        });
        it('should call next middleware if checks passed', () => {
            const req = {
                params: {
                    requestId: 1
                },
                body: {
                    newOpsStatus: 'decline',
                    comment: 'some comment',
                    teamUrl: 'tembea.slack.com',
                }
            };
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('validateApprovalBody', () => {
        const res = {
            status: () => ({
                json: () => { }
            })
        };
        const next = jest.fn();
        it('should respond with a 400 if incomplete parameters are sent', () => {
            const req = {
                params: {
                    requestId: 1
                },
                body: {
                    newOpsStatus: 'approve',
                    comment: 'stuff',
                    reviewerId: '2',
                    takeOff: '10--00'
                }
            };
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
        });
        it('should ensure takeOff time is correct', () => {
            const req = {
                params: {
                    requestId: 1
                },
                body: {
                    newOpsStatus: 'approve',
                    comment: 'stuff',
                    reviewerId: '2',
                    routeName: 'Yaba',
                    capacity: '2',
                    takeOff: '1900',
                    teamUrl: 'stuff.slack.com',
                    provider: {}
                }
            };
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            RouteRequestValidator_1.default.validateRequestBody(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=routeRequestValidator.spec.js.map