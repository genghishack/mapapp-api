import AWS from 'aws-sdk';
import { logDebug, logError } from './logging-lib';
import {getUserAttribute, getUserRoles} from "./user-lib";

const cognitoISP = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

export const assignUserToRole = async (userParams, role) => {
  try {
    return cognitoISP.adminAddUserToGroup({...userParams, GroupName: role}).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const listCognitoUsers = async (UserPoolId) => {
  const data = await cognitoISP.listUsers({UserPoolId}).promise();
  return data.Users;
}

export const getAdminUserModel = async (cognitoUser, dbRecord, UserPoolId) => {
  const userParams = {
    Username: cognitoUser.Username,
    UserPoolId,
  };

  const roles = await getUserRoles(userParams);
  return {
    id: getUserAttribute(cognitoUser, 'sub'),
    name: getUserAttribute(cognitoUser, 'name'),
    email: getUserAttribute(cognitoUser, 'email'),
    email_verified: getUserAttribute(cognitoUser, 'email_verified'),
    enabled: cognitoUser.Enabled,
    status: cognitoUser.UserStatus,
    roles,
    cognitoUser,
    dbRecord
  }
}
