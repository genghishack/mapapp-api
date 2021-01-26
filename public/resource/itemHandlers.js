import {buildResponse, success, failure} from '../../lib/response-lib';
import {logError} from '../../lib/logging';
import * as resourceLib from '../../lib/resource';

// open to anonymous users
async function getResource(user, id) {
  let resource = {};
  try {
    resource = await resourceLib.getResource(id);
    console.log({resource});
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
