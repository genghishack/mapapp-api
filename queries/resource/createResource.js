import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import {geocode} from "../../lib/gis-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const createResource = async (user, data) => {
  if (!data.address) {
    return Promise.reject({message: 'No address provided'})
  }
  const label = 'create resource';

  const {address} = data;
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
  const {latLng: {lat, lng}} = location;

  const sql = `
    INSERT INTO ${resourceTables.main} (name, address_json, latlng)
    VALUES ($1, $2, ARRAY[${lat}, ${lng}])
    RETURNING *
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export default createResource;
