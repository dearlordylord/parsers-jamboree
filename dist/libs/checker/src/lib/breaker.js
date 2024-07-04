"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixCustomerId = exports.switchDates = void 0;
const switchFields = (f1, f2) => (x) => (Object.assign(Object.assign({}, x), { [f1]: x[f2], [f2]: x[f1] }));
const mutateField = (m) => (f) => (x) => (Object.assign(Object.assign({}, x), { [f]: m(x[f]) }));
exports.switchDates = switchFields('createdAt', 'updatedAt');
exports.prefixCustomerId = mutateField((s) => 1)('stripeId');
//# sourceMappingURL=breaker.js.map