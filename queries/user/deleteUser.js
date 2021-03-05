import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const deleteUser = async (id) => {
  const label = 'delete user';
  let params = [id]

  const sql = `
    DELETE FROM ${userTables.main}
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export default deleteUser;
