import {
  useState,
  useEffect,
  useRef,
} from "react";

import { Bell, LogOut } from "lucide-react";

import API from "../api/axios";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useNotifications,
} from "../context/NotificationContext";

function Navbar() {
  const { logout, user } = useAuth();
  const {
    notifications,
    clearNotifications,
  } = useNotifications();
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

          <div className="position-relative">

            <Bell size={20} />

            {notifications.length > 0 && (

              <span
                className="position-absolute badge rounded-pill bg-danger"
                style={{
                  top: "-8px",
                  right: "-10px",
                  fontSize: "10px",
                }}
              >
                {notifications.length}
              </span>

            )}

          </div>
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

                {notifications.length > 0 && (

                  <>

                    <h6 className="text-danger">
                      Visitor Requests
                    </h6>

                    {notifications.map((notification, index) => (

                      <div
                        key={notification.id}
                        className="border-bottom pb-3 mb-3 d-flex"
                      >

                        <div
                          className="rounded-circle bg-danger text-white d-flex justify-content-center align-items-center me-3"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </div>

                        <div>

                          <div
                            className="fw-semibold"
                          >
                            {notification.message}
                          </div>

                          <small
                            className="text-muted"
                          >
                            {notification.time}
                          </small>

                        </div>

                      </div>

                    ))}

                    <button
                      className="btn btn-sm btn-outline-secondary w-100 mb-3"
                      onClick={clearNotifications}
                    >
                      Clear All
                    </button>

                    <hr />

                  </>

                )}

                <h6 className="text-primary">
                  Notices
                </h6>

                {notices.length === 0 ? (

                  <p className="mb-0">
                    No notices
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