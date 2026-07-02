import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function EventBookings() {

  const { user } = useAuth();

  const role = user?.user?.role;

  const [bookings, setBookings] = useState([]);

  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingBooking, setEditingBooking] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [editData, setEditData] =
    useState({
      eventName: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      guestsCount: "",
    });

  const [formData, setFormData] =
    useState({
      facility: "",
      eventName: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      guestsCount: "",
    });

  const selectedFacility =
  facilities.find(
    (facility) =>
      facility._id ===
      formData.facility
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const facilityRes =
        await API.get(
          "/facilities"
        );

      setFacilities(
        facilityRes.data.facilities
      );

      const bookingRes =
        role === "admin"
          ? await API.get(
              "/event-bookings"
            )
          : await API.get(
              "/event-bookings/my"
            );

      setBookings(
        bookingRes.data.bookings
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const createBooking =
    async (e) => {

      e.preventDefault();

      try {

        if (
          Number(formData.guestsCount) >
          selectedFacility.capacity
        ) {
          toast.error(
            `Maximum capacity is ${selectedFacility.capacity} guests`
          );

          return;
        }

        await API.post(
          "/event-bookings",
          formData
        );

        toast.success(
          "Booking created"
        );

        setShowForm(false);

        setFormData({
          facility: "",
          eventName: "",
          bookingDate: "",
          startTime: "",
          endTime: "",
          guestsCount: "",
        });

        fetchData();

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
          "Booking failed"
        );
      }
    };

  const approveBooking =
    async (id) => {

      try {

        await API.put(
          `/event-bookings/${id}/approve`
        );

        toast.success(
          "Booking approved"
        );

        fetchData();

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
          "Approval failed"
        );
      }
    };

  const rejectBooking =
    async (id) => {

      try {

        await API.put(
          `/event-bookings/${id}/reject`
        );

        toast.success(
          "Booking rejected"
        );

        fetchData();

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
          "Reject failed"
        );
      }
    };

  const deleteBooking =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this booking?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/event-bookings/${id}`
      );

      toast.success(
        "Booking deleted successfully"
      );

      fetchData();

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
        "Delete failed"
      );

    }
  };

  const openEditForm = (
    booking
  ) => {

    setEditingBooking(
      booking
    );

    setEditData({
      eventName:
        booking.eventName,

      bookingDate:
        booking.bookingDate
          ?.split("T")[0],

      startTime:
        booking.startTime,

      endTime:
        booking.endTime,

      guestsCount:
        booking.guestsCount,
    });

  };

  const updateBooking =
  async () => {

    try {

      if (
        Number(editData.guestsCount) >
        editingBooking.facility.capacity
      ) {

        toast.error(
          `Maximum capacity is ${editingBooking.facility.capacity} guests`
        );

        return;
      }

      await API.put(
        `/event-bookings/${editingBooking._id}`,
        editData
      );

      toast.success(
        "Booking updated successfully"
      );

      setEditingBooking(
        null
      );

      fetchData();

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
        "Update failed"
      );

    }

  };

  const getStatusBadge =
    (status) => {

      switch (status) {

        case "Pending":
          return "bg-warning";

        case "Approved":
          return "bg-success";

        case "Rejected":
          return "bg-danger";

        default:
          return "bg-secondary";
      }
    };

  const filteredBookings =
  bookings.filter((booking) => {

    const matchesSearch =

      booking.eventName
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

      ||

      booking.facility?.name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

      ||

      booking.resident?.user?.name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

      ||

      booking.resident?.flatNumber
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesStatus =

      statusFilter === "All"

      ||

      booking.status ===
      statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );

  });

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

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2 className="mb-0">
            Event Bookings
          </h2>

          <div
            className="d-flex gap-2 ms-5"
            style={{ width: "450px" }}
          >

            <input
              type="text"
              className="form-control"
              placeholder="Search Booking"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>

        </div>

        {role === "resident" && (

          <button
            className="btn btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >
            Book Event
          </button>

        )}

      </div>

      {role === "resident" && showForm && (

        <div className="card mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Book Facility
            </h5>

            <form
              onSubmit={
                createBooking
              }
            >

              <select
                className="form-control mb-2"
                value={
                  formData.facility
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    facility:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Facility
                </option>

                {facilities.map(
                  (facility) => (
                    <option
                      key={
                        facility._id
                      }
                      value={
                        facility._id
                      }
                    >
                      {facility.name}
                    </option>
                  )
                )}
              </select>

              {selectedFacility && (

                <div className="alert alert-info mb-2">

                  <strong>
                    Maximum Capacity:
                  </strong>

                  {" "}
                  {selectedFacility.capacity}
                  {" "}
                  Guests

                </div>

              )}

              <input
                className="form-control mb-2"
                placeholder="Event Name"
                value={
                  formData.eventName
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventName:
                      e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="form-control mb-2"
                value={
                  formData.bookingDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bookingDate:
                      e.target.value,
                  })
                }
              />

              <input
                type="time"
                className="form-control mb-2"
                value={
                  formData.startTime
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startTime:
                      e.target.value,
                  })
                }
              />

              <input
                type="time"
                className="form-control mb-2"
                value={
                  formData.endTime
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endTime:
                      e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Guests Count"
                value={
                  formData.guestsCount
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guestsCount:
                      e.target.value,
                  })
                }
              />

              <button
                className="btn btn-primary me-2"
              >
                Book Facility
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

      {editingBooking && (

        <div className="card mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Edit Booking
            </h5>

            <div className="alert alert-info mb-3">

              <strong>
                Facility:
              </strong>

              {" "}
              {editingBooking.facility?.name}

              <br />

              <strong>
                Maximum Capacity:
              </strong>

              {" "}
              {editingBooking.facility?.capacity}
              {" "}
              Guests

            </div>

            <input
              className="form-control mb-2"
              value={editData.eventName}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  eventName:
                    e.target.value,
                })
              }
            />

            <input
              type="date"
              className="form-control mb-2"
              value={editData.bookingDate}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  bookingDate:
                    e.target.value,
                })
              }
            />

            <input
              type="time"
              className="form-control mb-2"
              value={editData.startTime}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  startTime:
                    e.target.value,
                })
              }
            />

            <input
              type="time"
              className="form-control mb-2"
              value={editData.endTime}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  endTime:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              className="form-control mb-3"
              value={editData.guestsCount}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  guestsCount:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={updateBooking}
            >
              Update
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditingBooking(
                  null
                )
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
              {role === "admin" && (
                <>
                  <th>Resident</th>
                  <th>Flat</th>
                </>
              )}
              <th>Facility</th>
              <th>Event</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Status</th>

              {(role === "admin" ||
                role === "resident") && (
                <th>
                  Actions
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {filteredBookings.map((booking) => (

                <tr
                  key={
                    booking._id
                  }
                >
                  {role === "admin" && (
                    <>
                      <td>
                        {booking.resident?.user?.name}
                      </td>

                      <td>
                        {booking.resident?.flatNumber}
                      </td>
                    </>
                  )}

                  <td>
                    {booking.facility?.name}
                  </td>

                  <td>
                    {booking.eventName}
                  </td>

                  <td>
                    {booking.guestsCount} Members
                  </td>

                  <td>
                    {new Date(
                      booking.bookingDate
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <span
                      className={`badge ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {
                        booking.status
                      }
                    </span>

                  </td>

                  {(role === "admin" || role === "resident") && (

                    <td>

                      {role === "resident" &&
                        booking.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                openEditForm(
                                  booking
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() =>
                                deleteBooking(
                                  booking._id
                                )
                              }
                            >
                              Delete
                            </button>
                          </>
                        )
                      }

                      {role === "admin" && (
                      <>
                        {booking.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                approveBooking(
                                  booking._id
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() =>
                                rejectBooking(
                                  booking._id
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            deleteBooking(
                              booking._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}

                    </td>

                  )}

                </tr>

              )
            )}

          </tbody>

        </table>
      </div>
    </Layout>
  );
}

export default EventBookings;