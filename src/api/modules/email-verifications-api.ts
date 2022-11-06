import http from "./base";

const emailsAPI = {
  async verifyEmail(verificationCode: number): Promise<void> {
    await http.post(
      `/api/email-verifications/verify-email/${verificationCode}/`
    );
  },
  async resendEmail(): Promise<void> {
    await http.post(`/api/email-verifications/resend-email/`);
  },
};

export default emailsAPI;
