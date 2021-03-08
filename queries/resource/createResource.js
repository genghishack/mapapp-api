import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import {geocode} from "../../lib/gis-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const createResource = async (user, data) => {
  if (!data.address) {
    return reject(new Error('No address provided'))
  }
  const label = 'create resource';

  const {address} = data;
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
  const params = [
    user.userParams.Username,
    name,
    pgCleanString(JSON.stringify(address))
  ]
  const location = await geocode(address);
  // logDebug({location})
  const {latLng: {lat, lng}} = location;

  const sql = `
    INSERT INTO ${resourceTables.main} (
      name, 
      address_json, 
      latlng,
      created_at,
      created_by,
      updated_at,
      updated_by
    )
    VALUES ($2, $3, ARRAY[${lat}, ${lng}], NOW(), $1, NOW(), $1)
    RETURNING *
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default createResource;
