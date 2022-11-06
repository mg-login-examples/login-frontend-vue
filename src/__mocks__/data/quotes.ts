import minifaker from "minifaker";
import "minifaker/locales/en";

import type { User } from "@/models/user.model";
import type { Quote } from "@/models/quote.model";
import { fakeUser } from "./users";

export const fakeUser2: User = {
  id: minifaker.number({ min: 1000, max: 9999 }),
  email: minifaker.email(),
  is_active: true,
  is_verified: true,
};

export const fakeQuote: Quote = {
  id: minifaker.number({ min: 1000, max: 9999 }),
  text: minifaker.array(10, () => minifaker.word()).join(),
  author: fakeUser,
  liked_by_users: [],
};

export const fakeQuotes: Quote[] = [
  {
    id: minifaker.number({ min: 1000, max: 9999 }),
    text: minifaker.array(10, () => minifaker.word()).join(),
    author: fakeUser,
    liked_by_users: [],
  },
  {
    id: minifaker.number({ min: 1000, max: 9999 }),
    text: minifaker.array(10, () => minifaker.word()).join(),
    author: fakeUser,
    liked_by_users: [],
  },
  {
    id: minifaker.number({ min: 1000, max: 9999 }),
    text: minifaker.array(10, () => minifaker.word()).join(),
    author: fakeUser2,
    liked_by_users: [],
  },
];

export const fakeUserQuotes: Quote[] = [fakeQuotes[0], fakeQuotes[1]];
