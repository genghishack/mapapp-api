import {logDebug, logError} from "./logging-lib";
import {getCognitoUser} from "./cognito-lib";
import {getUserAttribute, getUserRoles} from "./user-lib";
import {reject} from "./error-lib";

const isAuthenticated = (identity) => {
  return (identity.cognitoAuthenticationType === 'authenticated');
}

const isUnauthenticated = (identity) => {
  return (identity.cognitoAuthenticationType === 'unauthenticated');
}

const isIAM = (identity) => {
  return (
    !identity.cognitoAuthenticationType
    && identity.userArn.split(':')[2] === 'iam'
  )
}

const getUserIdentity = (identity) => {
  return {
    federatedId: identity.cognitoIdentityId,
    identityPoolId: identity.cognitoIdentityPoolId,
  }
}

const getUserParams = (identity) => {
  if (identity.cognitoAuthenticationProvider) {
    const [userPoolId] = identity.cognitoAuthenticationProvider
      .split('/')[2]
      .split(':');
    const userSub = identity.cognitoAuthenticationProvider
      .split(':CognitoSignIn:')[1];
    return {UserPoolId: userPoolId, Username: userSub};
  }
  return {};
}

export const getUserFromEvent = async (event) => {
  logDebug({event});
  if (!event || !event.requestContext || !event.requestContext.identity) {
    return reject(new Error('Insufficient event data to get user'));
  }

  const {identity} = event.requestContext;
  const userIdentity = getUserIdentity(identity);
  const userParams = getUserParams(identity);
  const authType = identity.cognitoAuthenticationType;
  let userData;

  if (isAuthenticated(identity)) {
    try {
      const cognitoUser = await getCognitoUser(userParams);
      logDebug({cognitoUser});
      const userRoles = await getUserRoles(userParams);
      userData = {
        id: userParams.Username,
        userParams,
        userIdentity,
        authType,
        email: getUserAttribute(cognitoUser, 'email'),
        name: getUserAttribute(cognitoUser, 'name'),
        roles: userRoles,
      }
    } catch (e) {
      logError(e);
      return reject(e);
    }
  } else if (isUnauthenticated(identity)) {
    userData = {
      userIdentity,
      authType,
    }
  } else if (isIAM(identity)) {
    const userId = '00000000-0000-0000-0000-000000000000'
    userData = {
      id: userId,
      authType: 'iam',
      userParams: {
        Username: userId,
      },
    }
  } else {
    return reject(new Error('No user found in event data'));
  }
  logDebug({userData});
  return userData;
}
