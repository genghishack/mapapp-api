import { buildResponse, success, failure } from '../../lib/response-lib';
import * as resourceLib from '../../lib/resource-lib';
import {logError} from "../../lib/logging-lib";

async function createResource(user, id, data) {
  let resource = {};
  try {
    resource = await resourceLib.createResource(user, data)
    console.log({resource});
    return success({data: resource, count: 1});
  } catch (e) {
    logError(e)
    return failure({message: e.message});
  }
}

async function listResources(user) {
  const message = 'list of resources';
  console.log(message);
  const response = success({ data: message });
  return response;
}

const collectionHandlers = {
  GET: listResources,
  POST: createResource,
};

export default collectionHandlers;
