import {success, noAccess} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";
import * as stateQuery from "../../../queries/state-queries";

async function createState(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses data
  const message = 'newly created state';
  logDebug(message);
  const response = success({data: message});
  return response;
}

async function listStates(user) {
  let states = [];
  try {
    states = await stateQuery.getStates();
    logDebug({states});
    return success({data: states, count: states.length});
  } catch (e) {
    return failure(e);
  }
}

const collectionHandlers = {
  GET: listStates,
  POST: createState,
};

export default collectionHandlers;
