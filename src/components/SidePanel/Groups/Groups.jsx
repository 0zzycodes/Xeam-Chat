import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setCurrentGroupChat,
  setPrivateChat,
} from "../../../redux/message/message.actions";

import firebase from "../../../firebase/firebase.utils";
import plus from "../../../assets/plus.svg";
import check from "../../../assets/check.svg";
import cancel from "../../../assets/cancel.svg";

export class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeGroup: "",
    channel: null,
    messagesRef: firebase.database().ref("messages"),
    notifications: [],
  };

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => {
        this.setFirstChannel();
      });
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = (channelId) => {
    const { messagesRef, channel, notifications } = this.state;
    messagesRef.child(channelId).on("value", (snap) => {
      if (channel) {
        this.handleNotifications(channelId, channel.id, notifications, snap);
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }

      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }

    this.setState({ notifications });
  };

  setFirstChannel = () => {
    const { channels, firstLoad } = this.state;

    const firstChannel = channels[0];

    if (firstLoad && channels.length > 0) {
      this.props.setCurrentGroupChat(firstChannel);
      this.setActiveGroup(firstChannel);
      this.setState({ channel: firstChannel });
    }

    this.setState({ firstLoad: false });
  };

  componentDidMount() {
    this.addListeners();
  }

  closeModal = () => this.setState({ modal: false });

  openModal = () => this.setState({ modal: true });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = () => {
    const { channelName, channelDetails } = this.state;
    return channelName && channelDetails;
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const { displayName, profile_pic } = this.props.currentUser;
    const { closeModal } = this;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: displayName,
        avatar: profile_pic,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        closeModal();
        console.log("channel added");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setActiveGroup = (channel) => {
    this.setState({ activeGroup: channel.id });
  };

  changeChannel = (channel) => {
    const { setCurrentGroupChat, setPrivateChat } = this.props;
    this.setActiveGroup(channel);
    this.clearNotifications();
    setCurrentGroupChat(channel);
    setPrivateChat(false);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;

      this.setState({ notifications: updatedNotifications });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { isFormValid, addChannel } = this;

    if (isFormValid()) {
      addChannel();
    }
  };

  getNotificationCount = (channel) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    const {
      channels,
      modal,
      activeGroup,
      channelName,
      channelDetails,
    } = this.state;
    const {
      closeModal,
      handleChange,
      openModal,
      handleSubmit,
      changeChannel,
      getNotificationCount,
    } = this;

    const displayChannels = (channels) => {
      if (channels.length > 0) {
        return channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            className={`${channel.id === activeGroup && "active"} group-name`}
          >
            <h4># {channel.name}</h4>
            {getNotificationCount(channel) && (
              <span className="notification">
                {getNotificationCount(channel)}
              </span>
            )}
          </div>
        ));
      }

      return null;
    };

    return (
      <div className="group">
        <div className="menu">
          <div className="listing-header">
            <h2> GROUPS</h2>
            <img src={plus} alt="plus icon" onClick={openModal} />
          </div>
          {displayChannels(channels)}
        </div>
        {modal && (
          <div className="add-group">
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Group Name"
                name="channelName"
                value={channelName}
                onChange={handleChange}
              />
              <input
                placeholder="Group Description"
                name="channelDetails"
                value={channelDetails}
                onChange={handleChange}
              />
              <div className="add-group-buttons">
                <button className="cancel-add-group-btn" onClick={closeModal}>
                  <img src={cancel} alt="cancel icon" />
                </button>
                <button className="add-add-btn" onClick={handleSubmit}>
                  <img src={check} alt="check icon" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { setCurrentGroupChat, setPrivateChat })(Channels);
