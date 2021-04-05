import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const getResources = async () => {
  const label = 'list resources';
  const params = [];
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
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getResources;
