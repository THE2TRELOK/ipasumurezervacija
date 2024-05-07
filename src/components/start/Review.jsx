import React from 'react';
import "../css/index.css"
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const Review = () => {
  return (
    <div className="review-container">
	<div className="review-header">
		<h2 className="review-title">
			Klientu Atsauksmes
		</h2>
		<hr className="horizontal"/>
		<p className="">Mēs esam ļoti lepni par pakalpojumiem, ko piedāvājam saviem klientiem.</p>
	</div>
	<div className="cards-container">
		<div className="card">
		<Avatar size={120} src="https://media-cdn.tripadvisor.com/media/photo-s/06/3d/d3/be/caption.jpg" />
			<h2 className="card-title">
				Ivans
			</h2>
			<h3 className="card-subtitle">
				Rīga
			</h3>
            
			<p className="card-desc">Vārdi nevar izskaidrot to veidu apkalpojumu, ko saņēmu no servisa vadības.</p>
		</div>
		<div className="card">
		<Avatar size={120} src="https://beach.volley.ru/assets/images/uploads/VLPlayer/01FDD5HZX3G0WQ1DEJPVB018E2/upload-1634667221142-01FDD5HZX3G0WQ1DEJPVB018E2--394899181.jpg" />
			<h2 className="card-title">
				Aleksejs
			</h2>
			<h3 className="card-subtitle">
				Liepāja
			</h3>
			<p className="card-desc">Serviss ļauj justies labākajā numura kvalitātē, kas rada mājas komfortu.</p>
		</div>
		<div className="card">
		<Avatar size={120} src="https://th.bing.com/th/id/OIP.pzJkURUoaup3XaEA10XFWQHaEK?rs=1&pid=ImgDetMain" />

			<h2 className="card-title">
				Sergejs
			</h2>
			<h3 className="card-subtitle">
				Rīga
			</h3>
			<p className="card-desc">Mana ģimene un es esam ļoti priecīgi.</p>
		</div>
	</div>
</div>
  );
};

export default Review;