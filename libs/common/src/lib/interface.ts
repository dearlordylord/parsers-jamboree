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
  boughtTracks: number;
}
  | {
  type: 'artist';
  publishedTracks: number;
};

type UserName = string;
type Email = string;
type StripeId = string;
type Visits = number;
type Colour = string;
type FileName = string;
