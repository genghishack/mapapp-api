import { buildResponse, success, failure } from '../../../lib/response-lib';
import * as resourceLib from "../../../queries/resource-queries";
import {logError} from "../../../lib/logging-lib";

// open to anonymous users
async function listResources(user, id, data, params) {
  let date = null;
  if (params && params.date) {
    ({ date } = params);
  }

  let resources = [];
  try {
    resources = await resourceLib.getResources()
    // logDebug({resources});
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
