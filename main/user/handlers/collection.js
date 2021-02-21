import { buildResponse, success, failure } from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import { AWS } from 'aws-sdk';

async function createUser(user, id, data) {
  // uses data
  const message = 'newly created user';
  logDebug(message, user, id, data);

  const response = success({ data: message });
  return response;
}

async function listUsers(user) {
  const message = 'list of users';
  logDebug(message);
  const response = success({ data: message });
  return response;
}

const collectionHandlers = {
  GET: listUsers,
  POST: createUser,
};

export default collectionHandlers;
