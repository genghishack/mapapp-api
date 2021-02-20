import { buildResponse, success, failure } from '../../lib/response-lib';
import * as resourceLib from '../../lib/queries/resource-lib';
import {logDebug, logError} from "../../lib/logging-lib";

async function createResource(user, id, data) {
  if (user.type !== 'iam' && user.role !== 'User') {
    return failure({message: 'No access'})
  }
  let resource = {};
  try {
    resource = await resourceLib.createResource(user, data)
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
