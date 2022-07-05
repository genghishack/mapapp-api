import {success, noAccess} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";

async function getState(user, id) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id
  const message = 'single state';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function deleteState(user, id) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id
  const message = 'deleted state';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function editState(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id, data
  const message = 'edited state';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function replaceState(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses user, id
  const message = 'replaced state';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const itemHandlers = {
  DELETE: deleteState,
  GET: getState,
  PATCH: editState,
  PUT: replaceState,
};

export default itemHandlers;
