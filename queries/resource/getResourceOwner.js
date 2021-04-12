import constants from "../../constants";
import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import {logDebug} from "../../lib/logging-lib";

const resourceTables = constants.tables.resource;

const getResourceOwner = async (id) => {
  const label = 'get resource owner';
  const params = [id];

  const sql = `
    SELECT created_by
    FROM ${resourceTables.main}
    WHERE id = $1
  `;

  try {
    const result = await pgQuery(sql, params, label);
    // TODO: handle if no resource found or no owner found
    return result[0].created_by;
  } catch (e) {
    return reject(e);
  }
};

export default getResourceOwner;
