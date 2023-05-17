import { describe, it, expect, vi } from "vitest";

import quotesApi from "@/api/modules/quotes-api";
import http from "@/api/modules/base";
import { fakeUser } from "@/__mocks__/data/users";
import { fakeQuote, fakeQuotes, fakeUserQuotes } from "@/__mocks__/data/quotes";
import {
  mockAxiosGetQuotes,
  mockAxiosGetUserQuotes,
  mockAxiosPostUserQuote,
  mockAxiosPutUserQuote,
  mockAxiosDeleteUserQuote,
  mockAxiosLikeQuote,
  mockAxiosUnlikeQuote,
} from "./api-mock-implementations";
import type { QuoteCreate } from "@/models/quote-create.model";
import type { Quote } from "@/models/quote.model";

describe("api > modules > quotes.ts", () => {
  it("gets quotes", async () => {
    http.get = vi.fn().mockImplementation(mockAxiosGetQuotes);
    // call get quotes with no params
    await expect(quotesApi.getQuotes()).resolves.toEqual(fakeQuotes);
    expect(http.get).toHaveBeenCalledWith(`/api/quotes/`, {});
    // call get quotes with only skip param
    const params1 = { skip: 2 };
    await expect(quotesApi.getQuotes(params1)).resolves.toEqual(fakeQuotes);
    expect(http.get).toHaveBeenCalledWith(`/api/quotes/`, { params: params1 });
    // call get quotes with both skip and limit params
    const params2 = { skip: 3, limit: 77 } as any;
    await expect(quotesApi.getQuotes(params2)).resolves.toEqual(fakeQuotes);
    expect(http.get).toHaveBeenCalledWith(`/api/quotes/`, { params: params2 });
  });

  it("gets user quotes by userId", async () => {
    http.get = vi.fn().mockImplementation(mockAxiosGetUserQuotes);
    await expect(quotesApi.getUserQuotes(fakeUser.id)).resolves.toEqual(
      fakeUserQuotes
    );
    expect(http.get).toHaveBeenCalledWith(`/api/users/${fakeUser.id}/quotes/`);
  });

  it("creates a user quote", async () => {
    http.post = vi.fn().mockImplementation(mockAxiosPostUserQuote);
    const quoteCreate: QuoteCreate = {
      text: fakeQuote.text,
      author: fakeQuote.author,
    };
    await expect(quotesApi.createQuote(quoteCreate)).resolves.toEqual(
      fakeQuote
    );
    expect(http.post).toHaveBeenCalledWith(`/api/quotes/`, quoteCreate);
  });

  it("edits a user quote", async () => {
    http.put = vi.fn().mockImplementation(mockAxiosPutUserQuote);
    const quoteEdit: Quote = {
      id: fakeQuote.id,
      text: fakeQuote.text,
      author: fakeQuote.author,
      liked_by_users: [],
    };
    await expect(quotesApi.editQuote(quoteEdit)).resolves.toEqual(undefined);
    expect(http.put).toHaveBeenCalledWith(
      `/api/quotes/${fakeQuote.id}/`,
      quoteEdit
    );
  });

  it("deletes a user quote", async () => {
    http.delete = vi.fn().mockImplementation(mockAxiosDeleteUserQuote);
    await expect(quotesApi.deleteQuote(fakeQuote.id)).resolves.toEqual(
      undefined
    );
    expect(http.delete).toHaveBeenCalledWith(`/api/quotes/${fakeQuote.id}/`);
  });

  it("likes a user quote", async () => {
    http.put = vi.fn().mockImplementation(mockAxiosLikeQuote);
    const userId = 22;
    const quoteId = 33;
    await expect(quotesApi.likeQuote(quoteId, userId)).resolves.toEqual(
      undefined
    );
    expect(http.put).toHaveBeenCalledWith(
      `/api/quotes/${quoteId}/users/${userId}/like/`
    );
  });

  it("unlikes a user quote", async () => {
    http.delete = vi.fn().mockImplementation(mockAxiosUnlikeQuote);
    const userId = 22;
    const quoteId = 33;
    await expect(quotesApi.unlikeQuote(quoteId, userId)).resolves.toEqual(
      undefined
    );
    expect(http.delete).toHaveBeenCalledWith(
      `/api/quotes/${quoteId}/users/${userId}/like/`
    );
  });
});
