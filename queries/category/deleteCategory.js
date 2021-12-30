import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";
import {reject} from "../../lib/error-lib";

const categoryTables = constants.tables.category;

const deleteCategory = async (id) => {
  const label = 'delete category';
  const params = [id];

  const sql = `
    DELETE FROM ${categoryTables.main}
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
