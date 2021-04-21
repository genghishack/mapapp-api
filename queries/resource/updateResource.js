import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";
import {resourceColumns} from "./common";
import {geocode} from "../../lib/gis-lib";

const resourceTables = constants.tables.resource;

const updateResource = async (userId, id, data) => {
  const label = 'update resource';

  const params = [userId, id];
  const updateClause = [
    'updated_by = $1',
    'updated_at = NOW()',
  ];

  if (data.address) {
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
      ? data.name
      : addressFormatted;

    const location = await geocode(address);
    // logDebug({location})

    const {latLng: {lat, lng}} = location;

    updateClause.push(`latlng = ARRAY[${lat}, ${lng}]`);
  }

  Object.keys(data).forEach((key) => {
    if (key === 'address') {
      params.push(JSON.stringify(data.address));
      updateClause.push(`address_json = $${params.length}`)
    } else if (key === 'business') {
      params.push(data.business);
      updateClause.push(`business_name = $${params.length}`)
    } else {
      params.push(data[key]);
      updateClause.push(`${key} = $${params.length}`)
    }
  })

  const sql = `
    UPDATE ${resourceTables.main}
    SET ${updateClause.join(', ')}
    WHERE id = $2
    RETURNING ${resourceColumns}
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default updateResource;
