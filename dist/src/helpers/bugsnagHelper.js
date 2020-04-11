"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = __importDefault(require("@bugsnag/js"));
const plugin_express_1 = __importDefault(require("@bugsnag/plugin-express"));
const environment_1 = __importDefault(require("../config/environment"));
class Bugsnag {
    constructor(bugsnagApiKey) {
        this.bugsnagClient = null;
        const isTestOrDev = Bugsnag.checkEnvironments();
        if (!isTestOrDev && bugsnagApiKey) {
            this.bugsnagClient = js_1.default({
                apiKey: bugsnagApiKey,
                autoNotify: true,
                appVersion: '0.0.1',
                appType: 'web_server'
            });
            this.bugsnagClient.use(plugin_express_1.default);
        }
    }
    static checkEnvironments(isTest = false) {
        const environments = ['test', 'development'];
        const { NODE_ENV } = environment_1.default;
        return isTest ? ['test', 'testing'].includes(NODE_ENV) : environments.includes(NODE_ENV);
    }
    createMiddleware() {
        if (this.bugsnagClient) {
            return this.bugsnagClient.getPlugin('express');
        }
        return false;
    }
    init(app) {
        const { requestHandler } = this.createMiddleware();
        if (requestHandler) {
            app.use(requestHandler);
        }
    }
    errorHandler(app) {
        const { errorHandler } = this.createMiddleware();
        if (errorHandler) {
            app.use(errorHandler);
        }
    }
    log(error) {
        if (this.bugsnagClient) {
            this.bugsnagClient.notify(error);
        }
        else if (!Bugsnag.checkEnvironments(true)) {
            console.error('Error: ', error);
        }
    }
    warn(error) {
        return this.log(error);
    }
    info(error) {
        return this.log(error);
    }
    error(error) {
        return this.log(error);
    }
}
exports.Bugsnag = Bugsnag;
const BugsnagHelper = new Bugsnag(process.env.BUGSNAG_API_KEY);
exports.default = BugsnagHelper;
//# sourceMappingURL=bugsnagHelper.js.map