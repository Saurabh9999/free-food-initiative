// Admin.js
import React, { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [view, setView] = useState(""); // "users" or "volunteers"

  useEffect(() => {
    // Fetch Users if view is "users"
    const fetchUsers = async () => {   
      try {
        const res = await fetch(`${API_URL}/users`, {  
          method: "GET",
          credentials: "include", // important for cookie auth
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch Volunteers if view is "volunteers"
    const fetchVolunteers = async () => {
      try {
        const res = await fetch(`${API_URL}/volunteers`,{
          method: "GET",
          credentials: "include", // important for cookie auth
        });
        if (!res.ok) throw new Error("Failed to fetch volunteers");
        const data = await res.json();
        setVolunteers(data.volunteers || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (view === "users") fetchUsers();
    if (view === "volunteers") fetchVolunteers();
  }, [view]); // no ESLint warning

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

      {/* Users Table */}
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
                  <td colSpan="4" className="no-data">
                    No users found 😔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Volunteers Table */}
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
                  <td colSpan="4" className="no-data">
                    No volunteers found 😔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
