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

import Ajv, { JSONSchemaType } from 'ajv';
import {
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  Result,
  SUBSCRIPTION_TYPES,
} from '@parsers-jamboree/common';
import { JTDSchemaType } from 'ajv/dist/types/jtd-schema';

// formats don't seem to be type-checked; skipping
// import addFormats from "ajv-formats"

const ajv = new Ajv({
  removeAdditional: true,
});
// addFormats(ajv);

type UserJson = {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  subscription: (typeof SUBSCRIPTION_TYPES)[number];
  stripeId: string;
  visits: number;
  favouriteColours: string[];
  profile:
    | {
        type: typeof PROFILE_TYPE_LISTENER;
        boughtTracks: number;
      }
    | {
        type: typeof PROFILE_TYPE_ARTIST;
        publishedTracks: number;
      };
  fileSystem: ({
    type: 'directory';
    children: FileSystem[];
  } | {
    type: 'file';
  }) & {
    name: string;
  }
};

// more flexibility with addKeyword (not typed well)
const schema: JSONSchemaType<UserJson> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    subscription: { type: 'string', enum: SUBSCRIPTION_TYPES },
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
            type: { type: 'string', enum: [PROFILE_TYPE_LISTENER] },
            boughtTracks: { type: 'integer', minimum: 0 },
          },
          required: ['type', 'boughtTracks'],
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: [PROFILE_TYPE_ARTIST] },
            publishedTracks: { type: 'integer', minimum: 0 },
          },
          required: ['type', 'publishedTracks'],
        },
      ],
    },
    fileSystem: { $ref: '#/definitions/fsNode' }
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
    }
  }
};

const validate = ajv.compile(schema);

export const decodeUser = (u: unknown): Result<unknown, UserJson> => {
  // the library mutates the input; with all the above; disqualified
  const deepCopy = JSON.parse(JSON.stringify(u)) as unknown;
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
      value: { ...deepCopy },
    };
  }
  // mutates itself adding .errors
  return { _tag: 'left', error: JSON.stringify(validate.errors, null, 2) };
};

export const encodeUser = (u: UserJson): Result<string, unknown> => ({
  _tag: 'left',
  error: 'the lib cannot do it',
});
