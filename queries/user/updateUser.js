import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const updateUser = async (adminUser, user) => {
  const label = 'update user';

  const params = [
    user.id,
    pgCleanString(user.email),
    pgCleanString(user.name),
    JSON.stringify(user.roles),
    adminUser.userParams.Username,
  ]
  const sql = `
    UPDATE ${userTables.main}
    SET
      email = $2,
      name = $3,
      roles = $4,
      updated_at = NOW(),
      updated_by = $5
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
}


export default updateUser;
