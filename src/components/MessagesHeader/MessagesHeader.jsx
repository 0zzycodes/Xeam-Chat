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
          <span className="channel_name">{channelName}</span>
          <br />
          <span className="channel_user_count">{numUniqueUsers}</span>
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
