import AWS from 'aws-sdk';
import {logDebug, logError} from './logging-lib';
import {assignUserToRole} from "./admin-lib";

const cognitoISP = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

export const getUserParams = (identity) => {
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

export const getUserIdentity = (identity) => {
  return {
    federatedId: identity.cognitoIdentityId,
    identityPoolId: identity.cognitoIdentityPoolId,
  }
}

export const getUserAttribute = (cognitoUser, attrName) => {
  const {UserAttributes, Attributes} = cognitoUser;
  let attribute;
  if (UserAttributes) {
    attribute = UserAttributes.filter(attr => attr.Name === attrName);
  } else {
    attribute = Attributes.filter(attr => attr.Name === attrName);
  }
  return attribute.length ? attribute[0].Value : null
}

export const getUserGroups = async (userParams) => {
  try {
    const cognitoGroups = await cognitoISP.adminListGroupsForUser(userParams).promise();
    logDebug({cognitoGroups});
    const {Groups: userGroups} = cognitoGroups;
    return userGroups;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getUserRoles = async (userParams) => {
  try {
    let userGroups = await getUserGroups(userParams);
    if (!userGroups.length) {
      await assignUserToRole(userParams, 'User');
      userGroups = await getUserGroups(userParams);
    }
    let userRoles = [];
    userGroups.forEach((group) => {
      userRoles.push(group.GroupName);
    })
    return userRoles;
  } catch (e) {
    return Promise.reject(e);
  }
}

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

export const isAdmin = (user) => {
  return (
    user.authType === 'iam'
    || (user.authType === 'authenticated' && user.roles.includes('Admin'))
  )
}

export const isEditor = (user) => {
  return (
    user.authType === 'iam'
    || (user.authType === 'authenticated' && user.roles.includes('Editor'))
  )
}

export const isUser = (user) => {
  return (
    user.authType === 'iam'
    || (user.authType === 'authenticated' && user.roles.includes('User'))
  );
}

export const isGuest = (user) => {
  return (user.authType === 'unauthenticated');
}

export const getUserFromEvent = async (event) => {
  logDebug({event});
  if (!event || !event.requestContext || !event.requestContext.identity) {
    return Promise.reject(new Error('Insufficient event data to get user'));
  }

  const {identity} = event.requestContext;
  const userIdentity = getUserIdentity(identity);
  const userParams = getUserParams(identity);
  let userData;

  if (isAuthenticated(identity)) {
    try {
      const cognitoUser = await cognitoISP.adminGetUser(userParams).promise();
      logDebug({cognitoUser});
      const userEmail = getUserAttribute(cognitoUser, 'email');
      const userName = getUserAttribute(cognitoUser, 'name');
      const userRoles = await getUserRoles(userParams);
      userData = {
        userParams,
        userIdentity,
        authType: identity.cognitoAuthenticationType,
        email: userEmail,
        name: userName,
        roles: userRoles,
      }
    } catch (e) {
      logError(e);
      return Promise.reject(e);
    }
  } else if (isUnauthenticated(identity)) {
    userData = {
      userIdentity,
      authType: identity.cognitoAuthenticationType,
    }
  } else if (isIAM(identity)) {
    userData = {
      authType: 'iam',
    }
  } else {
    return Promise.reject(new Error('No user found in event data'));
  }
  logDebug({userData});
  return userData;
}

export const getClientUserModel = (userRecord) => {
  const {id, email, name, roles} = userRecord;
  return {id, email, name, roles};
}
