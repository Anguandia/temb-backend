"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripKey = (userId) => `TRIP_IN_PROCESS_${userId}`;
exports.createDepartmentPayloadObject = (payload, respond, forSelf = 'true') => {
    const navButtonCallbackId = forSelf === 'true' ? 'schedule_trip_reason' : 'schedule_trip_rider';
    return {
        payload,
        respond,
        navButtonCallbackId,
        navButtonValue: 'book_new_trip',
        attachmentCallbackId: 'schedule_trip_department',
    };
};
//# sourceMappingURL=index.js.map