import React, { Component } from "react";
import { connect } from "react-redux";

import firebase from "../../../firebase/firebase.utils";

import {
  setCurrentGroupChat,
  setPrivateChat,
} from "../../../redux/message/message.actions";
import plus from "../../../assets/plus.svg";

class DirectMessages extends Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
    activeChannel: "",
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.id);
    }
  }

  addListeners = (currentUserId) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserId !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    this.state.presenceRef.on("child_added", (snap) => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", (snap) => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }

      return acc.concat(user);
    }, []);

    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user) => user.status === "online";

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };

    this.props.setCurrentGroupChat(channelData);
    this.props.setPrivateChat(true);
    this.setActiveChannel(user.id);
  };

  setActiveChannel = (userId) => {
    this.setState({ activeChannel: userId });
  };

  render() {
    const { users, activeChannel } = this.state;

    const { isUserOnline } = this;

    const callUsers = () => {
      return users.map((user) => (
        <div
          key={user.uid}
          onClick={() => this.changeChannel(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
          className={`${user.uid === activeChannel && "active"} priv-chat`}
        >
          {/* ONLINE TAG */}
          {/* <Icon
                    name='circle'
                    color={isUserOnline(user) ? 'green' : 'red'}
                /> */}
          <h4> @ {user.name}</h4>
        </div>
      ));
    };

    return (
      <div className="direct-message">
        <div className="menu">
          <div className="listing-header">
            <h2>DIRECT MESSAGES ({users.length}) </h2>
            <img src={plus} alt="plus icon" />
          </div>
          {callUsers()}
        </div>
      </div>
    );
  }
}

export default connect(null, { setCurrentGroupChat, setPrivateChat })(
  DirectMessages
);
