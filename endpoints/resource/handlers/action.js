import {failure, noAccess, success} from "../../../lib/response-lib";
import {isAdmin, isGuest} from "../../../lib/user-lib";
import {logDebug} from "../../../lib/logging-lib";
import * as resourceQuery from '../../../queries/resource-queries';

// TODO: Since this uses userId it should be moved to a user endpoint
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

const listPublicResources = async (user) => {
  let publicResources = [];
  try {
    publicResources = await resourceQuery.getPublicResources();
    logDebug({publicResources});
    return success({data: publicResources, count: publicResources.length});
  } catch (e) {
    return failure(e);
  }
}

const submitResourceForApproval = async (user, id) => {
  if (isGuest(user)) return noAccess();
  logDebug({user});
  const {userParams: {Username: userId}} = user;

  let resource = {};
  try {
    resource = await resourceQuery.getResource(id);
    if (resource) {
      [resource] = await resourceQuery.updateResource(userId, id, {submitted_for_approval: true})
    }
    return success({data: resource, count: 1})
  } catch (e) {
    return failure(e);
  }
}

const actionHandlers = {
  GET: {
    user: listResourcesByOwner,
    public: listPublicResources,
  },
  PATCH: {
    submit: submitResourceForApproval,
  }
};

export default actionHandlers;
