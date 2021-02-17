import { buildResponse, success, failure } from '../../lib/response-lib';

async function getResource(user, id) {
  // uses id
  const message = 'single resource';
  console.log(message);
  const response = success({ data: message });
  return response;
}

async function deleteResource(user, id) {
  // uses id
  const message = 'deleted resource';
  console.log(message);
  const response = success({ data: message });
  return response;
}

async function patchResource(user, id, data) {
  // uses id, data
  const message = 'patched resource';
  console.log(message);
  const response = success({ data: message });
  return response;
}

async function editResource(user, id, data) {
  // uses user, id
  const message = 'edited resource';
  console.log(message);
  const response = success({ data: message });
  return response;
}

const itemHandlers = {
  DELETE: deleteResource,
  GET: getResource,
  PATCH: patchResource,
  PUT: editResource,
};

export default itemHandlers;
