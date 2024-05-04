import React, { useState } from "react";
import "../css/index.css"
const Calendarnbook = () => {
  const [inputType, setInputType] = useState("text");

  const handleFocus = () => {
    setInputType("date");
  };

  return (
    <div className="book-container">
      <div className="book-left">
        <h2 className="book-header">
          Atklājiet pilnīgu līdzsvaru <br /> viesmīlībā  un
          komfortā.
        </h2>
        <p>
          Mēs esam orientēti uz ērtību nodrošināšanu klientiem ar augstāko
          līmeni
          <br />
          ērtībām un izcilu pieejamu cenām
        </p>
        <a href="#" className="btn btn-fill btn-large">
          Rezervēt
        </a>
      </div>
      <div className="book-right">
        <form action="" className="book-form">
          <h3>Izvēlaties savu rezervācijas informāciju</h3>
          <br />
          <p>
            Mūsu pakalpojumi piedāvā labākās
            <br /> pieejamās cenas
          </p>
          <label className="hide" htmlFor="arrival">
            Ierašanās datums
          </label>
          <input
            type={inputType}
            id="arrival"
            name="arrival_date"
            placeholder="Ierašanās datums"
            onFocus={handleFocus}
          />
          <br />
          <label className="hide" htmlFor="departure">
            Izrakstīšanās datums
          </label>
          <input
            type={inputType}
            id="departure"
            name="departure_date"
            placeholder="Izrakstīšanās datums"
            onFocus={handleFocus}
          />
          <br />
          <label className="hide" htmlFor="guests">
            cik viesi
          </label>
          <input type="text" id="guests" name="guests" placeholder="Viesi" />
          <br />
          <button type="button" className="rates">
            PĀRBAUDĪT CENAS
          </button>
        </form>
      </div>
    </div>
  );
};

export default Calendarnbook;
