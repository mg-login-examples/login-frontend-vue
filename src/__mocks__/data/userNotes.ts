import minifaker from "minifaker";
import "minifaker/locales/en";

import type { UserNote } from "@/models/user-note.model";
import { fakeUser } from "./users";

export const fakeUserNote: UserNote = {
  id: Math.random().toString(36).slice(2),
  title: minifaker.array(3, () => minifaker.word()).join(),
  text: minifaker.array(10, () => minifaker.word()).join(),
  user_id: fakeUser.id,
};

export const fakeUserNotes: UserNote[] = [
  {
    id: Math.random().toString(36).slice(2),
    title: minifaker.array(3, () => minifaker.word()).join(),
    text: minifaker.array(10, () => minifaker.word()).join(),
    user_id: fakeUser.id,
  },
  {
    id: Math.random().toString(36).slice(2),
    title: minifaker.array(3, () => minifaker.word()).join(),
    text: minifaker.array(10, () => minifaker.word()).join(),
    user_id: fakeUser.id,
  },
  {
    id: Math.random().toString(36).slice(2),
    title: minifaker.array(3, () => minifaker.word()).join(),
    text: minifaker.array(10, () => minifaker.word()).join(),
    user_id: fakeUser.id,
  },
];
