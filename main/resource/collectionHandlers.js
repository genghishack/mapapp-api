import { buildResponse, success, failure } from '../../lib/response-lib';

async function createResource(user, id, data) {
  // uses data
  const message = 'newly created resource';
  console.log(message);
  const response = success({ data: message });
  return response;
}

async function listResources(user) {
  const message = 'list of resources';
  console.log(message);
  const response = success({ data: message });
  return response;
}

const collectionHandlers = {
  GET: listResources,
  POST: createResource,
};

export default collectionHandlers;
