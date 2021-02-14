import {pgParameters, pgQuery, pgCleanString} from './postgres-lib';
import constants from '../constants';
import { geocode } from '../lib/gis-lib';

const { regex } = constants;

const resourceTable = 'gis_resource';

export const getResource = async (id) => {
  const label = 'get resource by id';
  const sql = `
    SELECT id, name, address, latlng
    FROM ${resourceTable}
    WHERE id = $1
  `;

  try {
    return await pgQuery(sql, [id], label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getResources = async () => {
  const label = 'list resources';
  const sql = `
    SELECT id, name, address, latlng
    FROM gis_resource
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
  if (!data.address) {
    return Promise.reject({message: 'No address provided'})
  }
  const label = 'create resource';

  const { address } = data;
  const addressString = pgCleanString(JSON.stringify(address));
  const addressArray = [];
  [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postalCode
  ].forEach(item => {
    if (item.trim() !== '') {
      addressArray.push(item);
    }
  })
  const addressFormatted = addressArray.join(', ');

  const name = data.name
    ? pgCleanString(data.name)
    : pgCleanString(addressFormatted);
  const params = [name, addressString]
  const location = await geocode(address);
  // console.log({location})
  const  { latLng: {lat, lng} } = location;

  const sql = `
    INSERT INTO ${resourceTable} (name, address, latlng)
    VALUES ($1, $2, ARRAY[${lat}, ${lng}])
    RETURNING *
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
