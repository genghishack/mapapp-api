import {success, noAccess, failure} from '../../../lib/response-lib';
import {logDebug} from "../../../lib/logging-lib";
import {isAdmin, isEditor, isGuest, isUser} from "../../../lib/user-lib";
import * as categoryQuery from "../../../queries/category-queries";
import * as resourceQuery from "../../../queries/resource-queries";

async function getCategory(user, id) {
  if (isGuest(user)) return noAccess();

  let category = {};
  try {
    category = await categoryQuery.getCategory(id);
    // logDebug({resource});
    return success({data: category, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function deleteCategory(user, id) {
  if (!isAdmin(user) && !isEditor(user)) return noAccess();

  try {
    let category = {}
    category = await categoryQuery.deleteCategory(id);
    // logDebug({category});
    return success({data: category, count: 1});
  } catch (e) {
    return failure(e);
  }

}

async function editCategory(user, id, data) {
  if (!isAdmin(user) && !isEditor(user)) return noAccess();

  let category = {};
  try {
    category = await categoryQuery.updateCategory(user.id, id, data);
    // logDebug({category});
    return success({data: category, count: 1});
  } catch (e) {
    return failure(e);
  }
}

async function replaceCategory(user, id, data) {
  if (!isAdmin(user)) {
    return noAccess();
  }
  // uses user, id
  const message = 'replaced category';
  logDebug(message);
  const response = success({data: message});
  return response;
}

const itemHandlers = {
  DELETE: deleteCategory,
  GET: getCategory,
  PATCH: editCategory,
  PUT: replaceCategory,
};

export default itemHandlers;
