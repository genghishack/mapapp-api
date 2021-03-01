import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin, isEditor} from '../../../lib/user-lib';
import * as resourceQuery from '../../../queries/resource-queries';
import * as resourceLib from "../../../queries/resource-queries";

async function createResource(user, id, data) {
  if (!isAdmin(user) && !isEditor(user)) {
    return noAccess();
  }

  let resource = {};
  try {
    resource = await resourceQuery.createResource(user, data)
    return success({data: resource, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

async function listResources(user, id, data, params) {
  let date = null;
  if (params && params.date) {
    ({date} = params);
  }

  let resources = [];
  try {
    resources = await resourceLib.getResources()
    logDebug({resources});
    return success({data: resources, count: resources.length});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const collectionHandlers = {
  GET: listResources,
  POST: createResource,
};

export default collectionHandlers;
