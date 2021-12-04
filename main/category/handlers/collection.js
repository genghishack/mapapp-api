import {success, noAccess, failure} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin} from "../../../lib/user-lib";
import * as categoryQuery from "../../../queries/category-queries";

async function createCategory(user, id, data) {
  if (!isAdmin(user)) return noAccess();

  let category = {};
  try {
    category = await categoryQuery.createCategory(user, data)
    return success({data: category, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function listCategories(user) {
  if (isGuest(user)) return noAccess();

  let categories = [];
  try {
    categories = await categoryQuery.getCategories();
    logDebug({categories});
    return success({data: categories, count: categories.length});
  } catch (e) {
    return failure(e);
  }
}

const collectionHandlers = {
  GET: listCategories,
  POST: createCategory,
};

export default collectionHandlers;
