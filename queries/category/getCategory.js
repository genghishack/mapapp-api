import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const getCategory = async (id) => {
  const label = 'get resource by id';
  const params = [id];
  const sql = `
    SELECT *
    FROM app.gis_category
    WHERE id = $1;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getCategory;
