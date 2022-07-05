import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin, isGuest, getClientUserModel} from "../../../lib/user-lib";
import {getAdminUserModel} from "../../../lib/admin-lib";
import {createCognitoUser, listCognitoUsers} from "../../../lib/cognito-lib";
import * as userQuery from '../../../queries/user-queries';

const createUser = async (user, id, data) => {
  if (isGuest(user)) return noAccess();

  let newUser = {};
  try {
    if (isAdmin(user) && data.email) {
      const newUserParams = {
        DesiredDeliveryMediums: ['EMAIL'],
        Username: data.email,
        UserPoolId: user.userParams.UserPoolId,
      }
      newUser = await createCognitoUser(newUserParams);
    } else {
      // Regular users can only create their own db record from the event data
      const [newUserRecord] = await userQuery.createUserOnSignup(user);
      newUser = getClientUserModel(newUserRecord);
    }
    return success({data: newUser, count: 1});
  } catch (e) {
    return failure(e);
  }
}

const listUsers = async (user) => {
  if (!isAdmin(user)) return noAccess();

  const {userParams: {UserPoolId}} = user;
  try {
    const cognitoUsers = await listCognitoUsers(UserPoolId);
    const users = await Promise.all(cognitoUsers.map((cognitoUser) => {
      const userParams = {
        Username: cognitoUser.Username,
        UserPoolId,
      }
      return getAdminUserModel(user, userParams, cognitoUser);
    }));
    return success({data: users, count: users.length});
  } catch (e) {
    return failure(e);
  }
}

const collectionHandlers = {
  GET: listUsers,
  POST: createUser,
};

export default collectionHandlers;
