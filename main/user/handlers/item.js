import {failure, noAccess, success} from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";
import {deleteCognitoUser} from "../../../lib/cognito-lib";
import * as userQuery from '../../../queries/user-queries';

const getUser = async (user, id) => {
  if (!isAdmin(user)) return noAccess();

  const message = 'single user';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const deleteUser = async (user, id) => {
  if (!isAdmin(user)) return noAccess();

  const {userParams: {UserPoolId}} = user;
  const userParams = {
    Username: id,
    UserPoolId,
  }
  try {
    const deletedUser = await userQuery.deleteUser(id);
    await deleteCognitoUser(userParams);
    return success({data: deletedUser, count: 1});
  } catch (e) {
    return failure(e);
  }
}

const editUser = async (user, id, data) => {
  if (!isAdmin(user)) return noAccess();

  const message = 'edited user';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const replaceUser = async (user, id, data) => {
  if (!isAdmin(user)) return noAccess();

  const message = 'replaced user';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const itemHandlers = {
  DELETE: deleteUser,
  GET: getUser,
  PATCH: editUser,
  PUT: replaceUser,
};

export default itemHandlers;
