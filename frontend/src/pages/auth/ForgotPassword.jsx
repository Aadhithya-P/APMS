import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const { data } = await API.post(
        "/auth/forgot-password",
        { email }
      );

      toast.success(data.message);

      setEmail("");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h2 className="mb-2">
          Forgot Password
        </h2>

        <p className="text-muted mb-4">
          Enter your registered email address.
        </p>

        <form onSubmit={submitHandler}>

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {
              loading
                ? "Sending..."
                : "Send Reset Link"
            }
          </button>

        </form>

        <div className="text-center mt-3">

          <Link to="/">
            Back to Login
          </Link>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;