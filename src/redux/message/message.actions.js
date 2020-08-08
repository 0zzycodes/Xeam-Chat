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
