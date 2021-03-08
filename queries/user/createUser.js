import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const createUser = async (user, data) => {
  const label = 'create user';
  let params = []

  const sql = `
    SELECT 'no-op';
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default createUser;
