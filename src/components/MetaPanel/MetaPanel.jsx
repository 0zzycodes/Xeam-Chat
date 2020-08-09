import React, { Component } from "react";
import { connect } from "react-redux";
import "./MetaPanel.scss";
class MetaPanel extends Component {
  render() {
    return (
      <div className="meta-panel">
        <div className="group-purpose">
          {" "}
          <h3>
            {this.props.currentGroupChat && this.props.currentGroupChat.name}
          </h3>
          <p>
            {" "}
            {this.props.currentGroupChat && this.props.currentGroupChat.details}
          </p>
        </div>
        {/* <h5 className="channel_user_count">{this.props.numUniqueUsers} Users</h5> */}
        {this.props.isPrivateChat ? (
          <div></div>
        ) : (
          <div className="admin">
            <h2>Admin:</h2>
            <div className="admin-name-image">
              <h3>
                {this.props.currentGroupChat &&
                  this.props.currentGroupChat.createdBy.name}
              </h3>
              <img
                src={
                  this.props.currentGroupChat &&
                  this.props.currentGroupChat.createdBy.avatar
                }
                alt="admin avatar"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentGroupChat: state.message.currentGroupChat,
});

export default connect(mapStateToProps)(MetaPanel);
