import {
  useState,
  useEffect,
  useRef,
} from "react";

import { Bell, LogOut } from "lucide-react";

import API from "../api/axios";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    try {

      const { data } =
        await API.get("/notices");

      setNotices(data.notices);

    } catch (error) {

      console.log(error);

    }
  };

  const logoutHandler = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target
          )
        ) {
          setShowNotifications(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-3 bg-white border-bottom"
      style={{
        height: "70px",
      }}
    >
      <div>
        {location.pathname === "/dashboard" && (
          <>
            <h4 className="mb-0 fw-bold">
              Hi, {user?.user?.name} 👋
            </h4>
          </>
        )}
      </div>

      

      <div className="d-flex align-items-center gap-3">

        <div
          ref={notificationRef}
          className="position-relative"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {

            if (!showNotifications) {
              fetchNotices();
            }

            setShowNotifications(
              !showNotifications
            );

          }}
        >

          <Bell size={20} />
          {showNotifications && (

            <div
              className="card shadow position-absolute"
              style={{
                width: "320px",
                right: 0,
                top: "30px",
                zIndex: 1000,
              }}
            >

              <div className="card-body">

                <h6 className="mb-3">
                  Notifications
                </h6>

                {notices.length === 0 ? (

                  <p className="mb-0">
                    No notifications
                  </p>

                ) : (

                  notices.map((notice) => (

                    <div
                      key={notice._id}
                      className="border-bottom pb-2 mb-2"
                    >

                      <strong>
                        {notice.title}
                      </strong>

                      <br />

                      <small>
                        {notice.description}
                      </small>

                    </div>

                  ))

                )}

              </div>

            </div>

          )}

        </div>

        <div className="text-end">
          <div className="fw-semibold">
            {user?.user?.name}
          </div>

          <small className="text-muted">
            {user?.user?.role}
          </small>
        </div>

        <button
          onClick={logoutHandler}
          className="btn btn-outline-danger btn-sm"
        >
          <LogOut size={16} />
        </button>

      </div>
    </div>
  );
}

export default Navbar;