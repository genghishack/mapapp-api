import {pgQuery, pgCleanString} from '../lib/postgres-lib';
import { geocode } from '../lib/gis-lib';
import getResource from "./resource/getResource";
import getResources from "./resource/getResources";

const resourceTable = 'gis_resource';

export { getResource, getResources };

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
    address.street_1,
    address.street_2,
    address.city,
    address.state,
    address.country,
    address.postalCode
  ].forEach(item => {
    if (item && item.trim() !== '') {
      addressArray.push(item);
    }
  })
  const addressFormatted = addressArray.join(', ');

  const name = data.name
    ? pgCleanString(data.name)
    : pgCleanString(addressFormatted);
  const params = [name, addressString]
  const location = await geocode(address);
  // logDebug({location})
  const { latLng: {lat, lng} } = location;

  const sql = `
    INSERT INTO ${resourceTable} (name, address_json, latlng)
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
