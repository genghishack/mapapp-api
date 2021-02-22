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

export const getUserEmail = async (cognitoISP, userParams) => {
  try {
    const cognitoUser = await cognitoISP.adminGetUser(userParams).promise();
    logDebug({cognitoUser});
    const { UserAttributes } = cognitoUser;
    const [{ Value: userEmail }] = UserAttributes.filter(attr => attr.Name === 'email');
    return userEmail;
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

export const isUser = (user) => {
  return (user.roles.includes('User'));
}

export const getClientUserModel = (userRecord) => {
  const { id, email, roles } = userRecord;
  return { id, email, roles };
}
