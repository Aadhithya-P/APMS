const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const Resident = require("../models/Resident");


// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Login User
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } else {

      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMaintenanceUsers = async (req, res) => {
  try {

    const users = await User.find({
      role: "maintenance",
    }).select("name email role");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateUser = async (req, res) => {
  try {

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deleteUser = async (req, res) => {
  try {

    const resident =
      await Resident.findOne({
        user: req.params.id,
      });

    if (resident) {
      return res.status(400).json({
        success: false,
        message:
          "User is assigned as a resident. Delete resident first.",
      });
    }

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const forgotPassword = async (req, res) => {

  let user;

  try {

    const { email } = req.body;

    // Find user
    user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });

    }

    // Generate reset token
    const resetToken =
      user.getResetPasswordToken();

    // Save hashed token & expiry
    await user.save({
      validateBeforeSave: false,
    });

    // Create reset URL
    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email HTML
    const message = `
      <!DOCTYPE html>
      <html>

      <head>
        <meta charset="UTF-8">
      </head>

      <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 20px;">

              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

                <tr>
                  <td
                    style="background:#0d6efd;color:white;padding:25px;text-align:center;">

                    <h1 style="margin:0;">
                      🏢 NestHub
                    </h1>

                    <p style="margin-top:8px;">
                      Apartment Management System
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="padding:35px;">

                    <h2 style="margin-top:0;color:#333;">
                      Reset Your Password
                    </h2>

                    <p style="color:#555;line-height:1.7;">

                      We received a request to reset the password for your
                      <strong>NestHub</strong> account.

                    </p>

                    <p style="color:#555;line-height:1.7;">

                      Click the button below to create a new password.

                    </p>

                    <div style="text-align:center;margin:40px 0;">

                      <a
                        href="${resetUrl}"
                        style="
                          background:#0d6efd;
                          color:white;
                          text-decoration:none;
                          padding:14px 28px;
                          border-radius:8px;
                          display:inline-block;
                          font-size:16px;
                          font-weight:bold;
                        "
                      >
                        Reset Password
                      </a>

                    </div>

                    <p style="color:#dc3545;font-weight:bold;">

                      ⏰ This link expires in 15 minutes.

                    </p>

                    <p style="color:#666;line-height:1.7;">

                      If you didn't request a password reset,
                      you can safely ignore this email.
                      Your password will remain unchanged.

                    </p>

                    <hr
                      style="
                        border:none;
                        border-top:1px solid #e5e5e5;
                        margin:30px 0;
                      "
                    />

                    <p style="font-size:13px;color:#888;">

                      If the button doesn't work,
                      copy and paste the following link into your browser:

                    </p>

                    <p
                      style="
                        font-size:12px;
                        color:#0d6efd;
                        word-break:break-all;
                      "
                    >
                      ${resetUrl}
                    </p>

                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      background:#f8f9fa;
                      padding:20px;
                      text-align:center;
                      color:#777;
                      font-size:13px;
                    "
                  >

                    © ${new Date().getFullYear()} NestHub

                    <br>

                    Secure Apartment Management Platform

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    await sendEmail({

      email: user.email,

      subject: "Password Reset Request",

      message,

    });

    res.status(200).json({

      success: true,

      message:
        "Password reset email sent successfully",

    });

  } catch (error) {

    console.error(error);

    // Remove token if email sending fails
    if (user) {

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({
        validateBeforeSave: false,
      });

    }

    let message =
      "Unable to send reset email. Please try again later.";

    res.status(500).json({
      success: false,
      message,
    });

  }

};

const resetPassword = async (req, res) => {

  try {

    // Hash the token from URL
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // Find matching user
    const user = await User.findOne({

      resetPasswordToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },

    });

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Reset token is invalid or has expired",

      });

    }

    const {
      password,
      confirmPassword,
    } = req.body;

    if (!password || !confirmPassword) {

      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password are required",
      });

    }

    if (password !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });

    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(200).json({

      success: true,

      message:
        "Password reset successful",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getMaintenanceUsers,
  getAllUsers,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};