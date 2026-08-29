import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Book a car wash and keep your vehicle looking its best.",
    icon: "🚗",
    path: "/auth/customer/login",
  },
  {
    id: "provider",
    title: "Service Provider",
    description: "Manage your services and connect with more customers.",
    icon: "🛠️",
    path: "/auth/provider/login",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage the platform, users, and service network.",
    icon: "⚙️",
    path: "/auth/admin/login",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">

        {/* Back button */}
        <button
          className="role-back-button"
          onClick={() => navigate("/")}
        >
          <span>←</span>
          Back to home
        </button>

        {/* Header */}
        <div className="role-selection-header">
          <span className="role-small-label">WELCOME TO SMART CAR WASH</span>

          <h1>How would you like to continue?</h1>

          <p>
            Choose your account type to continue to the right sign-in page.
          </p>
        </div>

        {/* Role cards */}
        <div className="role-cards">

          {roles.map((role) => (
            <button
              key={role.id}
              className="role-card"
              onClick={() => handleRoleSelect(role.path)}
            >
              <div className="role-card-icon">
                <span>{role.icon}</span>
              </div>

              <div className="role-card-content">
                <h2>{role.title}</h2>

                <p>{role.description}</p>

                <span className="role-card-action">
                  Continue
                  <span>→</span>
                </span>
              </div>
            </button>
          ))}

        </div>

        {/* Footer message */}
        <div className="role-help">
          <span>Already know your account type?</span>
          <strong>Select an option above to continue.</strong>
        </div>

      </div>
    </div>
  );
}