import React from "react";
import "./LocationSection.css";

export default function LocationSection() {
  return (
    <section className="location-section">
      <h2 className="location-title">Where We Donate Food</h2>
      <p className="location-description">
        We currently serve meals to the needy at various locations.  
        You can visit our distribution points or volunteer with us on-site.
      </p>

      <div className="map-container">
        <iframe
          title="Food Distribution Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.097049324983!2d80.9454236754509!3d26.862115763938946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be30b4a64b76d%3A0x7c4a2975ecb26e8!2sHazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1694093148755!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="location-info">
        <p>
          📍 <span className="highlight">Main Distribution Point:</span> Hazratganj, Lucknow, Uttar Pradesh
        </p>
        <a
          href="https://www.google.com/maps/place/Hazratganj,+Lucknow,+Uttar+Pradesh/"
          target="_blank"
          rel="noopener noreferrer"
          className="map-button"
        >
          View on Google Maps
        </a>
      </div>
    </section>
  );
}
