import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const getStates = async () => {
  const label = 'list states';
  const params = [];
  const sql = `
    SELECT *
    FROM layer_mgt.state_lookup
    ORDER BY name DESC;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getStates;
