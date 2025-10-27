import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Volunteer Form Submit
  const handleVolunteerSubmit = (e) => {
    e.preventDefault();

    // 👉 You can also send this data to backend here
    console.log("Volunteer joined:", { name, email, phone });

    // Redirect to Thank You Page
    navigate("/thankyou");
  };

  return (
    <div>
      {/* Navigation */}
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#locations">Locations</a></li>
          <li><a href="#donate">Donate us</a></li>
          <li><a href="#volunteer">Volunteer</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#about">About us</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header id="home">
        <h1>Free Food Serving Initiative</h1>
        <p>Helping people, one meal at a time</p>
      </header>

      {/* Volunteer Section */}
      <div className="section" id="volunteer">
        <h2>Join as a Volunteer</h2>
        <form onSubmit={handleVolunteerSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">Join Now</button>
        </form>
      </div>

      {/* Footer */}
      <footer>© 2025 Free Food Serving. All rights reserved.</footer>
    </div>
  );
}

export default Home;
