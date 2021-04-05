import {failure, noAccess, success} from "../../../lib/response-lib";
import {isAdmin, isGuest} from "../../../lib/user-lib";
import {logDebug} from "../../../lib/logging-lib";
import * as resourceQuery from '../../../queries/resource-queries';

const listResourcesByOwner = async (user, id) => {
  if (isGuest(user)) return noAccess();
  const {userParams: {Username: userId}} = user;
  if (!isAdmin(user) && userId !== id) return noAccess();

  let userResources = [];
  try {
    userResources = await resourceQuery.getResourcesByOwner(id);
    logDebug({userResources});
    return success({data: userResources, count: userResources.length});
  } catch (e) {
    return failure(e);
  }
}

const actionHandlers = {
  GET: {
    user: listResourcesByOwner,
  },
};

export default actionHandlers;
