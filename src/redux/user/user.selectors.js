import { createSelector } from "reselect";
import { firestore } from "../../firebase/firebase.utils";

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);
export const selectUsers = createSelector([selectUser], (users) => users.users);
export const selectSearchUsers = createSelector(
  [selectUser],
  (users) => users.searchResult
);

export const selectOnlineUsers = createSelector(
  [selectUser],
  (user) => user.onlineUsers
);

export const selectAUser = (userUrlParam, url) =>
  createSelector([selectUsers], (users) => {
    const userRef = firestore.collection("user").doc(`${userUrlParam}`);
    return userRef.onSnapshot((snapshot) => snapshot.data());
  });
