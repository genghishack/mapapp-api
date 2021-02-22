import Constants from '../constants';
import {getUserFromEvent} from './user-lib';
import {buildResponse, failure} from './response-lib';
import {logDebug, logError} from './logging-lib';

const getActionAndId = (pathParameters, idType) => {
  let action, id;
  if (pathParameters) {
    const {regex} = Constants;
    let {action: firstPathParam} = pathParameters;
    if (regex[idType].test(firstPathParam)) {
      id = pathParameters.action;
    } else {
      action = pathParameters.action;
      id = pathParameters.id;
    }
  }
  // logDebug({action, id});
  return { action, id };
}

const getUser = async (event, isPublic) => {
  let user = {};
  if (!isPublic) {
    user = await getUserFromEvent(event);
  }
  // logDebug({user});
  return user;
}

const getData = (body) => {
  let data;
  if (body) {
    data = JSON.parse(body);
  }
  // logDebug({data});
  return data;
}

const getHandlerSet = (handlers, action, id) => {
  let handlerSet = handlers.actionHandlers;
  if (!action && !id) {
    handlerSet = handlers.collectionHandlers;
  } else if (id && !action) {
    handlerSet = handlers.itemHandlers;
  }
  // logDebug({handlerSet});
  return handlerSet;
}

export const LambdaRouter = (options) => {
  const { handlers, idType, isPublic } = options;
  // logDebug({handlers, idType, isPublic});

  return async (event, context, callback) => {
    const {httpMethod, pathParameters, queryStringParameters, body} = event;
    // logDebug({httpMethod, pathParameters, queryStringParameters, body});

    const user = await getUser(event, isPublic)
    const { action, id } = getActionAndId(pathParameters, idType);
    const data = getData(body);
    const handlerSet = getHandlerSet(handlers, action, id);

    let response = buildResponse(405, {
      message: `Invalid HTTP Method: ${httpMethod}`,
    });

    try {
      if (httpMethod in handlerSet) {
        if (!action) {
          response = await handlerSet[httpMethod](user, id, data);
        } else if (action in handlerSet[httpMethod]) {
          response = await handlerSet[httpMethod][action](user, id, data);
        } else {
          response = buildResponse(406, {
            message: `Invalid Request: ${httpMethod} ${action}`,
          });
        }
      }
      return callback(null, response);
    } catch (e) {
      logError(e);
      return callback(null, failure({error: e.message}));
    }
  }
}
