jest.mock("@/api/modules/base");
import quotesApi from "@/api/modules/quotes";
import http from "@/api/modules/base";
import { fakeUser } from "../../mocks/user";
import {
  fakeQuote,
  fakeQuotes,
  fakeUserQuotes,
  mockAxiosGetQuotes,
  mockAxiosGetUserQuotes,
  mockAxiosPostUserQuote,
  mockAxiosDeleteUserQuote,
} from "../../mocks/quotes";
import { QuoteCreate } from "@/models/quote-create.model";

const mockedHttpGet = http.get as jest.Mock;
const mockedHttpPost = http.post as jest.Mock;
const mockedHttpDelete = http.delete as jest.Mock;

describe("api > modules > quotes.ts", () => {
  beforeEach(() => {
    mockedHttpGet.mockClear();
  });

  it("gets quotes", async () => {
    mockedHttpGet.mockImplementation(mockAxiosGetQuotes);
    await expect(quotesApi.getQuotes()).resolves.toEqual(fakeQuotes);
    expect(http.get).toHaveBeenCalledWith(`/api/quotes/`);
  });

  it("gets user quotes by userId", async () => {
    mockedHttpGet.mockImplementation(mockAxiosGetUserQuotes);
    await expect(quotesApi.getUserQuotes(fakeUser.id)).resolves.toEqual(
      fakeUserQuotes
    );
    expect(http.get).toHaveBeenCalledWith(`/api/users/${fakeUser.id}/quotes/`);
  });

  it("creates a user quote", async () => {
    const quoteCreate: QuoteCreate = {
      text: fakeQuote.text,
      author: fakeQuote.author,
    };
    mockedHttpPost.mockImplementation(mockAxiosPostUserQuote);
    await expect(quotesApi.createQuote(quoteCreate)).resolves.toEqual(
      fakeQuote
    );
    expect(http.post).toHaveBeenCalledWith(`/api/quotes/`, quoteCreate);
  });

  it("deletes a user quote", async () => {
    mockedHttpDelete.mockImplementation(mockAxiosDeleteUserQuote);
    await expect(quotesApi.deleteQuote(fakeQuote.id)).resolves.toEqual(
      undefined
    );
    expect(http.delete).toHaveBeenCalledWith(`/api/quotes/${fakeQuote.id}/`);
  });
});
