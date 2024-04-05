export function userStepTitle(userAction: string, userName?: string) {
  if (userName) {
    return `User <${userName}> : ${userAction}`
  }
  return `${userAction}`
}

export function getUserStepTitle(userName: string | undefined) {
  const userStepTitleForUserName = (userAction: string) => {
    if (userName) {
      return `User <${userName}> : ${userAction}`
    }
    return `${userAction}`
  }
  return userStepTitleForUserName
}
