"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cab_controller_1 = require("../cab.controller");
const cab_service_1 = require("./cab.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
const mockCabController = new cab_controller_1.CabsController(cab_service_1.mockCabService, logger_1.mockLogger);
exports.default = mockCabController;
//# sourceMappingURL=cab.controller.js.map