import React from 'react';

import Header from './components/start/Header';
import "./css/header.css";
import "./css/index.css";
export default function Apartamenti() {
  return (
    <div>
      <Header />
      
     <main>
     <div class="container">
     
           
            <section class="rooms-section">
                <div class="row room-section-header-container">
                    <div class="col col-3">
                        <h4 class="room-section-header active-header" id="standard-room">Istabas</h4>
                    </div>
                    
                </div>
                <div class="row center-lg">
                    <div class="rooms col col-2">
                        <img src="https://res.cloudinary.com/start-ng/image/upload/v1591638448/Rectangle_42_nastdj.png"
                            alt="" class="rooms-img"/>
                        <h3 class="room-title">Standard</h3>
                        <p class="room-text">Designed  <br/> comfort</p>
                        <div>
                            
                        </div>
                        <p class="amount-text">20EUR</p>
                        <div class="buttons-container">
                           
                            <a href="" class="btn btn-fill">Rezervet</a>
                        </div>
                    </div>
                    <div class="rooms col col-2">
                        <img src="https://res.cloudinary.com/start-ng/image/upload/v1591638449/Rectangle_43_d9eepu.png"
                            alt="" class="rooms-img"/>
                        <h3 class="room-title">Standard </h3>
                        <p class="room-text">Designed <br/> comfort</p>
                        
                        <p class="amount-text">20EUR</p>
                        <div class="buttons-container">
                            
                            <a href="" class="btn btn-fill">Rezervet</a>
                        </div>
                    </div>
                    <div class="rooms col col-2">
                        <img src="https://res.cloudinary.com/start-ng/image/upload/v1591638448/Rectangle_44_anerdv.png"
                            alt="" class="rooms-img"/>
                        <h3 class="room-title">Standard </h3>
                        <p class="room-text">Designed  <br/> comfort</p>
                        <div>
                            
                            
                        </div>
                        <p class="amount-text">20EUR</p>
                        <div class="buttons-container">
                            
                            <a href="" class="btn btn-fill">Rezervet</a>
                        </div>
                    </div>
                    <div class="rooms col col-2">
                        <img src="https://res.cloudinary.com/start-ng/image/upload/v1591638449/Rectangle_45_mtl458.png"
                            alt="" class="rooms-img"/>
                        <h3 class="room-title">Standard </h3>
                        <p class="room-text">Designed  <br/> comfort</p>
                        <div>
                            
                        </div>
                        <p class="amount-text">20 EUR</p>
                        <div class="buttons-container">
                            
                            <a href="" class="btn btn-fill">Rezervet</a>
                        </div>
                    </div>
                </div>
            </section>
      </div>
     </main>
     </div>
      
    
  );
}
