import {pgParams, pgQuery} from './postgres';
import constants from '../lib/constants';

const { regex } = constants;

export const getResource = async (id) => {
  const label = 'get resource by id';
  const sql = `
    SELECT id, name, address, latlng
    FROM gis_resource
    WHERE id = $1
  `;

  try {
    return await pgQuery(sql, [id], label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getAllResourcesByDate = async (date = null) => {
  const label = 'list resources';
  const sql = `
    SELECT 'list of resources'
  `;

  try {
    const result = await pgQuery(sql, [], label);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteResource = async (id) => {
  const label = 'delete resource';
  const sql = `
    SELECT 'no-op';
  `;

  try {
    const result = await pgQuery(sql, [id], label);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const createResource = async (user, data) => {
  const label = 'create resource';
  let name = '';

  if (data.name) {
    name = data.name.replace(/'/g, "''");
  }

  let params = []

  // TODO: error handle inputs, such as no name, type or URL provided
  const sql = `
    SELECT 'no-op';
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateResource = async (user, id, data) => {
  const label = 'update resource';
  let name = '';

  let params = []

  if (data.name) {
    name = data.name.replace(/'/g, "''");
  }

  const sql = `
    SELECT 'no-op';
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};
