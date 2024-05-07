import React from 'react';
import { Avatar, Space } from 'antd';
import { useUser } from './UserContext';
import Header from './Header/Header';

const Profils = () => {
    const { userEmail } = useUser();
  return (
    <>
    <Header/>
    <div className="review-container">
	<div className="review-header">
		<h2 className="review-title">
			Jusu Profils
		</h2>
		
		<hr className="horizontal"/>
		<p className="">Jusu informacija</p>
	</div>
	<div className="cards-container">
		
		<div className="card">
		<Avatar size={120} src="https://beach.volley.ru/assets/images/uploads/VLPlayer/01FDD5HZX3G0WQ1DEJPVB018E2/upload-1634667221142-01FDD5HZX3G0WQ1DEJPVB018E2--394899181.jpg" />
			<h2 className="card-title">
            
			</h2>
			<h3 className="card-subtitle">*****
				Liepāja
			</h3>
			<p className="card-desc">Jusu epasts: {userEmail}</p>
		</div>
		
	</div>
</div>
</>
  );
};

export default Profils;