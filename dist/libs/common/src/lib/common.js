"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapResult = exports.COLOURS = exports.COLOUR_BLUE = exports.COLOUR_GREEN = exports.COLOUR_RED = exports.SUBSCRIPTION_TYPES = exports.SUBSCRIPTION_TYPE_ENTERPRISE = exports.SUBSCRIPTION_TYPE_PRO = exports.SUBSCRIPTION_TYPE_FREE = void 0;
exports.SUBSCRIPTION_TYPE_FREE = 'free';
exports.SUBSCRIPTION_TYPE_PRO = 'pro';
exports.SUBSCRIPTION_TYPE_ENTERPRISE = 'enterprise';
exports.SUBSCRIPTION_TYPES = [
    exports.SUBSCRIPTION_TYPE_FREE,
    exports.SUBSCRIPTION_TYPE_PRO,
    exports.SUBSCRIPTION_TYPE_ENTERPRISE,
];
exports.COLOUR_RED = 'red';
exports.COLOUR_GREEN = 'green';
exports.COLOUR_BLUE = 'blue';
// assume it's a finite set of 3
exports.COLOURS = [exports.COLOUR_RED, exports.COLOUR_GREEN, exports.COLOUR_BLUE];
const unwrapResult = (showError) => (result) => {
    if (result._tag === 'right') {
        return result.value;
    }
    else {
        throw new Error(showError(result.error));
    }
};
exports.unwrapResult = unwrapResult;
//# sourceMappingURL=common.js.map