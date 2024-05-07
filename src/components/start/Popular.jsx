import React from "react";
import "../css/index.css"
import { Card, Col, Row, Avatar, Image } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
const Popular = () => {
  return (
    <div className="review-container">
      <div className="review-header">
        <h2 className="review-title">Popularakie piedavajumi</h2>
        <hr className="horizontal" />
        <p className="">Klientu izvele.</p>
      </div>
      <div
        className="cards-container"
        style={{ display: "flex", justifyContent: "center", gap: "30px" }}
      >
        <Card
          style={{
            width: 300,
          }}
          cover={
            <Image
              alt="example"
              src="https://corallstroy.ru/upload/iblock/78a/78a969708b3adaeabee602055dbf8339.jpg"
              style={{ height: "220px" }}
            />
          }
          actions={[<EllipsisOutlined key="ellipsis" />]}
        >
          <Meta
            avatar={
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
            }
            title="Viktors"
            description="Gaidam pie mums ciemos!"
          />
        </Card>
        <Card
          style={{
            width: 300,
          }}
          cover={
            <Image
              alt="example"
              src="https://interiorizm.com/wp-content/uploads/2012/09/winnipesaukee-home-01.jpg"
              style={{ height: "220px" }}
            />
          }
          actions={[<EllipsisOutlined key="ellipsis" />]}
        >
          <Meta
            avatar={
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            }
            title="Marks"
            description="Gaidam pie mums ciemos!"
          />
        </Card>
        <Card
          style={{
            width: 300,
          }}
          cover={
            <Image
              alt="example"
              src="https://www.vincent-realty.ru/upload/resize_cache/iblock/061/640_480_0598c859b54d0b4b6de247e2a3808f028/0613d02b671584ab5c17b0297b807445.jpg"
              style={{ height: "220px" }}
            />
          }
          actions={[<EllipsisOutlined key="ellipsis" />]}
        >
          <Meta
            avatar={
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
            }
            title="Aleksandrs"
            description="Gaidam pie mums ciemos!"
          />
        </Card>
      </div>
    </div>
  );
};

export default Popular;
