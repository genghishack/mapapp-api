import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin, isGuest, getClientUserModel} from "../../../lib/user-lib";
import {getAdminUserModel, listCognitoUsers} from "../../../lib/admin-lib";
import * as userQuery from '../../../queries/user-queries';

const createUser = async (user, id, data) => {
  if (isGuest(user)) return noAccess();

  let response = {};
  try {
    if (isAdmin(user)) {
      // TODO: Do something only admins can do - like create another user
    } else {
      // Regular users can only create their own record from the event data
      const [newUserRecord] = await userQuery.createUserOnSignup(user);
      response = getClientUserModel(newUserRecord);
    }
    return success({data: response, count: 1});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const listUsers = async (user) => {
  if (!isAdmin(user)) return noAccess();

  const {userParams: {UserPoolId}} = user;
  try {
    const cognitoUsers = await listCognitoUsers(UserPoolId);
    // const userIds = [];
    // cognitoUsers.forEach((cognitoUser) => {
    //   userIds.push(cognitoUser.Username);
    // });
    // const dbUsers = await userQuery.getUsers(userIds);
    // logDebug({cognitoUsers, dbUsers});
    const users = await Promise.all(cognitoUsers.map((cognitoUser) => {
      // const [dbRecord] = dbUsers.filter((dbUser) => {
      //   return cognitoUser.Username === dbUser.id;
      // })
      const userParams = {
        Username: cognitoUser.Username,
        UserPoolId,
      }
      return getAdminUserModel(userParams, cognitoUser);
    }));
    return success({data: users, count: users.length});
  } catch (e) {
    logError(e);
    return failure({message: e.message});
  }
}

const collectionHandlers = {
  GET: listUsers,
  POST: createUser,
};

export default collectionHandlers;
