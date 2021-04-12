import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";
import {reject} from "../../lib/error-lib";

const resourceTables = constants.tables.resource;

const deleteResource = async (id) => {
  const label = 'delete resource';
  const params = [id];

  const sql = `
    DELETE FROM ${resourceTables.main}
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default deleteResource;
