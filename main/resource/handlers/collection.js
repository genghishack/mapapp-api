import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin, isEditor} from '../../../lib/user-lib';
import * as resourceQuery from '../../../queries/resource-queries';

async function createResource(user, id, data) {
  if (!isAdmin(user) && !isEditor(user)) {
    return noAccess();
  }

  let resource = {};
  try {
    resource = await resourceQuery.createResource(user, data)
    return success({data: resource, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function listResources(user, id, data, params) {
  let resources = [];
  try {
    resources = await resourceQuery.getResources();
    logDebug({resources});
    return success({data: resources, count: resources.length});
  } catch (e) {
    return failure(e);
  }
}

const collectionHandlers = {
  GET: listResources,
  POST: createResource,
};

export default collectionHandlers;
