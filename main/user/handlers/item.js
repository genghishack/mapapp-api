import {noAccess, success} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";

async function getUser(user, id) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id
  const message = 'single user';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function deleteUser(user, id) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id
  const message = 'deleted user';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function editUser(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses id, data
  const message = 'edited user';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function replaceUser(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses user, id
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
