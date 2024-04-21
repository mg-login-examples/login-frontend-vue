import http from './base'
import apiEndpointsPath from '../api-endpoints-path'
import type { QuoteCreate } from '@/models/quote-create.model'
import type { Quote } from '@/models/quote.model'

const quotesAPI = {
  async getQuotes(
    params: { skip?: number; limit?: number } | undefined = undefined
  ): Promise<Quote[]> {
    const response = await http.get(apiEndpointsPath.getQuotes, { params })
    return <Quote[]>response.data
  },
  async getUserQuotes(userId: number): Promise<Quote[]> {
    const response = await http.get(apiEndpointsPath.getUserQuotes(userId))
    return <Quote[]>response.data
  },
  async createQuote(quoteCreate: QuoteCreate): Promise<Quote> {
    const response = await http.post(apiEndpointsPath.createQuote, quoteCreate)
    return <Quote>response.data
  },
  async editQuote(quoteEdit: Quote) {
    await http.put(apiEndpointsPath.editQuote(quoteEdit.id), quoteEdit)
  },
  async deleteQuote(quoteId: number) {
    await http.delete(apiEndpointsPath.deleteQuote(quoteId))
  },
  async likeQuote(quoteId: number, userId: number) {
    await http.put(apiEndpointsPath.likeQuote(quoteId, userId))
  },
  async unlikeQuote(quoteId: number, userId: number) {
    await http.delete(apiEndpointsPath.unlikeQuote(quoteId, userId))
  }
}

export default quotesAPI
