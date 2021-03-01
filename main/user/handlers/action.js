import {success, failure, noAccess} from '../../../lib/response-lib';
import {logError} from "../../../lib/logging-lib";
import {getClientUserModel, isGuest} from "../../../lib/user-lib";
import * as userQuery from '../../../queries/user-queries';

async function getOwnUser(user) {
  if (isGuest(user)) {
    return noAccess();
  }

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

const actionHandlers = {
  GET: {
    self: getOwnUser,
  },
};

export default actionHandlers;
