import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const deleteResource = async (id) => {
  const label = 'delete resource';
  const params = [id];

  const sql = `
    DELETE FROM app.gis_resource
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
