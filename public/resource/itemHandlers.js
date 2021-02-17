import {buildResponse, success, failure} from '../../lib/response-lib';
import {logDebug, logError} from '../../lib/logging-lib';
import * as resourceLib from '../../lib/queries/resource-lib';

// open to anonymous users
async function getResource(user, id) {
  let resource = {};
  try {
    resource = await resourceLib.getResource(id);
    logDebug({resource});
    return success({data: resource, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const itemHandlers = {
  GET: getResource,
};

export default itemHandlers;
