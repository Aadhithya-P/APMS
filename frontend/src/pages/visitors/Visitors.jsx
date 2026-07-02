import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [flats, setFlats] = useState([]);

  const [formData, setFormData] =
    useState({
      flatId: "",
      visitorName: "",
      phone: "",
      purpose: "",
      visitDate: "",
    });

  const { user } = useAuth();

  const role = user?.user?.role;

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {

      const { data } =
        role === "resident"
          ? await API.get("/visitors/my")
          : await API.get("/visitors");

      setVisitors(data.visitors);

      if (role === "security") {

        const flatsRes =
          await API.get("/flats");

        const occupiedFlats =
          flatsRes.data.flats.filter(
            (flat) => flat.resident
          );

        setFlats(occupiedFlats);

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const getStatusBadge = (status) => {

    switch (status) {

      case "Pending":
        return "bg-warning";

      case "Approved":
        return "bg-primary";

      case "Checked In":
        return "bg-success";

      case "Checked Out":
        return "bg-secondary";

      default:
        return "bg-dark";
    }
  };


  const checkInVisitor = async (id) => {

    try {

      await API.put(
        `/visitors/${id}/checkin`
      );

      toast.success(
        "Visitor checked in"
      );

      fetchVisitors();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Check-in failed"
      );
    }
  };

  const checkOutVisitor = async (id) => {

    try {

      await API.put(
        `/visitors/${id}/checkout`
      );

      toast.success(
        "Visitor checked out"
      );

      fetchVisitors();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Check-out failed"
      );
    }
  };

  const deleteVisitor = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this visitor?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/visitors/${id}`
      );

      toast.success(
        "Visitor deleted successfully"
      );

      fetchVisitors();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );

    }

  };

  const createVisitor = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/visitors",
        formData
      );

      toast.success(
        "Visitor created successfully"
      );

      setShowForm(false);

      setFormData({
        flatId: "",
        visitorName: "",
        phone: "",
        purpose: "",
        visitDate: "",
      });

      fetchVisitors();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Creation failed"
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

  const filteredVisitors =
  visitors.filter((visitor) => {

    const search =
      searchTerm
        .toLowerCase()
        .replace("-", "");

    const flatNumber =
      visitor.flat?.flatNumber
        ?.toLowerCase()
        .replace("-", "");

    return (
      visitor.visitorName
        ?.toLowerCase()
        .includes(search) ||

      flatNumber?.includes(search)
    );

  });

  return (
    <Layout>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

        <h2>
          Visitors
        </h2>

        <div className="d-flex gap-2">

          <input
            type="text"
            className="form-control"
            placeholder="Search Visitor"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          {role === "security" && (

            <button
              className="btn btn-primary"
              onClick={() =>
                setShowForm(true)
              }
            >
              Add Visitor
            </button>

          )}

        </div>

      </div>

      {showForm && (

        <div className="card mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Add Visitor
            </h5>

            <form
              onSubmit={createVisitor}
            >

              <select
                className="form-control mb-2"
                value={formData.flatId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    flatId:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select Flat
                </option>

                {flats.map((flat) => (

                  <option
                    key={flat._id}
                    value={flat._id}
                  >
                    {flat.flatNumber}
                  </option>

                ))}

              </select>

              <input
                className="form-control mb-2"
                placeholder="Visitor Name"
                value={
                  formData.visitorName
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visitorName:
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
                className="form-control mb-2"
                placeholder="Purpose"
                value={
                  formData.purpose
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purpose:
                      e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="form-control mb-3"
                value={
                  formData.visitDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visitDate:
                      e.target.value,
                  })
                }
              />

              <button
                className="btn btn-primary me-2"
              >
                Create Visitor
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

      <div className="table-responsive">
        <table className="table table-bordered">

          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Purpose</th>
              <th>Flat</th>
              {role !== "resident" && (
                <th>Resident</th>
              )}
              <th>Status</th>
              <th>Visit Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredVisitors.map((visitor) => (
              <tr key={visitor._id}>

                <td>
                  {visitor.visitorName}
                </td>

                <td>
                  {visitor.phone}
                </td>

                <td>
                  {visitor.purpose}
                </td>

                <td>
                  {visitor.flat?.flatNumber}
                </td>

                {role !== "resident" && (
                  <td>
                    {visitor.resident
                      ? visitor.resident.user?.name
                      : "No Resident"}
                  </td>
                )}

                <td>
                  <span
                    className={`badge ${getStatusBadge(
                      visitor.status
                    )}`}
                  >
                    {visitor.status}
                  </span>
                </td>

                <td>
                  {new Date(
                    visitor.visitDate
                  ).toLocaleDateString()}
                </td>

                <td>

                  {role === "security" &&
                  visitor.status === "Approved" && (

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        checkInVisitor(visitor._id)
                      }
                    >
                      Check In
                    </button>

                  )}

                  {role === "security" &&
                  visitor.status === "Checked In" && (

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        checkOutVisitor(visitor._id)
                      }
                    >
                      Check Out
                    </button>

                  )}

                  {role === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteVisitor(visitor._id)
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

export default Visitors;