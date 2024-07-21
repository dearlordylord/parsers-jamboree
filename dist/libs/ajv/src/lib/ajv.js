"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.encodeUser = exports.decodeUser = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const common_1 = require("@parsers-jamboree/common");
// formats don't seem to be type-checked; skipping
// import addFormats from "ajv-formats"
const ajv = new ajv_1.default({
    removeAdditional: true,
});
// more flexibility with addKeyword (not typed well)
const schema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1 },
        email: {
            type: 'string',
            pattern: "^(?!\\.)((?!.*\\.{2})[a-zA-Z0-9\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF\\.!#$%&'*+-/=?^_`{|}~\\-\\d]+)@(?!\\.)([a-zA-Z0-9\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF\\-\\.\\d]+)((\\.([a-zA-Z\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF]){2,63})+)$",
        },
        createdAt: {
            type: 'string',
            pattern: '(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+)|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d)|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d)',
        },
        updatedAt: {
            type: 'string',
            pattern: '(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+)|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d)|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d)',
        },
        subscription: { type: 'string', enum: common_1.SUBSCRIPTION_TYPES },
        stripeId: { type: 'string', pattern: '^cus_[a-zA-Z0-9]{14,}$' },
        visits: { type: 'integer', minimum: 0 },
        favouriteColours: {
            type: 'array',
            items: {
                type: 'string',
                oneOf: [
                    {
                        type: 'string',
                        pattern: '^#[a-fA-F0-9]{6}$',
                    },
                    {
                        type: 'string',
                        enum: common_1.COLOURS,
                    },
                ],
            },
            uniqueItems: true,
        },
        profile: {
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: [common_1.PROFILE_TYPE_LISTENER] },
                        boughtTracks: { type: 'integer', minimum: 0 },
                    },
                    required: ['type', 'boughtTracks'],
                },
                {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: [common_1.PROFILE_TYPE_ARTIST] },
                        publishedTracks: { type: 'integer', minimum: 0 },
                    },
                    required: ['type', 'publishedTracks'],
                },
            ],
        },
        fileSystem: { $ref: '#/definitions/fsNode' },
    },
    required: [
        'name',
        'email',
        'createdAt',
        'updatedAt',
        'subscription',
        'stripeId',
        'visits',
        'favouriteColours',
        'profile',
        'fileSystem',
    ],
    definitions: {
        fsNode: {
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: ['directory'] },
                        children: {
                            type: 'array',
                            items: { $ref: '#/definitions/fsNode' },
                        },
                        name: { type: 'string' },
                    },
                    required: ['type', 'children', 'name'],
                    additionalProperties: false,
                },
                {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: ['file'] },
                        name: { type: 'string' },
                    },
                    required: ['type', 'name'],
                    additionalProperties: false,
                },
            ],
            required: ['type'],
        },
    },
};
const validate = ajv.compile(schema);
const decodeUser = (u) => {
    // the library mutates the input
    const deepCopy = JSON.parse(JSON.stringify(u));
    const r = validate(deepCopy);
    if (r) {
        // const createdAt = new Date(u.createdAt);
        // errors are not composable here
        // if (isNaN(createdAt.getTime())) {
        //   return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
        // }
        // const updatedAt = new Date(u.updatedAt);
        // if (isNaN(updatedAt.getTime())) {
        //   return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
        // }
        // const favouriteColours = new Set(u.favouriteColours);
        // if (favouriteColours.size !== u.favouriteColours.length) {
        //   return { _tag: 'left', error: 'favourite colours must be unique' };
        // }
        return {
            _tag: 'right',
            // value: { ...u, createdAt, updatedAt, favouriteColours },
            value: deepCopy,
        };
    }
    // mutates itself adding .errors
    return { _tag: 'left', error: JSON.stringify(validate.errors, null, 2) };
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => ({
    _tag: 'left',
    error: 'the lib cannot do it',
});
exports.encodeUser = encodeUser;
exports.meta = {
    items: {
        branded: false,
        typedErrors: false,
        templateLiterals: false,
    },
    explanations: {
        typedErrors: 'https://ajv.js.org/guide/typescript.html#type-safe-error-handling - requires `as` - not good enough'
    }
};
//# sourceMappingURL=ajv.js.map