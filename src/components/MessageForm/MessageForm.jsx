import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { Picker } from "emoji-mart";
import firebase from "../../firebase/firebase.utils";
import FileModal from "../FileModal/FileModal";
import ProgressBar from "../ProgressBar/ProgressBar";
import smile from "../../assets/smile.svg";
import send from "../../assets/send.svg";
import file from "../../assets/file.svg";

import "emoji-mart/css/emoji-mart.css";
import "./MessageForm.scss";

export class MessageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref("typing"),
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
    emojiPicker: false,
  };

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      this.sendMessage();
    }

    const { message, typingRef, channel, user } = this.state;

    if (message) {
      typingRef.child(channel.id).child(user.id).set(user.displayName);
    } else {
      typingRef.child(channel.id).child(user.id).remove();
    }
  };

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleAddEmoji = (emoji) => {
    const oldMessage = this.state.message;
    this.setState({
      message: `${oldMessage} ${emoji.native}`,
      emojiPicker: false,
    });
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.id,
        name: this.state.user.displayName,
        avatar: this.state.user.profile_pic,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel, user, typingRef } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
          typingRef.child(channel.id).child(user.id).remove();
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private/${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err),
        });
      });
  };
  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded,
      emojiPicker,
    } = this.state;

    return (
      <section className="message__form">
        <div className="emo-picker">
          {emojiPicker && (
            <Picker
              set="apple"
              className="emojipicker"
              title="Select Emoji"
              onSelect={this.handleAddEmoji}
              emoji="poin_up"
            />
          )}
        </div>
        <button onClick={this.openModal} disabled={loading}>
          <img src={file} alt="select file icon" />
        </button>
        <input
          name="message"
          value={message}
          ref={(node) => (this.messageInputRef = node)}
          placeholder="Write your message..."
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          className={
            errors.some(({ message }) => message.includes("message"))
              ? "error"
              : ""
          }
          style={{ backgroundColor: "#ffffff" }}
        />
        <span className="emoji-handler" onClick={this.handleTogglePicker}>
          <img className="emo-pic" src={smile} alt="emoji pick" />
        </span>
        <button onClick={this.sendMessage} disabled={loading}>
          <img src={send} alt="send message icon" />
        </button>
        {/* <FileModal {...{ modal, closeModal, uploadFile }} />
        <ProgressBar {...{ uploadState, percentUploaded }} /> */}
      </section>
    );
  }
}

export default MessageForm;
