// About.js
import React from "react";

function About() {
  return (
    <div style={{ padding: "20px", textAlign: "center",backgroundColor: "#ff5722" }}>
      <h1>About Us</h1>
      <p style={{ maxWidth: "600px", margin: "20px auto", fontSize: "18px", color:"white" }}>
        Our motto is simple — <strong>“Helping people, one meal at a time.”</strong>  
        We believe that no one should sleep hungry.  
        With the help of volunteers and donors, we provide free, healthy, and fresh meals
        to people in need across various locations.  

        <br /><br />
        Together, we aim to build a community of kindness, compassion, and hope.
      </p>
    </div>
  );
}

export default About;
