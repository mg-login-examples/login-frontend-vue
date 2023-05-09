import http from "./base";
import apiEndpointsPath from "../api-endpoints-path";

const emailsAPI = {
  async verifyEmail(verificationCode: number): Promise<void> {
    await http.post(apiEndpointsPath.verifyEmail(verificationCode));
  },
  async resendEmail(): Promise<void> {
    await http.post(apiEndpointsPath.resendEmailForVerification);
  },
};

export default emailsAPI;
