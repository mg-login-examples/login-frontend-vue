import type { RouteRecordRaw } from 'vue-router'

import MockAllQuotes from './mockViews/AllQuotes.vue'
import MockUserQuotes from './mockViews/UserQuotes.vue'
import MockLoginView from './mockViews/LoginView.vue'
import MockSignupView from './mockViews/SignupView.vue'
import MockVerifyEmail from './mockViews/VerifyEmail.vue'
import MockForgotPassword from './mockViews/ForgotPassword.vue'
import MockUserNotes from './mockViews/UserNotes.vue'
import MockGroupChat from './mockViews/GroupChat.vue'

export function getMockRoutes(routes: Array<RouteRecordRaw>): Array<RouteRecordRaw> {
  const mockRoutes: Array<RouteRecordRaw> = []
  for (const route of routes) {
    const routeClone = Object.assign(route)
    if (routeClone.name === 'allQuotes') {
      routeClone.component = MockAllQuotes
    }
    if (routeClone.name === 'userQuotes') {
      routeClone.component = MockUserQuotes
    }
    if (routeClone.name === 'login') {
      routeClone.component = MockLoginView
    }
    if (routeClone.name === 'signup') {
      routeClone.component = MockSignupView
    }
    if (routeClone.name === 'verifyEmail') {
      routeClone.component = MockVerifyEmail
    }
    if (routeClone.name === 'forgotPassword') {
      routeClone.component = MockForgotPassword
    }
    if (routeClone.name === 'userNotes') {
      routeClone.component = MockUserNotes
    }
    if (routeClone.name === 'groupChat') {
      routeClone.component = MockGroupChat
    }
    mockRoutes.push(routeClone)
  }
  return mockRoutes
}
