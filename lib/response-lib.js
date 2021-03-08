import {logError} from "./logging-lib";

export function buildResponse(statusCode, body) {
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

export const noAccess = () => {
  return buildResponse(403, {message: 'Not Authorized'});
}

export const invalidMethod = (httpMethod) => {
  return buildResponse(405, {
    message: `Invalid HTTP Method: ${httpMethod}`,
  });
}

export const invalidRequest = (httpMethod, action) => {
  return buildResponse(406, {
    message: `Invalid Request: ${httpMethod} ${action}`,
  });
}

export const failure = (e) => {
  logError(e);
  return buildResponse(500, {message: e.message});
}
