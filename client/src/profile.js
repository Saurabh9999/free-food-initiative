import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [usr, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.usr);
          setFormData({
            name: data.usr.name,
            email: data.usr.email,
            phone: data.usr.phone,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login page
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Save Profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        setUser(data.updatedUser);
        setEditMode(false);
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  if (!usr) return <h2>Loading profile...</h2>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        paddingTop: "50px",
        position: "relative",
      }}
    >
      {/* 🔹 Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>👤 Welcome back, {usr.name}</h1>

        {editMode ? (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={inputStyle}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              style={inputStyle}
            />
            <button onClick={handleSave} style={saveButtonStyle}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {usr.name}</p>
            <p><strong>Email:</strong> {usr.email}</p>
            <p><strong>Phone:</strong> {usr.phone}</p>
            <button
              onClick={() => setEditMode(true)}
              style={editButtonStyle}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Styling Helpers
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const saveButtonStyle = {
  width: "100%",
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const editButtonStyle = {
  marginTop: "20px",
  width: "100%",
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Profile;
