import React from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const imageFolder = "inventory_images/";

class ImageUpload extends React.Component {
  state = {
    loading: false,
    imageUrl: this.props.imageUrl,
  };

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: false,
        });
        this.props.setImageUrl(imageUrl);
      });
    }
  };

  customUpload = async ({ onError, onSuccess, file }) => {
    const storage = this.props.firebase.storage;
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = await storage.ref();
    const imageName = Date.now(); //a unique name for the image
    const imgFile = storageRef.child(`${imageFolder}${imageName}.png`);
    try {
      const image = await imgFile.put(file, metadata);
      onSuccess(null, image);
    } catch (e) {
      onError(e);
    }
  };

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        // name="avatar"
        listType="picture-card"
        className="image-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        customRequest={this.customUpload}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

export default ImageUpload;
