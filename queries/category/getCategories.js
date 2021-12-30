import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const categoryTables = constants.tables.category;

const getCategories = async () => {
  const label = 'list categories';
  const params = [];
  const sql = `
    SELECT id, name
    FROM ${categoryTables.main}
    ORDER BY name DESC;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getCategories;
