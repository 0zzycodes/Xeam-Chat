import React from "react";
import { connect } from "react-redux";
// import { createStructuredSelector } from "reselect";
// import ColorPanel from "../../components/ColorPanel/ColorPanel";
import SidePanel from "../../components/SidePanel/SidePanel";
import Messages from "../../components/Messages/Messages";
import MetaPanel from "../../components/MetaPanel/MetaPanel";

import "./Chat.scss";

const Chat = ({ currentUser, currentGroupChat, isPrivateChat }) => {
  return (
    <div className="chat-page">
      <div className="side-panel">
        <SidePanel key={currentUser && currentUser.id} {...{ currentUser }} />
      </div>
      <div className="chat-messages">
        <Messages
          key={currentGroupChat && currentGroupChat.id}
          {...{ currentGroupChat, currentUser, isPrivateChat }}
        />
      </div>
      <div className="meta-panel">
        <MetaPanel isPrivateChat={isPrivateChat} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentGroupChat: state.message.currentGroupChat,
  isPrivateChat: state.message.isPrivateChat,
});

export default connect(mapStateToProps)(Chat);
