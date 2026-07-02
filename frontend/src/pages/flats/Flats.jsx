import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function Flats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const role = user?.user?.role;

  const [showForm, setShowForm] =
    useState(false);

  const [formData, setFormData] =
    useState({
      flatNumber: "",
      block: "",
      floor: "",
    });

  const [editingFlat, setEditingFlat] = useState(null);

  const [editData, setEditData] =
    useState({
      flatNumber: "",
      block: "",
      floor: "",
    });

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      const { data } =
        await API.get("/flats");

      setFlats(data.flats);

    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
    }
  };

  const createFlat = async () => {

    try {

      await API.post(
        "/flats",
        formData
      );

      toast.success(
        "Flat created successfully"
      );

      setShowForm(false);

      setFormData({
        flatNumber: "",
        block: "",
        floor: "",
      });

      fetchFlats();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create flat"
      );
    }
  };

  const deleteFlat = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this flat?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/flats/${id}`
      );

      toast.success(
        "Flat deleted successfully"
      );

      fetchFlats();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  const openEditForm = (flat) => {

    setEditingFlat(flat);

    setEditData({
      flatNumber: flat.flatNumber,
      block: flat.block,
      floor: flat.floor,
    });
  };

  const updateFlat = async () => {

    try {

      await API.put(
        `/flats/${editingFlat._id}`,
        editData
      );

      toast.success(
        "Flat updated successfully"
      );

      setEditingFlat(null);

      fetchFlats();

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
          Flats
        </h2>

        {role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >
            Add Flat
          </button>
        )}

      </div>

      {showForm && (

        <div className="card mb-4">

          <div className="card-body">

            <h5>Create Flat</h5>

            <input
              className="form-control mb-2"
              placeholder="Flat Number"
              value={formData.flatNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  flatNumber:
                    e.target.value,
                })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Block"
              value={formData.block}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  block:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Floor"
              value={formData.floor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  floor:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={createFlat}
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

      {editingFlat && (

        <div className="card mb-4">

          <div className="card-body">

            <h5>Edit Flat</h5>

            <input
              className="form-control mb-2"
              value={editData.flatNumber}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  flatNumber:
                    e.target.value,
                })
              }
            />

            <input
              className="form-control mb-2"
              value={editData.block}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  block:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              className="form-control mb-2"
              value={editData.floor}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  floor:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={updateFlat}
            >
              Update
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditingFlat(null)
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
              <th>Flat No</th>
              <th>Block</th>
              <th>Floor</th>
              <th>Status</th>
              <th>Resident</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {flats.map((flat) => (

              <tr key={flat._id}>

                <td>{flat.flatNumber}</td>

                <td>{flat.block}</td>

                <td>{flat.floor}</td>

                <td>{flat.status}</td>

                <td>
                  {flat.resident?.user?.name || "----------"}
                </td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      openEditForm(flat)
                    }
                  >
                    Edit
                  </button>

                  {flat.status === "Vacant" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteFlat(flat._id)
                      }
                    >
                      Delete
                    </button>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </Layout>
  );
}

export default Flats;