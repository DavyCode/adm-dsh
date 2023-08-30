import React from "react";
import { Descriptions, Button, List } from "antd";
import moment from "moment";
import styles from "../../styles/style.less";

const UpdateDetails = ({ modalHandler, data }) => {
  const {
    _id: updateID,
    appType,
    viewingAllowed,
    links,
    images,
    releaseDate,
    versionId,
    versionNumber,
    platformType,
    redirectUrl,
    meta: { createdAt },
  } = data;

  return (
    <div className="message-details">
      <Descriptions
        title={updateID && updateID}
        layout="horizontal"
        column={1}
        bordered={true}
      >
        <Descriptions.Item label="ID">{updateID && updateID}</Descriptions.Item>
        <Descriptions.Item label="Viewing Allowed?">
          {viewingAllowed ? "YES" : "NO"}
        </Descriptions.Item>
        <Descriptions.Item label="Release Date">
          {releaseDate && moment(releaseDate).format("lll")}
        </Descriptions.Item>
        <Descriptions.Item label="Version ID">
          {versionId && versionId}
        </Descriptions.Item>
        <Descriptions.Item label="Redirect Url" className="message-body">
          {redirectUrl && redirectUrl}
        </Descriptions.Item>
        <Descriptions.Item label="Created On">
          {createdAt !== undefined && moment(createdAt).format("lll")}
        </Descriptions.Item>
        <Descriptions.Item label="Platform Type">
          {platformType && platformType}
        </Descriptions.Item>
        <Descriptions.Item label="Images">
          <List
            header={<div>Available Image(s)</div>}
            bordered
            dataSource={images}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Links">
          <List
            header={<div>Available Link(s)</div>}
            bordered
            dataSource={links}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Include Image url" className="message-body">
          {appType && appType}
        </Descriptions.Item>
        <Descriptions.Item label="Version Number" className="message-body">
          {versionNumber && versionNumber}
        </Descriptions.Item>
      </Descriptions>
      <div className="flex justify-center items-center w-full p-8">
        <Button
          onClick={() => {
            modalHandler();
          }}
          className="mr-3"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default UpdateDetails;
