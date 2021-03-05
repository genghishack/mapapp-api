import {success, failure, noAccess} from '../../../lib/response-lib';
import {logError, logDebug} from "../../../lib/logging-lib";
import {getClientUserModel, isGuest, isAdmin} from "../../../lib/user-lib";
import * as userQuery from '../../../queries/user-queries';
import {enableCognitoUser, disableCognitoUser, getCognitoUser, getAdminUserModel} from "../../../lib/admin-lib";

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
        [userRecord] = await userQuery.updateUser(user);
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
    const userModel = await getAdminUserModel(userParams);
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
    const userModel = await getAdminUserModel(userParams);
    return success({data: userModel, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const actionHandlers = {
  GET: {
    self: getOwnUser,
  },
  PATCH: {
    enable: enableUser,
    disable: disableUser,
  }
};

export default actionHandlers;
