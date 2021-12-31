import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const getCategories = async () => {
  const label = 'list categories';
  const params = [];
  const sql = `
    SELECT id, name
    FROM app.gis_category
    ORDER BY name DESC;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getCategories;
