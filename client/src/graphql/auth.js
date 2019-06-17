export const loginQuery = (email, password) => {
  return {
    query: `
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          userId
          token
          tokenExpiration
        }
      }
    `,
    variables: {
      email: email,
      password: password
    }
  }
};

export const createUserMutation = (pseudo, email, password) => {
  return {
    query: `
      mutation CreateUser($pseudo: String!, $email: String!, $password: String!) {
        createUser(userInput: {pseudo: $pseudo, email: $email, password: $password}) {
          _id
          pseudo
          email
        }
      }
    `,
    variables: {
      pseudo: pseudo,
      email: email,
      password: password
    }
  }
};

export const userProfileQuery = userId => {
  return {
    query: `
      query User($userId: String!) {
        user(userId: $userId) {
          pseudo
          email
          numberOfCreatedMovies
        }
      }
    `,
    variables: {
      userId: userId
    }
  }
};

export const userCredentialsMutation = credentials => {
  return {
    query: `
      mutation UpdateUserCredentials($userId: ID!, $currentPassword: String!, $newPassword: String!) {
        updateUserCredentials(userCredentialsInput: {userId: $userId, currentPassword: $currentPassword, newPassword: $newPassword}) {
          password
        }
      }
    `,
    variables: {
      userId: credentials.userId,
      currentPassword: credentials.curPassword,
      newPassword: credentials.newPassword
    }
  }
}
