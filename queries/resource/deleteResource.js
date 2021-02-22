import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const resourceTables = constants.tables.resource;

const deleteResource = async (id) => {
  const label = 'delete resource';
  const sql = `
    SELECT 'no-op';
  `;

  try {
    const result = await pgQuery(sql, [id], label);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
};

export default deleteResource;
