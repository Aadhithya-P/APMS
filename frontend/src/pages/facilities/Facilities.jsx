import { useEffect, useState } from "react";
import API from "../../api/axios";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

import { toast } from "react-toastify";

function Facilities() {

  const [facilities, setFacilities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      capacity: "",
      bookingFee: "",
    });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {

      const { data } =
        await API.get("/facilities");

      setFacilities(
        data.facilities
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/facilities",
        formData
      );

      toast.success(
        "Facility added successfully"
      );

      setFormData({
        name: "",
        description: "",
        capacity: "",
        bookingFee: "",
      });

      fetchFacilities();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to add facility"
      );
    }
  };

  const deleteFacility = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this facility?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/facilities/${id}`
      );

      toast.success(
        "Facility deleted"
      );

      fetchFacilities();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
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

      <h2 className="mb-4">
        Facilities
      </h2>

      <div className="card mb-4">

        <div className="card-body">

          <h5 className="mb-3">
            Add Facility
          </h5>

          <form
            onSubmit={submitHandler}
          >

            <input
              className="form-control mb-2"
              placeholder="Facility Name"
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
              placeholder="Description"
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Capacity"
              value={
                formData.capacity
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Booking Fee"
              value={
                formData.bookingFee
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bookingFee:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-primary"
            >
              Add Facility
            </button>

          </form>

        </div>

      </div>

      <div className="table-responsive">
        <table className="table table-bordered">

          <thead>

            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Booking Fee</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {facilities.map(
              (facility) => (

                <tr
                  key={facility._id}
                >

                  <td>
                    {facility.name}
                  </td>

                  <td>
                    {
                      facility.description
                    }
                  </td>

                  <td>
                    {facility.capacity}
                  </td>

                  <td>
                    ₹
                    {
                      facility.bookingFee
                    }
                  </td>

                  <td>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteFacility(
                          facility._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>
      </div>
    </Layout>
  );
}

export default Facilities;