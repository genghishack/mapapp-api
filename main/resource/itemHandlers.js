import { buildResponse, success, failure } from '../../lib/response-lib';
import {logDebug} from "../../lib/logging-lib";

async function getResource(user, id) {
  // uses id
  const message = 'single resource';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function deleteResource(user, id) {
  // uses id
  const message = 'deleted resource';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function patchResource(user, id, data) {
  // uses id, data
  const message = 'patched resource';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function editResource(user, id, data) {
  // uses user, id
  const message = 'edited resource';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

const itemHandlers = {
  DELETE: deleteResource,
  GET: getResource,
  PATCH: patchResource,
  PUT: editResource,
};

export default itemHandlers;
