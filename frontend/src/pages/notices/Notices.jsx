import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function Notices() {

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const role = user?.user?.role;

  const [showForm, setShowForm] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
    });

  const [editingNotice, setEditingNotice] = useState(null);

  const [editData, setEditData] =
    useState({
      title: "",
      description: "",
    });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {

      const { data } =
        await API.get("/notices");

      setNotices(data.notices);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createNotice = async () => {

    try {

      await API.post(
        "/notices",
        formData
      );

      toast.success(
        "Notice created successfully"
      );

      setShowForm(false);

      setFormData({
        title: "",
        description: "",
      });

      fetchNotices();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create notice"
      );
    }
  };

  const deleteNotice = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this notice?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/notices/${id}`
      );

      toast.success(
        "Notice deleted successfully"
      );

      fetchNotices();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  const openEditForm = (notice) => {

    setEditingNotice(notice);

    setEditData({
      title: notice.title,
      description: notice.description,
    });
  };

  const updateNotice = async () => {

    try {

      await API.put(
        `/notices/${editingNotice._id}`,
        editData
      );

      toast.success(
        "Notice updated successfully"
      );

      setEditingNotice(null);

      fetchNotices();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
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

  return (
    <Layout>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

        <h2>
          Notices
        </h2>

        {role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >
            Create Notice
          </button>
        )}

      </div>

      {showForm && (

        <div className="card mb-4">

          <div className="card-body">

            <h5>Create Notice</h5>

            <input
              className="form-control mb-2"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={createNotice}
            >
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {editingNotice && (

        <div className="card mb-4">

          <div className="card-body">

            <h5>Edit Notice</h5>

            <input
              className="form-control mb-2"
              value={editData.title}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="form-control mb-2"
              rows="4"
              value={editData.description}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={updateNotice}
            >
              Update
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditingNotice(null)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      <div className="row">

        {notices.map((notice) => (

          <div
            key={notice._id}
            className="col-md-6 mb-3"
          >

            <div className="card">

              <div className="card-body">

                <h5 className="card-title">
                  {notice.title}
                </h5>

                <p className="card-text">
                  {notice.description}
                </p>

                <small
                  className="text-muted"
                >
                  Posted By:
                  {" "}
                  {notice.postedBy?.name}
                </small>

                {role === "admin" && (

                  <div className="mt-3">

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        openEditForm(notice)
                      }
                    >
                    Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteNotice(notice._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Notices;