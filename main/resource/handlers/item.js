import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";
import * as resourceQuery from '../../../queries/resource-queries';

async function getResource(user, id) {
  let resource = {};
  try {
    resource = await resourceQuery.getResource(id);
    // logDebug({resource});
    return success({data: resource, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function deleteResource(user, id) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id
  const message = 'deleted resource';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function editResource(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id, data
  const message = 'edited resource';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function replaceResource(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
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
