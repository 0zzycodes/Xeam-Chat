import { createSelector } from "reselect";

const selectChatState = (state) => state.message;

export const selectCurrentGroupChat = createSelector(
  [selectChatState],
  (message) => message.currentGroupChat
);
export const selectPrivateChat = createSelector(
  [selectChatState],
  (message) => message.isPrivateChat
);
