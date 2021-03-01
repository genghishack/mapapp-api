import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const updateUser = async (user, id, data) => {
  const label = 'update user';
  let params = []
  let sql = '';

  if (!id && !data) {
    // Update the current user's record to match what's in cognito
    params = [
      user.userParams.Username,
      pgCleanString(user.email),
      pgCleanString(user.name),
      JSON.stringify(user.roles),
    ]
    sql = `
      UPDATE ${userTables.main}
      SET
        email = $2,
        name = $3,
        roles = $4,
        updated_at = NOW(),
        updated_by = $1
      WHERE id = $1
      RETURNING *;
    `;
  }

  try {
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export default updateUser;
