import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const updateResource = async (user, id, data) => {
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

export default updateResource;
