import MessageActionTypes from "./message.types";

export const setCurrentGroupChat = (group) => {
  return {
    type: MessageActionTypes.SET_CURRENT_GROUP_CHAT,
    payload: group,
  };
};

export const setPrivateChat = (isPrivateChat) => {
  return {
    type: MessageActionTypes.SET_PRIVATE_CHAT,
    payload: isPrivateChat,
  };
};
export const setUserPosts = (userPosts) => {
  return {
    type: MessageActionTypes.SET_USER_POSTS,
    payload: userPosts,
  };
};

/* Colors Actions */
export const setColors = (primaryColor, secondaryColor) => {
  return {
    type: MessageActionTypes.SET_COLORS,
    payload: {
      primaryColor,
      secondaryColor,
    },
  };
};
