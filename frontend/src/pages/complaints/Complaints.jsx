import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const role = user?.user?.role;

  const [maintenanceUsers, setMaintenanceUsers] = useState([]);

  const [assigningComplaint, setAssigningComplaint] = useState(null);

  const [selectedMaintenance, setSelectedMaintenance] = useState("");

  const [formData, setFormData] =
    useState({
      category: "",
      priority: "Medium",
      description: "",
    });

  const [showForm, setShowForm] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {

    fetchComplaints();

    if (role === "admin") {
      fetchMaintenanceUsers();
    }

  }, [role]);

  const fetchComplaints = async () => {
    try {
      const { data } =
        role === "resident"
          ? await API.get("/complaints/my")
          : await API.get("/complaints");

      setComplaints(data.complaints);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {

    switch (status) {

      case "Open":
        return "bg-danger";

      case "Assigned":
        return "bg-warning";

      case "In Progress":
        return "bg-primary";

      case "Resolved":
        return "bg-success";

      default:
        return "bg-dark";
    }
  };

  const fetchMaintenanceUsers = async () => {
    try {

      const { data } =
        await API.get(
          "/auth/maintenance-users"
        );

      setMaintenanceUsers(data.users);

    } catch (error) {
      console.log(error);
    }
  };

  const assignComplaint = async () => {

    try {

      await API.put(
        `/complaints/${assigningComplaint._id}/assign`,
        {
          maintenanceUserId:
            selectedMaintenance,
        }
      );

      toast.success(
        "Complaint assigned successfully"
      );

      setAssigningComplaint(null);

      setSelectedMaintenance("");

      fetchComplaints();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Assignment failed"
      );
    }
  };

  const updateStatus = async (
    complaintId,
    status
  ) => {

    try {

      await API.put(
        `/complaints/${complaintId}/status`,
        { status }
      );

      toast.success(
        "Status updated successfully"
      );

      fetchComplaints();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Status update failed"
      );
    }
  };

  const createComplaint = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/complaints",
        formData
      );

      toast.success(
        "Complaint created successfully"
      );

      setFormData({
        category: "",
        priority: "Medium",
        description: "",
      });

      setShowForm(false);

      fetchComplaints();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Complaint creation failed"
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

  const filteredComplaints =
  complaints.filter(
    (complaint) =>
      statusFilter === "all" ||
      complaint.status ===
        statusFilter
  );

  return (
    <Layout>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

        <h2>
          Complaints
        </h2>

        <select
          className="form-control w-auto"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="all">
            All Status
          </option>

          <option value="Open">
            Open
          </option>

          <option value="Assigned">
            Assigned
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Resolved">
            Resolved
          </option>

        </select>

      </div>

      {role === "resident" && !showForm && (

        <button
          className="btn btn-primary mb-4"
          onClick={() =>
            setShowForm(true)
          }
        >
          + Add Complaint
        </button>

      )}

      {role === "resident" && showForm && (

        <div className="card mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Create Complaint
            </h5>

            <form onSubmit={createComplaint}>

              <select
                className="form-control mb-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
              >

                <option value="">
                  Select Category
                </option>

                <option value="Electrical">
                  Electrical
                </option>

                <option value="Plumbing">
                  Plumbing
                </option>

                <option value="Water Supply">
                  Water Supply
                </option>

                <option value="Security">
                  Security
                </option>

                <option value="Cleaning">
                  Cleaning
                </option>

                <option value="Elevator">
                  Elevator
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              <select
                className="form-control mb-2"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>

              </select>

              <textarea
                className="form-control mb-3"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

              <button
                className="btn btn-primary"
              >
                Submit Complaint
              </button>

              <button
                type="button"
                className="btn btn-secondary ms-2"
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

      {assigningComplaint && (

        <div className="card mb-4">

          <div className="card-body">

            <h5>
              Assign Complaint
            </h5>

            <select
              className="form-control mb-3"
              value={selectedMaintenance}
              onChange={(e) =>
                setSelectedMaintenance(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Maintenance User
              </option>

              {maintenanceUsers.map((user) => (

                <option
                  key={user._id}
                  value={user._id}
                >
                  {user.name}
                </option>

              ))}

            </select>

            <button
              className="btn btn-success me-2"
              onClick={assignComplaint}
            >
              Assign
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setAssigningComplaint(null)
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
              {(role === "admin" || role === "maintenance") && (
                <th>Resident</th>
              )}
              <th>Flat</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredComplaints.map((complaint) => (

              <tr key={complaint._id}>

                {(role === "admin" || role === "maintenance") && (
                  <td>
                    {complaint.resident?.user?.name}
                  </td>
                )}
                <td>
                  {complaint.flat?.flatNumber}
                </td>

                <td>
                  {complaint.category}
                </td>

                <td>
                  {complaint.priority}
                </td>

                <td>
                  <span
                    className={`badge ${getStatusBadge(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </td>

                <td>
                  {complaint.assignedTo?.name || "Not Assigned"}
                </td>

                <td>
                  {complaint.description}
                </td>

                <td>

                  {role === "admin" &&
                  complaint.status === "Open" && (

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        setAssigningComplaint(
                          complaint
                        )
                      }
                    >
                      Assign
                    </button>

                  )}

                  {role === "maintenance" &&
                  complaint.status === "Assigned" && (

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        updateStatus(
                          complaint._id,
                          "In Progress"
                        )
                      }
                    >
                      In Progress
                    </button>

                  )}

                  {role === "maintenance" &&
                  complaint.status === "In Progress" && (

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        updateStatus(
                          complaint._id,
                          "Resolved"
                        )
                      }
                    >
                      Resolve
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

export default Complaints;