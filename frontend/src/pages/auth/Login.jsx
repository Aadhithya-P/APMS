import { useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const { data } =
        await API.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      login(data);

      navigate("/dashboard");

      toast.success(
        "Login Successful"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="container-fluid login-page">

      <div className="row min-vh-100">

        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-left">

          <div>

            <h1>
              🏢NestHub
            </h1>

            <p className="mt-4">

              Manage residents,
              visitors, complaints,
              facilities and bookings
              from one platform.

            </p>

            <div className="mt-4">

              <p>
                ✓ Resident Management
              </p>

              <p>
                ✓ Visitor Tracking
              </p>

              <p>
                ✓ Complaint Resolution
              </p>

              <p>
                ✓ Facility Booking
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">

          <div
            className="login-card"
            style={{
              width: "100%",
              maxWidth: "420px",
            }}
          >

            <h2 className="fw-bold mb-2">
              Welcome Back
            </h2>

            <p className="text-muted mb-4">
              Sign in to continue
            </p>

            <form
              onSubmit={
                submitHandler
              }
            >

              <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <div className="input-group mb-3">

                <input
                  className="form-control"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <div className="text-end mb-3">

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    toast.info(
                      "Forgot Password coming soon"
                    );
                  }}
                >
                  Forgot Password?
                </a>

              </div>

              <button
                className="btn btn-primary w-100 login-btn"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;