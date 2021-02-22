import { buildResponse, success, failure } from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";

async function getUser(user, id) {
  // uses id
  const message = 'single user';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function deleteUser(user, id) {
  // uses id
  const message = 'deleted user';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function editUser(user, id, data) {
  // uses id, data
  const message = 'edited user';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function replaceUser(user, id, data) {
  // uses user, id
  const message = 'replaced user';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

const itemHandlers = {
  DELETE: deleteUser,
  GET: getUser,
  PATCH: editUser,
  PUT: replaceUser,
};

export default itemHandlers;
