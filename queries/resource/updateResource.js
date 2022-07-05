import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import {resourceColumns} from "./common";
import {geocode} from "../../lib/gis-lib";

const updateResource = async (userId, id, data) => {
  const label = 'update resource';

  const params = [userId, id];
  const updateClause = [
    'updated_by = $1',
    'updated_at = NOW()',
  ];

  const name_json = {
    name_full: data.name,
    name_business: data.business,
  }

  const address_json = {...data.address};

  const phone_json = {
    main: data.phone_main,
    fax: data.phone_fax,
    cell: data.phone_cell,
  }

  const internet_json = {
    web: data.website,
    email: data.email,
  }

  const other_json = {}; // TODO: get "other" data from front end

  if (data.address) {
    const location = await geocode(address);
    // logDebug({location})

    const {latLng: {lat, lng}} = location;

    updateClause.push(`lat = ${lat}`, `lng = ${lng}`);
  }

  Object.keys(data).forEach((key) => {
    if (key === 'name') {
      params.push(JSON.stringify(name_json));
      updateClause.push(`name_json = $${params.length}`)
    } else if (key === 'address') {
      params.push(JSON.stringify(address_json));
      updateClause.push(`address_json = $${params.length}`)
    } else if (key === 'phone') {
      params.push(JSON.stringify(phone_json));
      updateClause.push(`phone_json = $${params.length}`)
    } else if (key === 'internet') {
      params.push(JSON.stringify(internet_json));
      updateClause.push(`internet_json = $${params.length}`)
    } else if (key === 'other') {
      params.push(JSON.stringify(other_json));
      updateClause.push(`phone_json = $${params.length}`)
    } else {
      params.push(data[key]);
      updateClause.push(`${key} = $${params.length}`)
    }
  })

  const sql = `
    UPDATE app.gis_resource
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
