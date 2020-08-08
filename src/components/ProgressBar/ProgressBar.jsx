import React from "react";

const ProgressBar = ({ uploadState, percentUploaded }) => {
  if (uploadState === "uploading") {
    return <span>{percentUploaded}</span>;
  }
  return null;
};

export default ProgressBar;
