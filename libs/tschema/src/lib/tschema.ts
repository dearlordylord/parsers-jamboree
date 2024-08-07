import * as t from 'tschema';
import { COLOURS, Result } from '@parsers-jamboree/common';

let HexColour = t.string({
  pattern: '^#[a-fA-F0-9]{6}$',
});

let Colour = t.one(...COLOURS.map(c => t.constant(c)));

let FavouriteColour = t.one(Colour, HexColour);

let Profile = t.one(
  t.object({
    type: t.constant('listener'),
    boughtTracks: t.integer({
      minimum: 0,
    }),
  }),
  t.object({
    type: t.constant('artist'),
    publishedTracks: t.integer({
      minimum: 0,
    }),
  }),
);

let User = t.object({
  name: t.string({
    minLength: 1,
  }),
  email: t.string({
    format: 'email',
  }),
  createdAt: t.string({
    format: 'date-time',
  }),
  updatedAt: t.string({
    format: 'date-time',
  }),
  subscription: t.one(t.constant('free'), t.constant('pro'), t.constant('enterprise')),
  stripeId: t.string({
    pattern: '^cus_[a-zA-Z0-9]{14,}$',
  }),
  visits: t.integer({
    minimum: 0,
  }),
  favouriteColours: t.array(FavouriteColour, {
    uniqueItems: true,
  }),
  profile: Profile,
  fileSystem: t.object({}), // no recursive types https://github.com/lukeed/tschema/issues/9
});

type User = t.Infer<typeof User>;

// not a parser/validator but an utility to build json schemas
