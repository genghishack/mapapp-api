import {success, failure, noAccess} from '../../../lib/response-lib';
import {logDebug, logError} from "../../../lib/logging-lib";
import {isAdmin, getClientUserModel, isGuest} from "../../../lib/user-lib";
import * as userQuery from '../../../queries/user-queries';
import AWS from "aws-sdk";

const cognitoISP = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

async function createUser(user, id, data) {
  if (isGuest(user)) {
    return noAccess();
  }

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

async function listUsers(user) {
  if (!isAdmin(user)) {
    return noAccess();
  }

  try{
    const data = await cognitoISP.listUsers({
      UserPoolId: user.userParams.UserPoolId,
    }).promise();
    const cognitoUsers = data.Users;
    const userIds = [];
    cognitoUsers.forEach((cognitoUser) => {
      userIds.push(cognitoUser.Username);
    });
    const dbUsers = await userQuery.getUsers(userIds);
    logDebug({cognitoUsers, dbUsers});
    const users = cognitoUsers.map((cognitoUser) => {
      const [dbUser] = dbUsers.filter((dbRecord) => {
        return cognitoUser.Username === dbRecord.id;
      })
      return {cognito: cognitoUser, db: dbUser}
    });
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
