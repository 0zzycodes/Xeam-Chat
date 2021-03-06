import MessageActionTypes from "./message.types";
const INITIAL_STATE = {
  currentGroupChat: null,
  isPrivateChat: false,
  userPosts: null,
};

const MessageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MessageActionTypes.SET_CURRENT_GROUP_CHAT:
      return {
        ...state,
        currentGroupChat: action.payload,
      };
    case MessageActionTypes.SET_PRIVATE_CHAT:
      return {
        ...state,
        isPrivateChat: action.payload,
      };
    case MessageActionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };
    default:
      return state;
  }
};

export default MessageReducer;
