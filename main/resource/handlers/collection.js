import { buildResponse, success, failure } from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import { isAdmin } from '../../../lib/user-lib';
import * as resourceQuery from '../../../queries/resource-queries';

async function createResource(user, id, data) {
  if (!isAdmin(user)) {
    return failure({message: 'No access'});
  }

  let resource = {};
  try {
    resource = await resourceQuery.createResource(user, data)
    return success({data: resource, count: 1});
  } catch (e) {
    logError(e)
    return failure({message: e.message});
  }
}

async function listResources(user) {
  const message = 'list of resources';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

const collectionHandlers = {
  GET: listResources,
  POST: createResource,
};

export default collectionHandlers;
