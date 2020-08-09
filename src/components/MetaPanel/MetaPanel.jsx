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
            <p>
              {" "}
              {this.props.currentGroupChat &&
                this.props.currentGroupChat.details}
            </p>
          </h3>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentGroupChat: state.message.currentGroupChat,
});

export default connect(mapStateToProps)(MetaPanel);
