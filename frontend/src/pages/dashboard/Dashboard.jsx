import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const { user } = useAuth();
  const [dashboardRole, setDashboardRole] = useState("");

  const [recentVisitors, setRecentVisitors] = useState([]);

  const [recentNotices, setRecentNotices] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    const { data } = await API.get("/dashboard/stats");
    setStats(data.stats);
    setDashboardRole(data.role);

    setRecentComplaints(
      data.recentComplaints || []
    );

    setRecentVisitors(
      data.recentVisitors || []
    );

    setRecentNotices(
      data.recentNotices || []
    );

  } catch (error) {
      console.log(error);

  } finally {
      setLoading(false);
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
    <div className="d-flex">

      <Sidebar />

      <div className="flex-grow-1">

        <Navbar />

        <div className="container-fluid p-4">

          <div className="mb-4">
            <h2 className="fw-bold">

              {dashboardRole === "admin" &&
                "Welcome Back Admin!"}

              {dashboardRole === "resident" &&
                "Welcome Back!"}

              {dashboardRole === "security" &&
                "Welcome Back Security!"}

              {dashboardRole === "maintenance" &&
                "Welcome Back Maintenance!"}

            </h2>

            <p className="text-muted">

              {dashboardRole === "admin" &&
                "Monitor residents, facilities, complaints and apartment operations."}

              {dashboardRole === "resident" &&
                "Track your complaints, visitors, bookings and community notices."}

              {dashboardRole === "security" &&
                "Manage visitor entries and monitor apartment access."}

              {dashboardRole === "maintenance" &&
                "Track assigned complaints and maintenance progress."}

            </p>

          </div>

          <div className="mb-4">
            <div
              className="bg-white p-4 shadow-sm"
              style={{
                borderRadius: "16px",
              }}
            >
              <h5 className="fw-bold">

                {dashboardRole === "admin" &&
                  "Community Overview"}

                {dashboardRole === "resident" &&
                  "Resident Overview"}

                {dashboardRole === "security" &&
                  "Visitor Management"}

                {dashboardRole === "maintenance" &&
                  "Maintenance Overview"}

              </h5>

              <p className="text-muted mb-0">

                {dashboardRole === "admin" &&
                  "Monitor apartment operations and resident activities."}

                {dashboardRole === "resident" &&
                  "View your apartment activities and community updates."}

                {dashboardRole === "security" &&
                  "Monitor visitor movements and apartment access records."}

                {dashboardRole === "maintenance" &&
                  "Track assigned maintenance tasks and complaint resolution progress."}

              </p>
              
            </div>
          </div>

          <div className="row g-4">

            {dashboardRole === "admin" && (
              <>
                <div className="col-md-3 mb-3">
                  <StatCard
                    title="Total Residents"
                    value={stats.totalResidents || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="Total Flats"
                    value={stats.totalFlats || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="Open Complaints"
                    value={stats.openComplaints || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="Pending Visitors"
                    value={stats.pendingVisitors || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="Resolved Complaints"
                    value={stats.resolvedComplaints || 0}
                  />
                </div>
              </>
            )}

            {dashboardRole === "resident" && (
              <>
                <div className="col-md-3 mb-3">
                  <StatCard
                    title="My Complaints"
                    value={stats.myComplaints || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="Open Complaints"
                    value={stats.openComplaints || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="My Visitors"
                    value={stats.myVisitors || 0}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <StatCard
                    title="My Bookings"
                    value={stats.myBookings || 0}
                  />
                </div>
              </>
            )}

            {dashboardRole === "maintenance" && (
              <>
                <div className="col-md-4 mb-3">
                  <StatCard
                    title="Assigned"
                    value={stats.assignedComplaints || 0}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <StatCard
                    title="In Progress"
                    value={stats.inProgressComplaints || 0}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <StatCard
                    title="Resolved"
                    value={stats.resolvedComplaints || 0}
                  />
                </div>
              </>
            )}

            {dashboardRole === "security" && (
              <>
                <div className="col-md-4 mb-3">
                  <StatCard
                    title="Today's Visitors"
                    value={stats.todayVisitors || 0}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <StatCard
                    title="Checked In"
                    value={stats.checkedInVisitors || 0}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <StatCard
                    title="Checked Out"
                    value={stats.checkedOutVisitors || 0}
                  />
                </div>
              </>
            )}

          </div>

          <div className="card mt-4">

            <div className="card-body">

              <h5 className="mb-3">

                {dashboardRole === "admin" &&
                  "Recent Complaints"}

                {dashboardRole === "maintenance" &&
                  "My Assigned Complaints"}

                {dashboardRole === "security" &&
                  "Recent Visitors"}

                {dashboardRole === "resident" &&
                  "Recent Notices"}

              </h5> 

              {dashboardRole === "resident" && (
                <div className="table-responsive">
                  <table className="table table-bordered">

                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>

                      {recentNotices.map(
                        (notice) => (

                        <tr key={notice._id}>

                          <td>
                            {notice.title}
                          </td>

                          <td>
                            {new Date(
                              notice.createdAt
                            ).toLocaleDateString()}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>
                </div>

              )}

              {dashboardRole === "security" && (

                <div className="table-responsive">
                  <table className="table table-bordered">

                    <thead>
                      <tr>
                        <th>Visitor</th>
                        <th>Flat</th>
                        <th>Purpose</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {recentVisitors.map(
                        (visitor) => (

                        <tr key={visitor._id}>

                          <td>
                            {visitor.visitorName}
                          </td>

                          <td>
                            {visitor.flat?.flatNumber}
                          </td>

                          <td>
                            {visitor.purpose}
                          </td>

                          <td>
                            {visitor.status}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>
                </div>
              )}

              {(
                dashboardRole === "admin" ||
                dashboardRole === "maintenance"
              ) && (

                <div className="table-responsive">
                  <table className="table table-bordered">

                    <thead>
                      <tr>
                        <th>Resident</th>
                        <th>Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {recentComplaints.map(
                        (complaint) => (

                        <tr
                          key={complaint._id}
                        >

                          <td>
                            {
                              complaint.resident
                              ?.user?.name ||
                              "N/A"
                            }
                          </td>

                          <td>
                            {complaint.category}
                          </td>

                          <td>
                            {complaint.status}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;