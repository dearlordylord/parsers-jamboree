"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_REGEX_S = exports.ISO_DATE_REGEX_S = exports.unwrapResult = exports.chain = exports.map = exports.PROFILE_TYPES = exports.PROFILE_TYPE_ARTIST = exports.PROFILE_TYPE_LISTENER = exports.COLOURS = exports.COLOUR_BLUE = exports.COLOUR_GREEN = exports.COLOUR_RED = exports.SUBSCRIPTION_TYPES = exports.SUBSCRIPTION_TYPE_ENTERPRISE = exports.SUBSCRIPTION_TYPE_PRO = exports.SUBSCRIPTION_TYPE_FREE = void 0;
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
exports.PROFILE_TYPE_LISTENER = 'listener';
exports.PROFILE_TYPE_ARTIST = 'artist';
exports.PROFILE_TYPES = [exports.PROFILE_TYPE_LISTENER, exports.PROFILE_TYPE_ARTIST];
const map = (f) => (r) => r._tag === 'left' ? r : { _tag: 'right', value: f(r.value) };
exports.map = map;
const chain = (f) => (r) => r._tag === 'left' ? r : f(r.value);
exports.chain = chain;
const unwrapResult = (showError) => (result) => {
    if (result._tag === 'right') {
        return result.value;
    }
    else {
        throw new Error(showError(result.error));
    }
};
exports.unwrapResult = unwrapResult;
// iso8601 regex https://stackoverflow.com/a/28022901/2123547
exports.ISO_DATE_REGEX_S = '^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$';
exports.EMAIL_REGEX_S = '^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$';
//# sourceMappingURL=common.js.map