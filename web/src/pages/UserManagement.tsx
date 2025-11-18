import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: ['admin'],
    status: 'Active',
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    name: 'Interviewer User',
    email: 'interviewer@example.com',
    role: ['interviewer'],
    status: 'Active',
    createdAt: '2025-02-20',
  },
  {
    id: '3',
    name: 'Super Foster User',
    email: 'superfoster@example.com',
    role: ['Foster', 'Super Foster'],
    status: 'Active',
    createdAt: '2025-03-10',
  },
  {
    id: '4',
    name: 'Foster User',
    email: 'foster@example.com',
    role: ['foster'],
    status: 'Active',
    createdAt: '2025-04-05',
  },
  {
    id: '5',
    name: 'Adopter User',
    email: 'adopter@example.com',
    role: ['adopter'],
    status: 'Active',
    createdAt: '2025-11-15',
  },
];

export default function UserManagement() {
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  if (!currentUser || !currentUser.role.includes('admin')) {
    return (
      <div className="min-h-screen py-12 bg-[#FFDF4] dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-lock text-gray-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h3>
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
  let filteredUsers = mockUsers;
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredUsers = mockUsers.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }
  
  // Apply role filter
  if (filterRole !== 'all') {
    filteredUsers = mockUsers.filter(user => user.role.includes(filterRole));
  }
  
  const handleRoleChange = (userId: string, role: string, add: boolean) => {
    toast.success(`${add ? 'Added' : 'Removed'} ${role} role from user.`);
  };
  
  const handleStatusChange = (userId: string, newStatus: string) => {
    toast.success(`User status updated to ${newStatus}.`);
  };
  
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
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage users and their roles</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
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
                <option value="Admin">Admins</option>
                <option value="Interviewer">Interviewers</option>
                <option value="Super Foster">Super Fosters</option>
                <option value="Foster">Fosters</option>
                <option value="adopter">Adopters</option>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <i className="fa-solid fa-search text-gray-400 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">No users found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Try changing your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-user text-gray-500 dark:text-gray-400"></i>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {user.role.map((role) => (
                            <span 
                              key={role}
                              className={`text-xs font-medium px-2.5 py-0.5 rounded-full role-badge ${
                                role === 'Admin' ? 'role-badge-admin' :
                                role === 'Super Foster' ? 'role-badge-super-foster' :
                                role === 'Foster' ? 'role-badge-foster' :
                                role === 'Interviewer' ? 'role-badge-interviewer' :
                                'role-badge-adopter'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-[#4C51A4] hover:text-[#383C80]">
                            <i className="fa-solid fa-edit"></i>
                          </button>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <i className="fa-solid fa-user-gear"></i>
                          </button>
                          
                          {/* Role management dropdown */}
                          <div className="relative group">
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 z-50 hidden group-hover:block">
                              {['admin', 'interviewer', 'super foster', 'foster', 'adopter'].map((role) => {
                                const hasRole = user.role.includes(role);
                                return (
                                  <button
                                    key={role}
                                    disabled={hasRole && role === 'admin' && user.id === currentUser.id}
                                    onClick={() => handleRoleChange(user.id, role, !hasRole)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      hasRole && role === 'admin' && user.id === currentUser.id
                                        ? 'text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                                        : hasRole
                                          ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {hasRole ? 'Remove' : 'Add'} {role}
                                  </button>
                                );
                              })}
                              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                              <button
                                onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                Set to {user.status === 'Active' ? 'Inactive' : 'Active'}
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
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{mockUsers.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-users text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Active Users</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{mockUsers.filter(u => u.status === 'Active').length}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-check text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">New This Month</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">1</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-plus text-xl"></i>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}