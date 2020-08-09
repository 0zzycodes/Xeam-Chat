import React, { Component } from "react";
import "./MessagesHeader.scss";
export class MessagesHeader extends Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      isPrivateChannel,
    } = this.props;
    return (
      <section className="header">
        <div className="message">
          {/* {isPrivateChannel && <img src={} alt=""/> } */}
          <h3 className="channel_name">
            {" "}
            {!isPrivateChannel && "#"} {channelName}
            {!isPrivateChannel && `(${numUniqueUsers})`}
          </h3>
        </div>
        <div className="search">
          <input
            name="searchTerm"
            placeholder="Search Messages..."
            onChange={handleSearchChange}
            loading={searchLoading}
            style={{ fontSize: "10px" }}
          />
        </div>
      </section>
    );
  }
}

export default MessagesHeader;
