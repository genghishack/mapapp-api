import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import {selectResource} from "./common";

const getResources = async () => {
  const label = 'list resources';
  const params = [];
  const sql = selectResource;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getResources;
