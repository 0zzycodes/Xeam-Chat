import React, { Component } from "react";
import mime from "mime-types";
export class FileModal extends Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"],
  };

  addFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      this.setState({ file });
    }
  };

  isAuthorized = (fileName) =>
    this.state.authorized.includes(mime.lookup(fileName));

  clearFile = () => this.setState({ file: null });

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    const { isAuthorized, clearFile } = this;

    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  render() {
    const { modal, closeModal } = this.props;
    const { addFile, sendFile } = this;

    return (
      <div>
        <h3>Select an Image File</h3>
        <div>
          <input
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
            onChange={addFile}
          />
          <button onClick={sendFile}>Send</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default FileModal;
