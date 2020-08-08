import { UserActionTypes } from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  users: [],
  user: null,
  onlineUsers: [],
  searchResult: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case UserActionTypes.UPDATE_ONLINE_USER:
      return {
        ...state,
        onlineUsers: action.payload,
      };

    case UserActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case UserActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case UserActionTypes.SET_SEARCH_USERS:
      return {
        ...state,
        searchResult: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
