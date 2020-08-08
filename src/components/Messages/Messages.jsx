import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import firebase from "../../firebase/firebase.utils";
import { selectCurrentGroupChat } from "../../redux/message/message.selectors";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import MessagesHeader from "../MessagesHeader/MessagesHeader";
import MessageForm from "../MessageForm/MessageForm";
import Message from "../Message/Message";
import xeam from "../../assets/xeam.png";
import "./Messages.scss";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    progressBar: false,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    isPrivateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref("privateMessages"),
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addMessageListener = (channelId) => {
    let loadedmessages = [];
    const ref = this.getMessagesRef();

    ref.child(channelId).on("child_added", (snap) => {
      loadedmessages.push(snap.val());
      this.setState({ messages: loadedmessages, messagesLoading: false });
      this.countUniqueUsers(loadedmessages);
    });
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, isPrivateChannel } = this.state;

    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;

    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;

    this.setState({ numUniqueUsers });
  };

  handleSearchChange = (event) => {
    let searchTerm = event.target.value;

    this.setState({ searchTerm, searchLoading: true }, () =>
      this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");

    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  isProgressBarVisible = (percent) => {
    if (percent > 0) {
      this.setState({ progressBar: true });
    }
  };

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      progressBar,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      isPrivateChannel,
    } = this.state;

    const { isProgressBarVisible, handleSearchChange, getMessagesRef } = this;

    const displayMessages = (messages) => {
      if (messages.length > 0) {
        return messages.map((message) => (
          <Message key={message.timestamp} message={message} user={user} />
        ));
      }

      return null;
    };

    const displayChannelName = (channel) => {
      const { isPrivateChannel } = this.state;
      return channel ? `${isPrivateChannel ? "@" : "#"}${channel.name}` : "";
    };

    return (
      <div className="messages_container">
        <MessagesHeader
          {...{
            numUniqueUsers,
            handleSearchChange,
            searchLoading,
            isPrivateChannel,
          }}
          channelName={displayChannelName(channel)}
        />
        <div className="message-container">
          {messages.length === 0 ? (
            <div className="no-message">
              <img src={xeam} alt="logo" />
            </div>
          ) : (
            <div
              className={progressBar ? "messages__progress" : "messages__view"}
            >
              {searchTerm
                ? displayMessages(searchResults)
                : displayMessages(messages)}
            </div>
          )}
        </div>
        <MessageForm
          {...{
            messagesRef,
            isProgressBarVisible,
            isPrivateChannel,
            getMessagesRef,
          }}
          currentUser={user}
          currentChannel={channel}
        />
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentChannel: selectCurrentGroupChat,
  currentUser: selectCurrentUser,
});
export default connect(mapStateToProps)(Messages);
