import React from "react";
import "./AboutModal.css";

export default function AboutModal({ closeModal }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-content">
          <h2>About TerpBites</h2>
          <p>
            TerpBites scrapes data from the UMD Dining Hall website using the
            BeautifulSoup library. The data is stored in an AWS RDS database.
            When a user searches, the data is retrieved and displayed in the
            frontend. The backend API is written in Flask and deployed on AWS
            Lambda.
          </p>
        </div>
        <button className="close-button" onClick={closeModal}>
          ×
        </button>
      </div>
    </div>
  );
}
