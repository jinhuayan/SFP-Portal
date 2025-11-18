import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface User {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string[];
  status: string;
  createdAt: string;
}

export default function UserManagement() {
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "foster",
  });

  // Fetch volunteers from the backend
  useEffect(() => {
    if (currentUser?.role.includes("admin")) {
      fetchVolunteers();
    }
  }, [currentUser]);

  const fetchVolunteers = async () => {
    try {
      setIsLoading(true);
      const data = await apiGet("/api/volunteers");
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch volunteers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (
        !newUser.first_name ||
        !newUser.last_name ||
        !newUser.email ||
        !newUser.password
      ) {
        toast.error("Please fill in all fields");
        return;
      }
      await apiPost("/api/volunteers", newUser);
      toast.success("User added successfully");
      setShowAddModal(false);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "foster",
      });
      fetchVolunteers();
    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
    }
  };

  const handleRoleChange = async (
    userId: string,
    role: string,
    add: boolean
  ) => {
    try {
      await apiPut(`/api/volunteers/${userId}`, {
        role: add ? role : "foster",
      });
      toast.success(`${add ? "Added" : "Removed"} ${role} role from user.`);
      fetchVolunteers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await apiPut(`/api/volunteers/${userId}`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}.`);
      fetchVolunteers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!confirm("Are you sure you want to delete this user?")) return;
      await apiDelete(`/api/volunteers/${userId}`);
      toast.success("User deleted successfully");
      fetchVolunteers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  if (!currentUser || !currentUser.role.includes("admin")) {
    return (
      <div className="min-h-screen py-12 bg-[#FFDF4] dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-lock text-gray-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Access Denied
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                You need to be an admin to access this page.
              </p>
              <a
                href="/"
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter users
  let filteredUsers = users;

  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredUsers = users.filter(
      (user: User) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  // Apply role filter
  if (filterRole !== "all") {
    filteredUsers = users.filter((user: User) =>
      user.role.includes(filterRole)
    );
  }

  return (
    <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage users and their roles
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Add User
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="interviewer">Interviewers</option>
                <option value="foster">Fosters</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users List Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Roles
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                          <i className="fa-solid fa-spinner fa-spin text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Loading users...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <i className="fa-solid fa-search text-gray-400 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                          No users found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Try changing your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-user text-gray-500 dark:text-gray-400"></i>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(user.role)
                            ? user.role.map((role: string) => (
                                <span
                                  key={role}
                                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full role-badge ${
                                    role === "admin"
                                      ? "role-badge-admin"
                                      : role === "foster"
                                      ? "role-badge-foster"
                                      : role === "interviewer"
                                      ? "role-badge-interviewer"
                                      : "role-badge-adopter"
                                  }`}
                                >
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </span>
                              ))
                            : typeof user.role === "string" && (
                                <span
                                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full role-badge ${
                                    user.role === "admin"
                                      ? "role-badge-admin"
                                      : user.role === "foster"
                                      ? "role-badge-foster"
                                      : user.role === "interviewer"
                                      ? "role-badge-interviewer"
                                      : "role-badge-adopter"
                                  }`}
                                >
                                  {user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}
                                </span>
                              )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="Delete user"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>

                          {/* Role management dropdown */}
                          <div className="relative group">
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 z-50 hidden group-hover:block">
                              {["admin", "interviewer", "foster"].map(
                                (role) => {
                                  const hasRole = user.role.includes(role);
                                  return (
                                    <button
                                      key={role}
                                      disabled={
                                        hasRole &&
                                        role === "admin" &&
                                        user.id === currentUser.id
                                      }
                                      onClick={() =>
                                        handleRoleChange(
                                          user.id,
                                          role,
                                          !hasRole
                                        )
                                      }
                                      className={`w-full text-left px-4 py-2 text-sm ${
                                        hasRole &&
                                        role === "admin" &&
                                        user.id === currentUser.id
                                          ? "text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                                          : hasRole
                                          ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                      }`}
                                    >
                                      {hasRole ? "Remove" : "Add"} {role}
                                    </button>
                                  );
                                }
                              )}
                              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    user.id,
                                    user.status === "Active"
                                      ? "Inactive"
                                      : "Active"
                                  )
                                }
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                Set to{" "}
                                {user.status === "Active"
                                  ? "Inactive"
                                  : "Active"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {users.length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-users text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Active Users
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {users.filter((u: User) => u.status === "Active").length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-check text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  New This Month
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {
                    users.filter((u: User) => {
                      const createdDate = new Date(u.createdAt);
                      const now = new Date();
                      return (
                        createdDate.getMonth() === now.getMonth() &&
                        createdDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-plus text-xl"></i>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Add New User
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, first_name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, last_name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="foster">Foster</option>
                    <option value="interviewer">Interviewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 px-4 py-2 bg-[#4C51A4] hover:bg-[#383C80] text-white rounded-lg transition-colors"
                >
                  Add User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
