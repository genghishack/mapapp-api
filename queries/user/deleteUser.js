import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const deleteUser = async (id) => {
  const label = 'delete user';
  let params = [id]

  const sql = `
    DELETE FROM app.user
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default deleteUser;
