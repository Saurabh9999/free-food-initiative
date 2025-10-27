import "./App.css";
import { useState } from "react";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import Profile from "./profile.js";
import Home from "./Home.js";
import ThankYou from "./Thankyou.js";
import About from "./About.js";
import Admin from "./Admin.js";
import PhoneInputBox from "./PhoneSection.js";
import Donate from "./Donate.js";
import Success from "./Success.js";
import Cancel from "./Cancel.js";
import ResetPassword from "./ResetPassword.js";
import LocationSection from "./LocationSection.js";

function App() {
  // 🔹 Modal state
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // 🔹 Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // 🔹 Volunteer form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 🔹 Login/Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

    const [strength, setStrength] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  // ✅ Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setStrength("Weak");
      setStrengthColor("red");
      return;
    }

    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (strongRegex.test(password)) {
      setStrength("Strong");
      setStrengthColor("green");
    } else {
      setStrength("Medium");
      setStrengthColor("orange");
    }
  };


  const navigate = useNavigate();

  // Toggle modal
  const toggleModal = () => setShowModal(!showModal);
  const switchForm = () => setIsLogin(!isLogin);

  // 🔹 Volunteer form submit
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setName("");
        setEmail("");
        setPhone("");
        navigate("/thankyou");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting volunteer form:", error);
      alert("Error submitting form.");
    }
  };

  // 🔹 Signup submit
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          phone: signupPhone,
        }),
      });

      const data = await response.json();
      alert(data.message || "Signup successful!");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupPhone("");
      setIsLogin(true); // Switch to login
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed.");
    }
  };

  // 🔹 Login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setShowModal(false);
        setLoginEmail("");
        setLoginPassword("");

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed.");
    }
  };

  return (
    <div>
      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <>
              <nav>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><Link to="/location">Locations</Link></li>
                  <li><Link to="/donate">Donate us</Link></li>
                  <li><a href="#volunteer">Volunteer</a></li>
                  <li><a href="#gallery">Gallery</a></li>
                  <li><Link to="/about">About us</Link></li>
                </ul>
              </nav>

              <div className="oval-button">
                <button id="boled" onClick={toggleModal}>
                  Login/Signup
                </button>
              </div>

              {/* Hero Section */}
                 <header id="home">
            <h1>Free Food Serving Initiative</h1>
            <p>
        Our is a heartfelt initiative dedicated to feeding those in need. 
        Every meal we serve brings hope, kindness, and a reminder that 
        humanity still cares. We believe that no one should go to bed hungry — 
        and together, we can make that a reality.
           </p>
                 </header>


              {/* Locations */}
              {/* <div className="section" id="locations">
                <h2>Choose a Location to Serve Food</h2>
                <select defaultValue="">
                  <option value="" disabled>Select a location</option>
                  <option>Downtown Area</option>
                  <option>City Park</option>
                  <option>Near Railway Station</option>
                  <option>Old Age Home</option>
                  <option>Orphanage</option>
                </select>
                <button>Confirm Location</button>
              </div> */}

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
                  <PhoneInputBox value={phone} onChange={setPhone} />
                  <button type="submit">Join Now</button>
                </form>
              </div>

              {/* Gallery */}
              <div className="section" id="gallery">
                <h2>Our Food Serving Moments</h2>
                <div className="gallery">
                  <img src="/images/children.jpg" alt="Serving Food 1" />
                  <img src="/images/children1.jpg" alt="Serving Food 2" />
                  <img src="/images/volunteer.jpg" alt="Serving Food 3" />
                  <img src="/images/volunteer1.jpg" alt="Serving Food 4" />
                </div>
              </div>

              {/* Footer */}
              <footer>&copy; 2025 Free Food Serving. All rights reserved.</footer>

              {/* 🔹 Login/Signup Modal */}
         {showModal && (
     <div className="modal-overlay" onClick={toggleModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isLogin ? "Login" : "Signup"}</h2>

      <form onSubmit={isLogin ? handleLogin : handleSignup}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Username"
              required
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            /><br /><br />
            
            <PhoneInputBox
              value={signupPhone}
              onChange={setSignupPhone}
            /><br /><br />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={isLogin ? loginEmail : signupEmail}
          onChange={(e) =>
            isLogin
              ? setLoginEmail(e.target.value)
              : setSignupEmail(e.target.value)
          }
        /><br /><br />

        {/* ✅ Password Input with Strength Indicator */}
        <input
          type="password"
          placeholder="Password"
          required
          value={isLogin ? loginPassword : signupPassword}
          onChange={(e) => {
            const value = e.target.value;
            if (isLogin) {
              setLoginPassword(value);
            } else {
              setSignupPassword(value);
              checkPasswordStrength(value);
            }
          }}
        /><br />

        {/* ✅ Strength Meter for Signup */}
        {!isLogin && signupPassword && (
          <p
            style={{
              color: strengthColor,
              fontWeight: "bold",
              marginTop: "4px",
              fontSize: "14px",
            }}
          >
            Strength: {strength}
          </p>
        )}

        <br />
        <button type="submit">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={switchForm} style={{ marginLeft: "5px" }}>
          {isLogin ? "Signup" : "Login"}
        </button>
      </p>
    </div>
  </div>
)}


              {/* 🔹 Forgot Password Modal */}
              {showForgotModal && (
                <div
                  className="modal-overlay"
                  onClick={() => setShowForgotModal(false)}
                >
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Forgot Password</h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const response = await fetch(
                            "/api/users/forgot-password",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: forgotEmail }),
                            }
                          );
                          const data = await response.json();
                          alert(data.message || "Check your email for reset link!");
                          setForgotEmail("");
                          setShowForgotModal(false);
                        } catch (error) {
                          console.error("Forgot password error:", error);
                          alert("Something went wrong.");
                        }
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Enter your registered email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                      <br /><br />
                      <button type="submit">Send Reset Link</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          }
        />

        {/* Other Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/location" element={<LocationSection/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
