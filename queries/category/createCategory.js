import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const createCategory = async (user, data) => {
  if (!data.name) {
    return reject(new Error('No category name provided'))
  }
  const label = 'create category';

  const name = data.name;

  const params = [
    user.userParams.Username,
    name,
  ]

  const sql = `
    INSERT INTO app.gis_category (
      name,
      properties_json,
      created_at,
      created_by,
      updated_at,
      updated_by
    )
    VALUES ($2, '{}', NOW(), $1, NOW(), $1)
    RETURNING *
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default createCategory;
