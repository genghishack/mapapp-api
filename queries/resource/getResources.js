import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const getResources = async () => {
  const label = 'list resources';
  const sql = `
    SELECT id, name, address_json, latlng
    FROM ${resourceTables.main}
  `;

  try {
    const result = await pgQuery(sql, [], label);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
};

export default getResources;
