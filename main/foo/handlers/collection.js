import {success, noAccess} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";

async function createFoo(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses data
  const message = 'newly created foo';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function listFoo(user) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  const message = 'list of foo';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const collectionHandlers = {
  GET: listFoo,
  POST: createFoo,
};

export default collectionHandlers;
