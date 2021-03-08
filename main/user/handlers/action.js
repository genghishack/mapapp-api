import {success, failure, noAccess} from '../../../lib/response-lib';
import {logError, logDebug} from "../../../lib/logging-lib";
import {getClientUserModel, isGuest, isAdmin} from "../../../lib/user-lib";
import * as userQuery from '../../../queries/user-queries';
import {
  enableCognitoUser, disableCognitoUser, getAdminUserModel,
  listCognitoGroups, assignUserToRole, removeUserFromRole,
  updateUserAttribute,
} from "../../../lib/admin-lib";

const getOwnUser = async (user) => {
  if (isGuest(user)) return noAccess();

  let response = {};
  const {userParams: {Username: userId}} = user;
  try {
    let [userRecord] = await userQuery.getUser(userId);
    if (!userRecord) {
      [userRecord] = await userQuery.createUserOnSignup(user);
    } else {
      if (userRecord.roles !== user.roles
        || userRecord.email !== user.email
        || userRecord.name !== user.name
      ) {
        [userRecord] = await userQuery.updateCurrentUser(user);
      }
    }
    response = getClientUserModel(userRecord);
    return success({data: response, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const enableUser = async (user, id) => {
  if (!isAdmin(user)) return noAccess();

  const userParams = {
    Username: id,
    UserPoolId: user.userParams.UserPoolId
  }

  try {
    await enableCognitoUser(userParams);
    const userModel = await getAdminUserModel(user, userParams);
    return success({data: userModel, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const disableUser = async (user, id) => {
  if (!isAdmin(user)) return noAccess();

  const userParams = {
    Username: id,
    UserPoolId: user.userParams.UserPoolId
  }

  try {
    await disableCognitoUser(userParams);
    const userModel = await getAdminUserModel(user, userParams);
    return success({data: userModel, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const listRoles = async (user) => {
  if (!isAdmin(user)) return noAccess();

  const {userParams: {UserPoolId}} = user;
  try {
    const groups = await listCognitoGroups(UserPoolId);
    const roles = groups.map(group => {
      return group.GroupName;
    })
    return success({data: roles, count: roles.length});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const addUserRole = async (user, id, data) => {
  if (!isAdmin(user)) return noAccess();

  const {role} = data;
  const {userParams: {UserPoolId}} = user;
  const userParams = {
    Username: id,
    UserPoolId,
  }
  try {
    await assignUserToRole(userParams, role);
    const updatedUser = await getAdminUserModel(user, userParams);
    return success({data: updatedUser, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const removeUserRole = async (user, id, data) => {
  if (!isAdmin(user)) return noAccess();

  const {role} = data;
  const {userParams: {UserPoolId}} = user;
  const userParams = {
    Username: id,
    UserPoolId,
  }
  try {
    await removeUserFromRole(userParams, role);
    const updatedUser = await getAdminUserModel(user, userParams);
    return success({data: updatedUser, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const changeUserName = async (user, id, data) => {
  if (!isAdmin(user)) return noAccess;

  const userParams = {
    Username: id,
    UserPoolId: user.userParams.UserPoolId,
  }
  try {
    await updateUserAttribute(userParams, {
      Name: 'name',
      Value: data.name,
    });
    const updatedUser = await getAdminUserModel(user, userParams);
    return success({data: updatedUser, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const actionHandlers = {
  GET: {
    self: getOwnUser,
    roles: listRoles,
  },
  PATCH: {
    enable: enableUser,
    disable: disableUser,
    name: changeUserName,
  },
  PUT: {
    role: addUserRole,
  },
  DELETE: {
    role: removeUserRole,
  },
};

export default actionHandlers;
