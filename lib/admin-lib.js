import AWS from 'aws-sdk';
import {getUserAttribute, getUserRoles} from "./user-lib";
import {getUser, updateUser} from '../queries/user-queries';
import {logDebug} from "./logging-lib";

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

export const removeUserFromRole = async (userParams, role) => {
  try {
    return cognitoISP.adminRemoveUserFromGroup({...userParams, GroupName: role}).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const listCognitoUsers = async (UserPoolId) => {
  try {
    const {Users} = await cognitoISP.listUsers({UserPoolId}).promise();
    return Users;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const listCognitoGroups = async (UserPoolId) => {
  try {
    const {Groups} = await cognitoISP.listGroups({UserPoolId}).promise();
    return Groups;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getCognitoUser = async (userParams) => {
  try {
    return cognitoISP.adminGetUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const deleteCognitoUser = async (userParams) => {
  try {
    return cognitoISP.adminDeleteUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const enableCognitoUser = async (userParams) => {
  try {
    return cognitoISP.adminEnableUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const disableCognitoUser = async (userParams) => {
  try {
    return cognitoISP.adminDisableUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const updateUserAttribute = async (userParams, attr) => {
  try {
    return cognitoISP.adminUpdateUserAttributes({
      ...userParams,
      UserAttributes: [attr]
    }).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getAdminUserModel = async (adminUser, userParams, cognitoUser = null) => {
  try {
    cognitoUser = cognitoUser || await getCognitoUser(userParams)
    let [dbRecord] = await getUser(userParams.Username);
    logDebug({cognitoUser, dbRecord});
    const roles = await getUserRoles(userParams);
    const user = {
      id: getUserAttribute(cognitoUser, 'sub'),
      name: getUserAttribute(cognitoUser, 'name'),
      email: getUserAttribute(cognitoUser, 'email'),
      email_verified: getUserAttribute(cognitoUser, 'email_verified'),
      enabled: cognitoUser.Enabled,
      status: cognitoUser.UserStatus,
      roles,
    };
    if (dbRecord) {
      if (dbRecord.roles !== user.roles
        || dbRecord.email !== user.email
        || dbRecord.name !== user.name
      ) {
        [dbRecord] = await updateUser(adminUser, user);
      }
    }
    return {
      ...user,
      cognitoUser,
      dbRecord
    }
  } catch (e) {
    return Promise.reject(e);
  }
}
