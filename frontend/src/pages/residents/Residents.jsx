import { useEffect, useState } from "react";

import API from "../../api/axios";
import { toast } from "react-toastify";

import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

function Residents() {

  const [residents, setResidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] =
    useState({
        userId: "",
        flatNumber: "",
        block: "",
        occupancyType: "Owner",
        emergencyContact: "",
    });

  const [editingResident, setEditingResident] = useState(null);

  const [editData, setEditData] =
    useState({
        occupancyType: "",
        emergencyContact: "",
    });

  useEffect(() => {
  fetchResidents();
  fetchFlats();
  }, []);

  const fetchResidents = async () => {
    try {

        const { data } =
        await API.get("/residents");

        setResidents(data.residents);

        const residentUserIds =
        data.residents.map(
            (resident) =>
            resident.user?._id
        );

        const usersResponse =
        await API.get("/auth/users");

        const availableUsers =
        usersResponse.data.users.filter(
            (user) =>
            user.role === "resident" &&
            !residentUserIds.includes(
                user._id
            )
        );

        setUsers(availableUsers);

    } catch (error) {

        console.log(error);

    } finally {

        setLoading(false);

    }
  };


  const fetchFlats = async () => {
    try {

        const { data } =
        await API.get("/flats");

        const vacantFlats =
        data.flats.filter(
            (flat) =>
            flat.status === "Vacant"
        );

        setFlats(vacantFlats);

    } catch (error) {
        console.log(error);
    }
  };

  const createResident = async () => {

    try {

        await API.post(
        "/residents",
        formData
        );

        toast.success(
        "Resident Created"
        );

        setShowForm(false);

        fetchResidents();
        // fetchUsers();
        fetchFlats();

    } catch (error) {

        toast.error(
        error.response?.data?.message ||
        "Creation Failed"
        );
    }
  };

  const deleteResident = async (id) => {
    const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this resident?"
        );

    if (!confirmDelete) {
    return;
    }
    try {
        await API.delete(
        `/residents/${id}`
        );

        toast.success(
        "Resident deleted successfully"
        );

        fetchResidents();
        // fetchUsers();
        fetchFlats();

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

  const openEditForm = (resident) => {

    setEditingResident(resident);

    setEditData({
        occupancyType:
        resident.occupancyType,
        emergencyContact:
        resident.emergencyContact,
    });
  };

  const updateResident = async () => {

    try {

        await API.put(
        `/residents/${editingResident._id}`,
        editData
        );

        toast.success(
        "Resident updated successfully"
        );

        setEditingResident(null);

        fetchResidents();

    } catch (error) {

        toast.error(
        error.response?.data?.message ||
        "Update failed"
        );
    }
  };

  const filteredResidents =
  residents.filter((resident) => {

    const search =
      searchTerm
        .toLowerCase()
        .replace("-", "");

    const flatNumber =
      resident.flatNumber
        ?.toLowerCase()
        .replace("-", "");

    return (
      resident.user?.name
        ?.toLowerCase()
        .includes(search) ||

      flatNumber?.includes(search)
    );

  });

  return (
    <Layout>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">

            <h2>Residents</h2>

            <div className="d-flex gap-2">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Resident"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    Add Resident
                </button>

            </div>

        </div>

        {showForm && (

        <div className="card mb-4">

            <div className="card-body">

            <h5>Add Resident</h5>

            <select
                className="form-control mb-2"
                value={formData.userId}
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    userId: e.target.value,
                    })
                }
                >
                <option value="">
                    Select User
                </option>

                {users.map((user) => (

                    <option
                    key={user._id}
                    value={user._id}
                    >
                    {user.name} ({user.email})
                    </option>

                ))}
                </select>

            <select
                className="form-control mb-2"
                value={formData.flatNumber}
                onChange={(e) => {

                    const selectedFlat =
                    flats.find(
                        (flat) =>
                        flat.flatNumber ===
                        e.target.value
                    );

                    setFormData({
                    ...formData,
                    flatNumber:
                        selectedFlat.flatNumber,
                    block:
                        selectedFlat.block,
                    });
                }}
                >
                <option value="">
                    Select Vacant Flat
                </option>

                {flats.map((flat) => (

                    <option
                    key={flat._id}
                    value={flat.flatNumber}
                    >
                    {flat.flatNumber}
                    {" - "}
                    Block {flat.block}
                    </option>

                ))}
            </select>

            <input
                className="form-control mb-2"
                placeholder="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    emergencyContact:
                    e.target.value,
                })
                }
            />

            <button
                className="btn btn-success"
                onClick={createResident}
            >
            Save
            </button>

            </div>

        </div>

        )}

        {editingResident && (

            <div className="card mb-4">

                <div className="card-body">

                <h5>Edit Resident</h5>

                <select
                    className="form-control mb-2"
                    value={editData.occupancyType}
                    onChange={(e) =>
                    setEditData({
                        ...editData,
                        occupancyType:
                        e.target.value,
                    })
                    }
                >
                    <option value="Owner">
                    Owner
                    </option>

                    <option value="Tenant">
                    Tenant
                    </option>
                </select>

                <input
                    className="form-control mb-2"
                    placeholder="Emergency Contact"
                    value={editData.emergencyContact}
                    onChange={(e) =>
                    setEditData({
                        ...editData,
                        emergencyContact:
                        e.target.value,
                    })
                    }
                />

                <button
                    className="btn btn-success me-2"
                    onClick={updateResident}
                >
                    Update
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                    setEditingResident(null)
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
                        <th>Emergency Contact</th>
                        <th>Email</th>
                        <th>Flat</th>
                        <th>Block</th>
                        <th>Occupancy</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {filteredResidents.map((resident) => (

                        <tr key={resident._id}>

                            <td>
                                {resident.user?.name}
                            </td>

                            <td>
                                {resident.emergencyContact}
                            </td>

                            <td>
                                {resident.user?.email}
                            </td>

                            <td>
                                {resident.flatNumber}
                            </td>

                            <td>
                                {resident.block}
                            </td>

                            <td>
                                {resident.occupancyType}
                            </td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => openEditForm(resident)}
                                >
                                Edit
                                </button>
            
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                    deleteResident(resident._id)
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

export default Residents;