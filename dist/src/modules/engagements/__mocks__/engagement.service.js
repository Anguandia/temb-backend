"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../database");
const __mocks__1 = require("../../../database/__mocks__");
class MockEngagement extends __mocks__1.MockRepository {
    constructor(engagements = []) {
        super(database_1.Engagement, engagements);
    }
    findOrCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { fellowId, partnerId } = options.defaults;
                    if (fellowId == null || partnerId == null)
                        throw new Error();
                    const existingEngagement = this.data.find((e) => {
                        return e.partnerId === partnerId && e.fellowId === fellowId;
                    });
                    if (existingEngagement)
                        resolve([existingEngagement, false]);
                    const newEngagement = yield this.create(options.defaults);
                    resolve([newEngagement, true]);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
}
exports.mockEngagementRepo = new MockEngagement();
//# sourceMappingURL=engagement.service.js.map