import AWS from 'aws-sdk';
import { logDebug, logError } from "./logging-lib";
import {getUserEmail, getUserIdentity, getUserParams, getUserRoles} from "./user-lib";

export const getUserFromEvent = async (event) => {
  logDebug({event});
  if (!event || !event.requestContext || !event.requestContext.identity) {
    return Promise.reject(new Error('Insufficient event data to get user'));
  }

  const identity = event.requestContext.identity;
  const {
    cognitoAuthenticationProvider : cognitoAP,
    userArn,
  } = identity;

  if (cognitoAP) {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18'
    });
    const userParams = getUserParams(cognitoAP);
    const userIdentity = getUserIdentity(identity);

    try {
      const userEmail = await getUserEmail(cognitoISP, userParams);
      const userRoles = await getUserRoles(cognitoISP, userParams);
      const userData = {
        userParams,
        userIdentity,
        email: userEmail,
        roles: userRoles,
        type: 'cognito',
      }
      logDebug({userData});
      return userData;
    } catch (e) {
      logError(e);
      return Promise.reject(e);
    }
  } else if (userArn) {
    return {
      id: identity.accountId,
      arn: userArn,
      type: 'iam',
    }
  } else {
    return Promise.reject(new Error('No user found in event data'));
  }
}
