import { buildResponse, success, failure } from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";

async function getFoo(user, id) {
  // uses id
  const message = 'single foo';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function deleteFoo(user, id) {
  // uses id
  const message = 'deleted foo';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function editFoo(user, id, data) {
  // uses id, data
  const message = 'edited foo';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function replaceFoo(user, id, data) {
  // uses user, id
  const message = 'replaced foo';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

const itemHandlers = {
  DELETE: deleteFoo,
  GET: getFoo,
  PATCH: editFoo,
  PUT: replaceFoo,
};

export default itemHandlers;
