import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { toast } from "react-toastify";

function Users() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "resident",
    });

  const [editingUser, setEditingUser] = useState(null);

  const [editData, setEditData] =
    useState({
      name: "",
      email: "",
      phone: "",
      role: "",
    });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const { data } =
        await API.get(
          "/auth/users"
        );

      setUsers(data.users);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const openEditForm = (user) => {

    setEditingUser(user);

    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  };

  const updateUser = async () => {

    try {

      await API.put(
        `/auth/users/${editingUser._id}`,
        editData
      );

      toast.success(
        "User updated successfully"
      );

      setEditingUser(null);

      fetchUsers();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };

  const deleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/auth/users/${id}`
      );

      toast.success(
        "User deleted successfully"
      );

      fetchUsers();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        await API.post(
          "/auth/register",
          formData
        );

        toast.success(
          "User created successfully"
        );

        setShowForm(false);

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "resident",
        });

        fetchUsers();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed to create user"
        );
      }
    };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const filteredUsers =
  users.filter((user) => {

    const matchesSearch =
      user.name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    return (
      matchesSearch &&
      matchesRole
    );

  });

  return (
    <Layout>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

        <h2>
          Users
        </h2>

        <div className="d-flex gap-2">

          <input
            type="text"
            className="form-control"
            placeholder="Search User"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          <select
            className="form-control"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
          >
            <option value="all">
              All Roles
            </option>

            <option value="resident">
              Resident
            </option>

            <option value="maintenance">
              Maintenance
            </option>

            <option value="security">
              Security
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

          <button
            className="btn btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >
            Add User
          </button>

        </div>

      </div>

      {showForm && (
        <div className="card mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Add User
            </h5>

            <form
              onSubmit={submitHandler}
            >

              <input
                className="form-control mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone:
                      e.target.value,
                  })
                }
              />

              <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password:
                      e.target.value,
                  })
                }
              />

              <select
                className="form-control mb-3"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role:
                      e.target.value,
                  })
                }
              >
                <option value="resident">
                  Resident
                </option>

                <option value="maintenance">
                  Maintenance
                </option>

                <option value="security">
                  Security
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

              <button
                className="btn btn-primary me-2"
              >
                Add User
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

            </form>

          </div>

        </div>
      )}

      {editingUser && (

        <div className="card mb-4">

          <div className="card-body">

            <h5>Edit User</h5>

            <input
              className="form-control mb-2"
              value={editData.name}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name: e.target.value,
                })
              }
            />

            <input
              className="form-control mb-2"
              value={editData.email}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  email: e.target.value,
                })
              }
            />

            <input
              className="form-control mb-2"
              value={editData.phone}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  phone: e.target.value,
                })
              }
            />

            <select
              className="form-control mb-3"
              value={editData.role}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  role: e.target.value,
                })
              }
            >
              <option value="resident">
                Resident
              </option>

              <option value="maintenance">
                Maintenance
              </option>

              <option value="security">
                Security
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

            <button
              className="btn btn-success me-2"
              onClick={updateUser}
            >
              Update
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditingUser(null)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      <div className="table-responsive">
        <table className="table table-bordered">

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr key={user._id}>

                <td>
                  {user.name}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.phone}
                </td>

                <td>
                  {user.role}
                </td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      openEditForm(user)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteUser(user._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </Layout>
  );
}

export default Users;