import {reject} from "../../lib/error-lib";
import {pgQuery} from "../../lib/postgres-lib";
import {selectResource} from "./common";

const getResourcesByOwner = async (userId) => {
  const label = 'get resources by owner';
  const params = [userId];
  const sql = `
    ${selectResource}
    WHERE created_by = $1
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
}

export default getResourcesByOwner;
