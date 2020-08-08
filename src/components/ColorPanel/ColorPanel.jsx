import React, { Component } from "react";
import xeam from "../../assets/xeam.png";
import "./ColorPanel.scss";

class ColorPanel extends Component {
  render() {
    return (
      <div className="color-panel">
        <div className="logo">
          <img src={xeam} alt="logo" />
        </div>
      </div>
    );
  }
}

export default ColorPanel;
