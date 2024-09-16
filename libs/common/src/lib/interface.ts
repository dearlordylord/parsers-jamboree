export type User = {
  name: UserName;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
  subscription: SubscriptionType;
  stripeId: StripeId;
  visits: Visits;
  favouriteColours: Set<Colour>;
  profile: Profile;
  fileSystem: FileSystemItem;
};

type SubscriptionType = 'pro' | 'basic' | 'free';

type FileSystemItem = {
  name: FileName;
} & (
  | {
  type: 'directory';
  children: FileSystemItem[];
}
  | {
  type: 'file';
}
  );

type Profile =
  | {
  type: 'listener';
  boughtTracks: NonNegativeInteger;
}
  | {
  type: 'artist';
  publishedTracks: NonNegativeInteger;
};

// every type here is to be checked and nominal-typed by validators
type NonEmptyString = string;
type UserName = NonEmptyString;
type Email = NonEmptyString;
type StripeId = `cus_${string}`;
type NonNegativeInteger = number;
type Visits = NonNegativeInteger;
type PresetColours = 'red' | 'green' | 'blue';
type HexColour = `#${string}`;
type Colour = PresetColours | HexColour;
type FileName = string;
