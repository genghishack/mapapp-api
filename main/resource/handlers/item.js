import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin, isEditor, isGuest, isUser} from "../../../lib/user-lib";
import * as resourceQuery from '../../../queries/resource-queries';

async function getResource(user, id) {
  if (isGuest(user)) return noAccess();

  let ownerId = '';
  let resource = {};
  try {
    if (isUser(user)) {
      ownerId = await resourceQuery.getResourceOwner(id);
    }
    if (isAdmin(user) || isEditor(user) || user.id === ownerId) {
      resource = await resourceQuery.getResource(id);
      // logDebug({resource});
    }
    return success({data: resource, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function deleteResource(user, id) {
  if (isGuest(user)) return noAccess();
  const {userParams: {Username: userId}} = user;

  let ownerId = '';
  let resource = {};
  try {
    if (isUser(user) || isEditor(user)) {
      ownerId = await resourceQuery.getResourceOwner(id);
      logDebug({ownerId});
    }
    if (isAdmin(user) || userId === ownerId) {
      resource = await  resourceQuery.deleteResource(id);
      // logDebug({resource});
    }
    return success({data: resource, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function editResource(user, id, data) {
  if (!isAdmin(user)) return noAccess();

  // uses id, data
  const message = 'edited resource';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function replaceResource(user, id, data) {
  if (!isAdmin(user)) return noAccess();

  // uses user, id
  const message = 'replaced resource';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const itemHandlers = {
  DELETE: deleteResource,
  GET: getResource,
  PATCH: editResource,
  PUT: replaceResource,
};

export default itemHandlers;
