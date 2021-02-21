import { buildResponse, success, failure } from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin, isUser, getClientUserModel} from "../../../lib/user-lib";
import * as userQuery from '../../../queries/user-queries';

async function getOwnUser(user) {
  if (!isUser(user)) {
    return failure({message: 'No access'});
  }

  let response = {};
  const { userParams: { Username: userId } } = user;
  try {
    let [userRecord] = await userQuery.getUser(userId);
    if (userRecord.roles !== user.roles || userRecord.email !== user.email) {
      [userRecord] = await userQuery.updateUser(user);
    }
    response = getClientUserModel(userRecord);
    return success({data: response, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const actionHandlers = {
  GET: {
    self: getOwnUser,
  },
};

export default actionHandlers;
