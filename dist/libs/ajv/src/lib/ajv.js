"use strict";
/*
from docs:

const Ajv = require("ajv")
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const schema = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string"}
  },
  required: ["foo"],
  additionalProperties: false
}

const validate = ajv.compile(schema)

const data = {
  foo: 1,
  bar: "abc"
}

const valid = validate(data)
if (!valid) console.log(validate.errors)

 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = void 0;
const ajv_1 = require("ajv");
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
        name: { type: 'string' },
        email: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        subscription: { type: 'string', enum: common_1.SUBSCRIPTION_TYPES },
        stripeId: { type: 'string', pattern: '^cus_[a-zA-Z0-9]{14,}$' },
        visits: { type: 'integer', minimum: 0 },
        favouriteColours: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
        },
        profile: {
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: ['listener'] },
                        boughtTracks: { type: 'integer', minimum: 0 },
                    },
                    required: ['type', 'boughtTracks'],
                },
                {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: ['artist'] },
                        publishedTracks: { type: 'integer', minimum: 0 },
                    },
                    required: ['type', 'publishedTracks'],
                },
            ],
        },
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
    ],
    additionalProperties: false,
};
const validate = ajv.compile(schema);
const decodeUser = (u) => {
    const r = validate(u);
    if (r) {
        const createdAt = new Date(u.createdAt);
        // errors are not composable here
        if (isNaN(createdAt.getTime())) {
            return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
        }
        const updatedAt = new Date(u.updatedAt);
        if (isNaN(updatedAt.getTime())) {
            return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
        }
        const favouriteColours = new Set(u.favouriteColours);
        if (favouriteColours.size !== u.favouriteColours.length) {
            return { _tag: 'left', error: 'favourite colours must be unique' };
        }
        return {
            _tag: 'right',
            value: Object.assign(Object.assign({}, u), { createdAt, updatedAt, favouriteColours }),
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
//# sourceMappingURL=ajv.js.map