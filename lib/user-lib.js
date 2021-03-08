import {assignUserToRole, getUserGroups} from "./cognito-lib";

export const isAdmin = (user) => {
  return (
    user.authType === 'iam'
    || (user.authType === 'authenticated' && user.roles.includes('Admin'))
  )
}

export const isEditor = (user) => {
  return (
    user.authType === 'iam'
    || (user.authType === 'authenticated' && user.roles.includes('Editor'))
  )
}

export const isUser = (user) => {
  return (
    user.authType === 'iam'
    || (user.authType === 'authenticated' && user.roles.includes('User'))
  );
}

export const isGuest = (user) => {
  return (user.authType === 'unauthenticated');
}

export const getUserAttribute = (cognitoUser, attrName) => {
  const {UserAttributes, Attributes} = cognitoUser;
  let attribute;
  if (UserAttributes) {
    attribute = UserAttributes.filter(attr => attr.Name === attrName);
  } else {
    attribute = Attributes.filter(attr => attr.Name === attrName);
  }
  return attribute.length ? attribute[0].Value : null
}

export const getUserRoles = async (userParams) => {
  try {
    let userGroups = await getUserGroups(userParams);
    if (!userGroups.length) {
      await assignUserToRole(userParams, 'User');
      userGroups = await getUserGroups(userParams);
    }
    let userRoles = [];
    userGroups.forEach((group) => {
      userRoles.push(group.GroupName);
    })
    return userRoles;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getClientUserModel = (userRecord) => {
  const {id, email, name, roles} = userRecord;
  return {id, email, name, roles};
}
