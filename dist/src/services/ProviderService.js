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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const sequelizePaginationHelper_1 = __importDefault(require("../helpers/sequelizePaginationHelper"));
const providerHelper_1 = __importDefault(require("../helpers/providerHelper"));
const BaseService_1 = __importDefault(require("./BaseService"));
const removeDataValues_1 = __importDefault(require("../helpers/removeDataValues"));
const dm_notification_1 = require("../modules/providers/notifications/dm.notification");
const email_notification_1 = require("../modules/providers/notifications/email.notification");
const channel_notification_1 = require("../modules/providers/notifications/channel.notification");
const whatsapp_notfication_1 = require("../modules/providers/notifications/whatsapp.notfication");
const provider_1 = require("../database/models/provider");
const route_service_1 = require("../modules/routes/route.service");
const { models: { Provider, User, Cab, Driver } } = database_1.default;
class ProviderService extends BaseService_1.default {
    constructor() {
        super(Provider);
    }
    static getProviders(pageable = providerHelper_1.default.defaultPageable, where = {}, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            let providers = [];
            const { page, size } = pageable;
            const include = [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'phoneNo', 'email', 'slackId']
                }, Object.assign({}, route_service_1.homebaseInfo)];
            const filter = {
                include,
                where: Object.assign(Object.assign({}, where), { homebaseId })
            };
            const paginatedCabs = new sequelizePaginationHelper_1.default(Provider, filter, size);
            const { data, pageMeta } = yield paginatedCabs.getPageItems(page);
            const { totalPages } = pageMeta;
            if (page <= totalPages) {
                providers = data.map(providerHelper_1.default.serializeDetails);
            }
            return Object.assign({ providers }, pageMeta);
        });
    }
    static updateProvider(updateObject, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProviderDetails = yield Provider.update(updateObject, {
                returning: true,
                where: { id }
            });
            return updatedProviderDetails;
        });
    }
    static deleteProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = yield Provider.destroy({
                where: { id }
            });
            return responseData;
        });
    }
    static createProvider(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield Provider.create(providerData);
            return provider.get();
        });
    }
    static findByPk(pk, withFks = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield Provider.findByPk(pk, { include: withFks ? ['user'] : null });
            return removeDataValues_1.default.removeDataValues(provider);
        });
    }
    static findProviderByUserId(providerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield Provider.findOne({ where: { providerUserId } });
            return provider;
        });
    }
    getProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.findById(id);
            return provider;
        });
    }
    static getViableProviders(homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = yield Provider.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [{
                        model: Cab,
                        as: 'vehicles'
                    }, {
                        model: Driver,
                        as: 'drivers'
                    }, {
                        model: User,
                        as: 'user',
                        attributes: ['name', 'phoneNo', 'email', 'slackId']
                    }],
                where: {
                    homebaseId
                }
            });
            return providers.filter((provider) => {
                const p = provider.dataValues;
                return p.vehicles.length > 0 && p.drivers.length > 0;
            });
        });
    }
    static getProviderBySlackId(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Provider.findOne({
                include: [{
                        model: User,
                        where: { slackId },
                        as: 'user',
                        attributes: ['slackId', 'id', 'email']
                    }]
            });
            return removeDataValues_1.default.removeDataValues(user);
        });
    }
    static getProviderByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Provider.findOne({
                include: [{
                        model: User,
                        where: { id },
                        as: 'user',
                        attributes: ['slackId']
                    }]
            });
            return removeDataValues_1.default.removeDataValues(user);
        });
    }
    static notifyTripRequest(provider, teamDetail, tripInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ProviderService.getNotifier(provider.notificationChannel)
                .notifyNewTripRequest(provider, tripInfo, teamDetail);
        });
    }
    static verify(provider, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ProviderService.getNotifier(provider.notificationChannel)
                .sendVerificationMessage(provider, options);
        });
    }
    static getNotifier(channel) {
        switch (channel) {
            case provider_1.ProviderNotificationChannel.directMessage:
                return new dm_notification_1.DirectMessage();
            case provider_1.ProviderNotificationChannel.email:
                return new email_notification_1.EmailNotification();
            case provider_1.ProviderNotificationChannel.channel:
                return new channel_notification_1.ChannelNotification();
            case provider_1.ProviderNotificationChannel.whatsapp:
                return new whatsapp_notfication_1.WhatsAppNotification();
            default:
                throw new Error('not implemented notification channel');
        }
    }
    static activateProviderById(updateObject, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [, [provider]] = yield Provider.update(updateObject, {
                    where: { id },
                    returning: true
                });
                return provider.get();
            }
            catch (err) {
                const error = new Error('specified provider does not exist');
                error.name = 'ProviderUpdateError';
                throw error;
            }
        });
    }
    static isDmOrChannel(channel) {
        return channel === provider_1.ProviderNotificationChannel.directMessage
            || channel === provider_1.ProviderNotificationChannel.channel;
    }
}
exports.providerService = new ProviderService();
exports.default = ProviderService;
//# sourceMappingURL=ProviderService.js.map