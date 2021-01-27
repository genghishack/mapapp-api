import { buildResponse, success, failure } from '../../lib/response-lib';
import * as resourceLib from "../../lib/resource";
import {logError} from "../../lib/logging";

// open to anonymous users
async function listResources(user, id, data, params) {
  let date = null;
  if (params && params.date) {
    ({ date } = params);
  }

  let resources = [];
  try {
    resources = await resourceLib.getResources()
    console.log('resources: ', resources);
    return success({data: resources, count: resources.length});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const collectionHandlers = {
  GET: listResources,
};

export default collectionHandlers;
