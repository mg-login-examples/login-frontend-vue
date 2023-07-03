const apiEndpointsPath = {
  login: `/api/login/`,
  authenticate: `/api/authenticate/`,
  logout: `/api/logout/`,
  createUser: `/api/users/`,
  getUsers: `/api/users/`,
  getUsersByIds: `/api/users/ids`,
  sendEmailWithPasswordResetLink: `/api/password-reset-link/`,
  googleLogin: `/api/oauth/google/`,

  verifyEmail: (verificationCode: number) =>
    `/api/email-verifications/verify-email/${verificationCode}/`,
  resendEmailForVerification: `/api/email-verifications/resend-email/`,

  getQuotes: `/api/quotes/`,
  getUserQuotes: (userId: number) => `/api/users/${userId}/quotes/`,
  createQuote: `/api/quotes/`,
  editQuote: (quoteId: number) => `/api/quotes/${quoteId}/`,
  deleteQuote: (quoteId: number) => `/api/quotes/${quoteId}/`,
  likeQuote: (quoteId: number, userId: number) =>
    `/api/quotes/${quoteId}/users/${userId}/like/`,
  unlikeQuote: (quoteId: number, userId: number) =>
    `/api/quotes/${quoteId}/users/${userId}/like/`,

  getUserNotes: (userId: number) => `/api/users/${userId}/user-notes/`,
  createUserNote: `/api/user-notes/`,
  editUserNote: (userNoteId: string) => `/api/user-notes/${userNoteId}/`,
  deleteUserNote: (userNoteId: string) => `/api/user-notes/${userNoteId}/`,
};

export default apiEndpointsPath;
