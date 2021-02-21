import { buildResponse, success, failure } from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin, isUser, getClientUserModel} from "../../../lib/user-lib";
import * as userQuery from '../../../queries/user-queries';

async function createUser(user, id, data) {
  if (!isAdmin(user) && !isUser(user)) {
    return failure({message: 'No access'});
  }

  let response = {};
  try {
    if (isAdmin(user)) {
      // TODO: Do something only admins can do - like create another user
    } else if (isUser(user)) {
      // Regular users can only create their own record from the event data
      const [newUserRecord] = await userQuery.createUserOnSignup(user);
      response = getClientUserModel(newUserRecord);
    }
    return success({data: response, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

async function listUsers(user) {
  const message = 'list of users';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

const collectionHandlers = {
  GET: listUsers,
  POST: createUser,
};

export default collectionHandlers;
