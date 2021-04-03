import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const getResource = async (id) => {
  const label = 'get resource by id';
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
    WHERE id = $1
  `;

  try {
    return pgQuery(sql, [id], label);
  } catch (e) {
    return reject(e);
  }
};

export default getResource;
