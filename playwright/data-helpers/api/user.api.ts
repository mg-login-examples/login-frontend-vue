import axios from 'axios'
import dotenv from 'dotenv'

import { LoginResponseModel } from '../models/login-response.model'

dotenv.config()

export default class UserAPI {
  static api_base_url = process.env.PLAYWRIGHT_apiUrl
  static loginUrl = `${this.api_base_url}/login/`

  static async login(email: string, password: string) {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    return <LoginResponseModel>(
      await axios({
        method: 'POST',
        url: this.loginUrl,
        data: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    ).data
  }
}
