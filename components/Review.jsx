import React from "react";

import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
const Review = () => {
  return (
    <div class="review-container">
      <div class="review-header">
        <h2 class="review-title">Klientu Atsauksmes</h2>
        <hr class="horizontal" />
        <p class="">
          Mēs esam ļoti lepni par pakalpojumiem, ko piedāvājam saviem klientiem.
        </p>
      </div>
      <div class="cards-container">
        <div class="card">
          <Avatar
            size={120}
            src="https://media-cdn.tripadvisor.com/media/photo-s/06/3d/d3/be/caption.jpg"
          />
          <h2 class="card-title">Ivans</h2>
          <h3 class="card-subtitle">Rīga</h3>

          <p class="card-desc">
            Vārdi nevar izskaidrot to veidu apkalpojumu, ko saņēmu no servisa
            vadības.
          </p>
        </div>
        <div class="card">
          <Avatar
            size={120}
            src="https://beach.volley.ru/assets/images/uploads/VLPlayer/01FDD5HZX3G0WQ1DEJPVB018E2/upload-1634667221142-01FDD5HZX3G0WQ1DEJPVB018E2--394899181.jpg"
          />
          <h2 class="card-title">Aleksejs</h2>
          <h3 class="card-subtitle">Liepāja</h3>
          <p class="card-desc">
            Serviss ļauj justies labākajā numura kvalitātē, kas rada mājas
            komfortu.
          </p>
        </div>
        <div class="card">
          <Avatar
            size={120}
            src="https://th.bing.com/th/id/OIP.pzJkURUoaup3XaEA10XFWQHaEK?rs=1&pid=ImgDetMain"
          />

          <h2 class="card-title">Sergejs</h2>
          <h3 class="card-subtitle">Rīga</h3>
          <p class="card-desc">Mana ģimene un es esam ļoti priecīgi.</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
