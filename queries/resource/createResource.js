import {pgQuery} from "../../lib/postgres-lib";
import {geocode} from "../../lib/gis-lib";
import {reject} from "../../lib/error-lib";

const createResource = async (user, data) => {
  if (!data.name) {
    return reject(new Error('No name provided'))
  }
  const label = 'create resource';

  const name_json = {
    name_full: data.name,
    name_business: data.business,
  };

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

  const params = [
    user.userParams.Username,
    JSON.stringify(name_json),
    JSON.stringify(address_json),
    JSON.stringify(phone_json),
    JSON.stringify(internet_json),
    JSON.stringify(other_json),
    data.description,
  ]

  const location = await geocode(address_json);
  // logDebug({location})

  const {latLng: {lat, lng}} = location;

  const sql = `
    INSERT INTO app.gis_resource (
      name_json,
      address_json,
      phone_json,
      internet_json,
      other_json,
      description,
      lat,
      lng,
      created_at,
      created_by,
      updated_at,
      updated_by
    )
    VALUES ($2, $3, $4, $5, $6, $7, ${lat}, ${lng}, NOW(), $1, NOW(), $1)
    RETURNING *
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default createResource;
