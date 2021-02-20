import { buildResponse, success, failure } from '../../lib/response-lib';
import {logDebug} from "../../lib/logging-lib";

async function createFoo(user, id, data) {
  // uses data
  const message = 'newly created foo';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

async function listFoo(user) {
  const message = 'list of foo';
  console.log(message);
  const response = success({ data: message });
  return response;
}

const collectionHandlers = {
  GET: listFoo,
  POST: createFoo,
};

export default collectionHandlers;
