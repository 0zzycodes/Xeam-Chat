import React from "react";
import moment from "moment";
import "./Message.scss";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};

const timeFromNow = (timestamp) => moment(timestamp).fromNow();

const displayCommentOrImage = (message, content) => {
  if (message.hasOwnProperty("image") && !message.hasOwnProperty("content")) {
    return (
      <img src={message.image} alt="sent img" className="message__image" />
    );
  }

  return content;
};

const Message = ({ message, user }) => {
  const { timestamp, content } = message;
  const { avatar, name } = message.user;

  return (
    <div
      className={`${
        message.user.id === user.id
          ? "message__self__view"
          : "message__other__view"
      } message_view`}
    >
      <img src={avatar} alt="avatar" className="avatar" />
      <div className={isOwnMessage(message, user)}>
        <span className="sender__name">{name}</span>
        <span className="timestamp">{timeFromNow(timestamp)}</span>
        <br />
        <p className="message-content">
          {displayCommentOrImage(message, content)}
        </p>
      </div>
    </div>
  );
};

export default Message;
