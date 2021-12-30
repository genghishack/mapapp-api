import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const categoryTables = constants.tables.category;

const updateCategory = async (userId, id, data) => {
  const label = 'update category';

  const params = [userId, id];
  const updateClause = [
    'updated_by = $1',
    'updated_at = NOW()',
  ];

  Object.keys(data).forEach((key) => {
      params.push(data[key]);
      updateClause.push(`${key} = $${params.length}`)
  })

  const sql = `
    UPDATE ${categoryTables.main}
    SET ${updateClause.join(', ')}
    WHERE id = $2
    RETURNING *
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default updateCategory;
