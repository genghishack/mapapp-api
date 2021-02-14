import collectionHandlers from './resource/collectionHandlers';
import itemHandlers from './resource/itemHandlers';
import actionHandlers from './resource/actionHandlers';
import constants from '../constants';
import { getUserFromEvent } from '../lib/event-lib';
import { buildResponse, failure } from '../lib/response-lib';
import { logError } from '../lib/logging-lib';

const { regex } = constants;

const idType = 'uuid';
// Calls to the 'public/resource' set of endpoints are PUBLICLY ACCESSIBLE.
const isPublic = true;

/**
 * Route the call to '/resource', '/resource/{id}' and '/resource/{action}/{id}' end points
 *
 * @export
 * @param {Object} event
 * @param {Object} context
 * @param {function} callback
 */
export async function router(event, context, callback) {
  const { httpMethod, pathParameters, queryStringParameters, body } = event;

  console.log('event: ', event);
  console.log('httpMethod: ', httpMethod);
  console.log('pathParameters: ', pathParameters);
  console.log('body: ', body);

  let action;
  let id;
  let data;

  let userData = {};
  if (!isPublic) {
    userData = await getUserFromEvent(event);
  }
  console.log('userData: ', userData);

  if (body) {
    data = JSON.parse(body);
  }

  if (pathParameters) {
    let { action: stringToTest } = pathParameters;
    if (regex[idType].test(stringToTest)) {
      id = pathParameters.action;
    } else {
      action = pathParameters.action;
      id = pathParameters.id;
    }
  }

  // console.log('action: ', action, 'id: ', id);

  let response = buildResponse(405, {
    message: `Invalid HTTP Method: ${httpMethod}`,
  });

  let handlers = actionHandlers;
  if (!action && !id) {
    handlers = collectionHandlers;
  } else if (id && !action) {
    handlers = itemHandlers;
  }

  try {
    if (httpMethod in handlers) {
      if (!action) {
        response = await handlers[httpMethod](userData, id, data, queryStringParameters);
      } else if (action in handlers[httpMethod]) {
        response = await handlers[httpMethod][action](userData, id, data, queryStringParameters);
      } else {
        response = buildResponse(406, {
          message: `Invalid Request: ${httpMethod} ${action}`,
        });
      }
    }
    return callback(null, response);
  } catch (e) {
    logError(e);
    return callback(null, failure({ error: e.message }));
  }
}
