import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Home,
  Users,
  ShieldCheck,
  Building2,
  Wrench,
  Car,
  Bell,
  Calendar,
} from "lucide-react";

function Sidebar() {
  const { user } = useAuth();

  const role = user?.user?.role;

  const navClass = ({ isActive }) =>
  isActive
    ? "d-flex align-items-center text-decoration-none fw-bold px-3 py-2 rounded text-white"
    : "d-flex align-items-center text-decoration-none px-3 py-2 text-white";

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#111827",
        color: "white",
      }}
    >
      <div className="p-4">

        <h4
          className="fw-bold mb-1"
          style={{ color: "#60A5FA" }}
        >
          NestHub
        </h4>

        <hr className="border-secondary" />

        <ul className="list-unstyled">

          {/* Dashboard */}
          <li className="mb-3">
            <NavLink
              to="/dashboard"
              className={navClass}
              style={({ isActive }) => ({
                background: isActive ? "#374151" : "transparent",
              })}
            >
              <div className="d-flex align-items-center gap-2">
                <Home size={18} />
                Dashboard
              </div>
            </NavLink>
          </li>

          {/* Admin Menu */}
          {role === "admin" && (
            <>
              <li className="mb-3">
                <NavLink
                  to="/users"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <ShieldCheck size={18} />
                    Users
                  </div>
                </NavLink>
              </li>
              <li className="mb-3">
                <NavLink
                  to="/residents"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Users size={18} />
                    Residents
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/flats"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Building2 size={18} />
                    Flats
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/complaints"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Wrench size={18} />
                    Complaints
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/visitors"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Car size={18} />
                    Visitors
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/facilities"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Building2 size={18} />
                    Facilities
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/event-bookings"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={18} />
                    Event Bookings
                  </div>
                </NavLink>
              </li>
            </>
          )}

          {/* Resident Menu */}
          {role === "resident" && (
            <>
              <li className="mb-3">
                <NavLink
                  to="/complaints"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Wrench size={18} />
                    My Complaints
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/visitors"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Car size={18} />
                    My Visitors
                  </div>
                </NavLink>
              </li>

              <li className="mb-3">
                <NavLink
                  to="/event-bookings"
                  className={navClass}
                  style={({ isActive }) => ({
                    background: isActive ? "#374151" : "transparent",
                  })}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={18} />
                    My Bookings
                  </div>
                </NavLink>
              </li>
            </>
          )}

          {/* Maintenance Menu */}
          {role === "maintenance" && (
            <li className="mb-3">
              <NavLink
                to="/complaints"
                className={navClass}
                style={({ isActive }) => ({
                  background: isActive ? "#374151" : "transparent",
                })}
              >
                <div className="d-flex align-items-center gap-2">
                  <Wrench size={18} />
                  Complaints
                </div>
              </NavLink>
            </li>
          )}

          {/* Security Menu */}
          {role === "security" && (
            <li className="mb-3">
              <NavLink
                to="/visitors"
                className={navClass}
                style={({ isActive }) => ({
                  background: isActive ? "#374151" : "transparent",
                })}
              >
                <div className="d-flex align-items-center gap-2">
                  <Car size={18} />
                  Visitors
                </div>
              </NavLink>
            </li>
          )}

          {/* Notices */}
          <li className="mb-3">
            <NavLink
              to="/notices"
              className={navClass}
              style={({ isActive }) => ({
                background: isActive ? "#374151" : "transparent",
              })}
            >
              <div className="d-flex align-items-center gap-2">
                <Bell size={18} />
                Notices
              </div>
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default Sidebar;