import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const deleteUser = async (id) => {
  const label = 'delete user';
  let params = []

  const sql = `
    SELECT 'no-op';
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export default deleteUser;
