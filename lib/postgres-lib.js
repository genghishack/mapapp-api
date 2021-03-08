import pg from 'pg';
import { logDebug } from './logging-lib';
import {reject} from "./error-lib";

const getPgClient = async () => {
  const {DB_HOST, DB_NAME, DB_USER, DB_PASS} = process.env;
  const pgConnectionString = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
  try {
    const pgClient = new pg.Client(pgConnectionString);
    return Promise.resolve(pgClient);
  } catch (e) {
    return reject(new Error('Unable to create DB client'));
  }
};

export const pgQuery = async (sql, parameters, label) => {
  if (!sql) {
    return reject(new Error('No SQL provided for query'));
  }
  const sqlLabel = (label) ? `SQL query to ${label}` : 'SQL query';
  logDebug(`${sqlLabel}: `, sql);

  let pgClient = { end: () => {} };

  try {
    pgClient = await getPgClient();
    pgClient.connect();
    const result = await pgClient.query(sql, parameters);
    logDebug({result});
    return result.rows;
  } catch (e) {
    return reject(e);
  } finally {
    pgClient.end();
  }
};

export const pgCleanString = (string) => {
  return string ? string.replace(/'/g, "''") : null;
}
