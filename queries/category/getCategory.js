import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const categoryTables = constants.tables.category;

const getCategory = async (id) => {
  const label = 'get resource by id';
  const params = [id];
  const sql = `
    SELECT id, name
    FROM ${categoryTables.main}
    WHERE id = $1;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getCategory;
