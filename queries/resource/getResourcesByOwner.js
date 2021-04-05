import {reject} from "../../lib/error-lib";
import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const getResourcesByOwner = async (userId) => {
  const label = 'get resources by owner';
  const params = [userId];
  const sql = `
    SELECT 
      id, 
      name, 
      business_name,
      website,
      email,
      phone,
      fax,
      description, 
      address_json, 
      latlng
    FROM ${resourceTables.main}
    WHERE created_by = $1
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
}

export default getResourcesByOwner;
