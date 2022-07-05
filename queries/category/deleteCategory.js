import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const deleteCategory = async (id) => {
  const label = 'delete category';
  const params = [id];

  const sql = `
    DELETE FROM app.gis_category
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default deleteCategory;
