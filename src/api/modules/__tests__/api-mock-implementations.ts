import { fakeLoginResponse, fakeUser } from "@/__mocks__/data/users";
import { fakeQuote, fakeQuotes, fakeUserQuotes } from "@/__mocks__/data/quotes";
import { fakeUserNote, fakeUserNotes } from "@/__mocks__/data/userNotes";

// User API
export const mockAxiosLoginUser = () =>
  Promise.resolve({ data: fakeLoginResponse });

export const mockAxiosAuthenticateUser = () =>
  Promise.resolve({ data: fakeUser });

export const mockAxiosLogoutUser = () => Promise.resolve(null);

export const mockAxiosCreateUser = () =>
  Promise.resolve({ data: fakeLoginResponse });

export const mockAxiosSendEmailWithPasswordResetLink = () => {
  Promise.resolve();
};

// Quotes API
export const mockAxiosGetQuotes = () => Promise.resolve({ data: fakeQuotes });
export const mockAxiosGetUserQuotes = () =>
  Promise.resolve({ data: fakeUserQuotes });

export const mockAxiosPostUserQuote = () =>
  Promise.resolve({ data: fakeQuote });

export const mockAxiosPutUserQuote = () => Promise.resolve();

export const mockAxiosDeleteUserQuote = () => {
  Promise.resolve();
};

export const mockAxiosLikeQuote = () => {
  Promise.resolve();
};

export const mockAxiosUnlikeQuote = () => {
  Promise.resolve();
};

// Email Verifications API
export const mockAxiosVerifyEmail = () => {
  Promise.resolve();
};

export const mockAxiosResendEmail = () => {
  Promise.resolve();
};

// User notes
export const mockAxiosGetUserNotes = () =>
  Promise.resolve({ data: fakeUserNotes });

export const mockAxiosPostUserNote = () =>
  Promise.resolve({ data: fakeUserNote });

export const mockAxiosPutUserNote = () => Promise.resolve();

export const mockAxiosDeleteUserNote = () => {
  Promise.resolve();
};
