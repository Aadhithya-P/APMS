import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../../api/axios";

function ResetPassword() {

  const navigate = useNavigate();

  const { resetToken } = useParams();

  const [password, setPassword] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const { data } = await API.put(

        `/auth/reset-password/${resetToken}`,

        {
          password,
          confirmPassword,
        }

      );

      toast.success(data.message);

      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Password reset failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h2 className="mb-2">

          Reset Password

        </h2>

        <p className="text-muted mb-4">

          Enter your new password.

        </p>

        <form onSubmit={submitHandler}>

          <div className="input-group mb-3">

            <input
                className="form-control"
                type={
                showPassword
                    ? "text"
                    : "password"
                }
                placeholder="New Password"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)
                }
                required
            />

            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                setShowPassword(!showPassword)
                }
            >
                {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          <div className="input-group mb-3">

            <input
                className="form-control"
                type={
                showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                setConfirmPassword(
                    e.target.value
                )
                }
                required
            />

          </div>

          <button

            className="btn btn-primary w-100"

            disabled={loading}

          >

            {

              loading

                ? "Resetting..."

                : "Reset Password"

            }

          </button>

        </form>

      </div>

    </div>

  );

}

export default ResetPassword;