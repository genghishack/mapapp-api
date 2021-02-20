import {pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const getUser = async (id) => {
  const label = 'get user by id';
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

export default getUser;
