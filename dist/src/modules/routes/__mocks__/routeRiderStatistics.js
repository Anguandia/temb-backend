"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const riderStats = [
    {
        get: (plainProp = { plain: false }) => {
            if (plainProp.plain) {
                return {
                    userId: 10,
                    batchRecordId: 2,
                    userCount: '3',
                    user: {
                        name: 'James Bond',
                        homebaseId: 1,
                        email: 'test@test.com'
                    },
                    batchRecord: {
                        batchId: 1001,
                        batch: {
                            batch: 'A',
                            route: {
                                name: 'Jazmyn Vista'
                            }
                        }
                    },
                    picture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                };
            }
        },
    },
];
exports.default = riderStats;
//# sourceMappingURL=routeRiderStatistics.js.map