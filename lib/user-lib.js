import AWS from 'aws-sdk';
import { logDebug, logError } from './logging-lib';

export const getUserParams = (cognitoAP) => {
  const [userPoolId] = cognitoAP
    .split('/')[2]
    .split(':');
  const userSub = cognitoAP.split(':CognitoSignIn:')[1];
  return { UserPoolId: userPoolId, Username: userSub };
}

export const getUserIdentity = (identity) => {
  return {
    federatedId: identity.cognitoIdentityId,
    identityPoolId: identity.cognitoIdentityPoolId,
  }
}

export const getUserAttribute = async (cognitoISP, userParams, attrName) => {
  try {
    const cognitoUser = await cognitoISP.adminGetUser(userParams).promise();
    logDebug({cognitoUser});
    const { UserAttributes } = cognitoUser;
    const [{ Value }] = UserAttributes.filter(attr => attr.Name === attrName);
    return Value;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getUserGroups = async (cognitoISP, userParams) => {
  try {
    const cognitoGroups = await cognitoISP.adminListGroupsForUser(userParams).promise();
    logDebug({cognitoGroups});
    const { Groups: userGroups } = cognitoGroups;
    return userGroups;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getUserFromEvent = async (event) => {
  logDebug({event});
  if (!event || !event.requestContext || !event.requestContext.identity) {
    return Promise.reject(new Error('Insufficient event data to get user'));
  }

  const identity = event.requestContext.identity;
  const {
    cognitoAuthenticationProvider : cognitoAP,
    userArn,
  } = identity;

  if (cognitoAP) {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18'
    });
    const userParams = getUserParams(cognitoAP);
    const userIdentity = getUserIdentity(identity);

    try {
      const userEmail = await getUserAttribute(cognitoISP, userParams, 'email');
      const userName = await getUserAttribute(cognitoISP, userParams, 'name');
      const userRoles = await getUserRoles(cognitoISP, userParams);
      const userData = {
        userParams,
        userIdentity,
        email: userEmail,
        name: userName,
        roles: userRoles,
        type: 'cognito',
      }
      logDebug({userData});
      return userData;
    } catch (e) {
      logError(e);
      return Promise.reject(e);
    }
  } else if (userArn) {
    return {
      id: identity.accountId,
      arn: userArn,
      type: 'iam',
    }
  } else {
    return Promise.reject(new Error('No user found in event data'));
  }
}

export const assignUserToRole = async (cognitoISP, userParams, role) => {
  try {
    return cognitoISP.adminAddUserToGroup({...userParams, GroupName: role}).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getUserRoles = async (cognitoISP, userParams) => {
  try {
    let userGroups = await getUserGroups(cognitoISP, userParams);
    if (!userGroups.length) {
      await assignUserToRole(cognitoISP, userParams, 'User');
      userGroups = await getUserGroups(cognitoISP, userParams);
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

export const isAdmin = (user) => {
  return (user.type === 'iam' || user.roles.includes('Admin'))
}

export const isEditor = (user) => {
  return (user.type === 'iam' || user.roles.includes('Editor'))
}

export const isUser = (user) => {
  return (user.type === 'iam' || user.roles.includes('User'));
}

export const getClientUserModel = (userRecord) => {
  const { id, email, name, roles } = userRecord;
  return { id, email, name, roles };
}
