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
import PaymentSuccess from "./PaymentSuccess.js";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [strength, setStrength] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const navigate = useNavigate();

  // ✅ Password Strength
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

  const toggleModal = () => setShowModal(!showModal);
  const switchForm = () => setIsLogin(!isLogin);

  // ✅ Volunteer Submit
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies
        body: JSON.stringify({ name, email, phone }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: "Server did not return valid JSON" };
      }

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
    }
  };

  // ✅ Signup Submit
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          phone: signupPhone,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: "Server did not return valid JSON" };
      }

      alert(data.message || "Signup successful!");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupPhone("");
      setIsLogin(true);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // ✅ Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- key change
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: "Server did not return valid JSON" };
      }

      if (response.ok) {
        alert("Login successful!");
        // token now comes as cookie; no need to store in localStorage
        setShowModal(false);
        setLoginEmail("");
        setLoginPassword("");
        if (data.role === "admin") navigate("/admin");
        else navigate("/profile");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Navbar */}
              <nav>
                <div className="logo">Tripara chain</div>
                <div
                  className="menu-icon"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? "✖" : "☰"}
                </div>
                <ul className={menuOpen ? "open" : ""}>
                  <li>
                    <a href="#home" onClick={() => setMenuOpen(false)}>
                      Home
                    </a>
                  </li>
                  <li>
                    <Link to="/location" onClick={() => setMenuOpen(false)}>
                      Locations
                    </Link>
                  </li>
                  <li>
                    <Link to="/donate" onClick={() => setMenuOpen(false)}>
                      Donate
                    </Link>
                  </li>
                  <li>
                    <a href="#volunteer" onClick={() => setMenuOpen(false)}>
                      Volunteer
                    </a>
                  </li>
                  <li>
                    <a href="#gallery" onClick={() => setMenuOpen(false)}>
                      Gallery
                    </a>
                  </li>
                  <li>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>
                      About
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Login/Signup Button */}
              <div className="oval-button">
                <button id="boled" onClick={toggleModal}>
                  Login/Signup
                </button>
              </div>

              {/* Hero Section */}
              <header id="home">
                <h1>Tripara organization</h1>
                <p>
                  Our initiative is dedicated to feeding those in need. Every
                  meal we serve brings hope and kindness.
                </p>
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
                  <PhoneInputBox value={phone} onChange={setPhone} />
                  <button type="submit">Join Now</button>
                </form>
              </div>

              {/* Gallery */}
              <div className="section" id="gallery">
                <h2>Our Food Serving Moments</h2>
                <div className="gallery">
                  <img src="/images/children.jpg" alt="Serving 1" />
                  <img src="/images/children1.jpg" alt="Serving 2" />
                  <img src="/images/volunteer.jpg" alt="Serving 3" />
                  <img src="/images/volunteer1.jpg" alt="Serving 4" />
                </div>
              </div>

              <footer>© 2025 Free Food Serving. All rights reserved.</footer>

              {/* Login / Signup Modal */}
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
                          />
                          <PhoneInputBox
                            value={signupPhone}
                            onChange={setSignupPhone}
                          />
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
                      />

                      <input
                        type="password"
                        placeholder="Password"
                        required
                        value={isLogin ? loginPassword : signupPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isLogin) setLoginPassword(value);
                          else {
                            setSignupPassword(value);
                            checkPasswordStrength(value);
                          }
                        }}
                      />

                      {!isLogin && signupPassword && (
                        <p className={`strength ${strengthColor}`}>
                          Strength: {strength}
                        </p>
                      )}

                      {isLogin && (
                        <button
                          type="button"
                          className="forgot-btn"
                          onClick={() => {
                            setShowModal(false);
                            setShowForgotModal(true);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#007bff",
                            cursor: "pointer",
                            marginTop: "5px",
                            textDecoration: "underline",
                            fontSize: "0.9rem",
                          }}
                        >
                          Forgot Password?
                        </button>
                      )}

                      <button type="submit">
                        {isLogin ? "Login" : "Signup"}
                      </button>
                    </form>

                    <p className="switch-text">
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                      <button onClick={switchForm} className="switch-btn">
                        {isLogin ? "Signup" : "Login"}
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* Forgot Password Modal */}
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
                          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/forgot-password`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ email: forgotEmail }),
                            }
                          );
                          const data = await response.json();
                          alert(
                            data.message || "Check your email for reset link!"
                          );
                          setForgotEmail("");
                          setShowForgotModal(false);
                        } catch (error) {
                          console.error(error);
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
                      <button type="submit">Send Reset Link</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/location" element={<LocationSection />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
