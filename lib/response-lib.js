import {logDebug} from "./logging-lib";

export function buildResponse(statusCode, body) {
  // logDebug({body});
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
}

export const success = (body) => {
  return buildResponse(200, body);
}

export const failure = (body) => {
  return buildResponse(500, body);
}

export const noAccess = () => {
  return buildResponse(403, {message: 'Not Authorized'});
}
