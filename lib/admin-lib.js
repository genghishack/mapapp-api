import {getUserAttribute, getUserRoles} from "./user-lib";
import {getUser, updateUser} from '../queries/user-queries';
import {logDebug} from "./logging-lib";
import {getCognitoUser} from "./cognito-lib";
import {reject} from "./error-lib";

export const getAdminUserModel = async (adminUser, userParams, cognitoUser = null) => {
  try {
    cognitoUser = cognitoUser || await getCognitoUser(userParams)
    let [dbRecord] = await getUser(userParams.Username);
    logDebug({cognitoUser, dbRecord});
    const roles = await getUserRoles(userParams);
    const user = {
      id: getUserAttribute(cognitoUser, 'sub'),
      name: getUserAttribute(cognitoUser, 'name'),
      email: getUserAttribute(cognitoUser, 'email'),
      email_verified: getUserAttribute(cognitoUser, 'email_verified'),
      enabled: cognitoUser.Enabled,
      status: cognitoUser.UserStatus,
      roles,
    };
    if (dbRecord) {
      if (dbRecord.roles !== user.roles
        || dbRecord.email !== user.email
        || dbRecord.name !== user.name
      ) {
        [dbRecord] = await updateUser(adminUser, user);
      }
    }
    return {
      ...user,
      cognitoUser,
      dbRecord
    }
  } catch (e) {
    return reject(e);
  }
}
