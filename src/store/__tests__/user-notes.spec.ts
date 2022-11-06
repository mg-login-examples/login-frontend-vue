vi.mock("@/store/errors");
vi.mock("@/api/backendApi");
vi.mock("@/store/user");
import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import minifaker from "minifaker";
import "minifaker/locales/en";

import { useUserNotesStore } from "@/store/user-notes";
import { useUserStore } from "@/store/user";
import { useErrorsStore } from "@/store/errors";
import backendApi from "@/api/backendApi";
import { fakeUserNote, fakeUserNotes } from "@/__mocks__/data/userNotes";
import { fakeUser } from "@/__mocks__/data/users";

const mockErrorsStore = { handleError: vi.fn() };
(useErrorsStore as unknown as Mock).mockReturnValue(mockErrorsStore);
const mockBackendApiGetUserNotes = backendApi.userNotes.getUserNotes as Mock;
const mockBackendApiCreateUserNote = backendApi.userNotes
  .createUserNote as Mock;

const mockUserStore = { user: fakeUser };
(useUserStore as unknown as Mock).mockReturnValue(mockUserStore);

describe("store > userNotes.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockBackendApiGetUserNotes.mockClear();
    mockBackendApiGetUserNotes.mockClear();
    mockErrorsStore.handleError.mockClear();
  });

  it("returns a user note by id", () => {
    const userNotesStore = useUserNotesStore();
    userNotesStore.userNotes = fakeUserNotes;
    const expectedUserNote = fakeUserNotes[1];
    expect(userNotesStore.userNoteById(expectedUserNote.id)).toEqual(
      expectedUserNote
    );
    const nonExistentUserNoteId = "abcd";
    expect(userNotesStore.userNoteById(nonExistentUserNoteId)).toEqual(
      undefined
    );
  });

  it("gets user notes", async () => {
    mockBackendApiGetUserNotes.mockReturnValue(fakeUserNotes);
    const userNotesStore = useUserNotesStore();
    expect(userNotesStore.userNotes).toStrictEqual([]);
    await userNotesStore.getUserNotes();
    expect(mockBackendApiGetUserNotes).toHaveBeenCalledWith(fakeUser.id);
    expect(userNotesStore.userNotes).toStrictEqual(fakeUserNotes);
  });

  it("creates a user note", async () => {
    mockBackendApiCreateUserNote.mockReturnValue(fakeUserNote);
    const userNotesStore = useUserNotesStore();
    userNotesStore.userNotes = [...fakeUserNotes];
    const fakeUserNoteToCreate = {
      title: fakeUserNote.title,
      text: fakeUserNote.text,
      user_id: fakeUserNote.user_id,
    };
    await userNotesStore.createUserNote(fakeUserNoteToCreate);
    expect(userNotesStore.userNotes.length).toBe(fakeUserNotes.length + 1);
    expect(
      userNotesStore.userNotes[userNotesStore.userNotes.length - 1]
    ).toEqual(fakeUserNote);
  });

  it("edits a user note", async () => {
    const userNotesStore = useUserNotesStore();
    userNotesStore.userNotes = [...fakeUserNotes];
    const userNoteEdit = userNotesStore.userNotes[1];
    const originalUserNoteText = userNoteEdit.text;
    userNoteEdit.text = minifaker.array(10, () => minifaker.word()).join();
    await userNotesStore.editUserNote(userNoteEdit);
    expect(userNotesStore.userNotes.length).toBe(fakeUserNotes.length);
    expect(
      userNotesStore.userNotes.find(
        (userNote) => userNote.id === userNoteEdit.id
      )?.text
    ).toBe(userNoteEdit.text);
    expect(
      userNotesStore.userNotes.find(
        (userNote) => userNote.id === userNoteEdit.id
      )?.text
    ).not.toBe(originalUserNoteText);
  });

  it("deletes a user note", async () => {
    const userNotesStore = useUserNotesStore();
    userNotesStore.userNotes = [...fakeUserNotes];
    const userNoteDelete = userNotesStore.userNotes[1];
    await userNotesStore.deleteUserNote(userNoteDelete.id);
    expect(userNotesStore.userNotes.length).toBe(fakeUserNotes.length - 1);
    expect(
      userNotesStore.userNotes.find(
        (userNote) => userNote.id === userNoteDelete.id
      )
    ).toBe(undefined);
  });
});
