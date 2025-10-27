import React, { useEffect, useState } from "react";
import "./Admin.css"; // Create this CSS file

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [view, setView] = useState(""); // "users" or "volunteers"

  const fetchUsers = () => {
    fetch("/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error(err));
  };

  const fetchVolunteers = () => {
    fetch("/volunteers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setVolunteers(data.volunteers || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (view === "users") fetchUsers();
    if (view === "volunteers") fetchVolunteers();
  }, [view]);

  return (
    <div className="admin-container">
      <h1 className="admin-title">👨‍💼 Admin Dashboard</h1>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={`btn ${view === "users" ? "active" : ""}`}
          onClick={() => setView("users")}
        >
          View Users
        </button>
        <button
          className={`btn ${view === "volunteers" ? "active" : ""}`}
          onClick={() => setView("volunteers")}
        >
          View Volunteers
        </button>
      </div>

      {/* Conditional Tables */}
      {view === "users" && (
        <div className="table-section">
          <h2>All Users</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No users found 😔</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === "volunteers" && (
        <div className="table-section">
          <h2>All Volunteers</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length > 0 ? (
                volunteers.map((v, i) => (
                  <tr key={v._id}>
                    <td>{i + 1}</td>
                    <td>{v.name}</td>
                    <td>{v.email}</td>
                    <td>{v.phone || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No volunteers found 😔</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
