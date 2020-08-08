import { UserActionTypes } from "./user.types";

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});
export const updateOnlineUsers = (users) => ({
  type: UserActionTypes.UPDATE_ONLINE_USER,
  payload: users,
});
export const setUsers = (users) => ({
  type: UserActionTypes.SET_USERS,
  payload: users,
});
export const setUser = (user) => ({
  type: UserActionTypes.SET_USER,
  payload: user,
});
export const setSearchUsers = (users) => ({
  type: UserActionTypes.SET_SEARCH_USERS,
  payload: users,
});
