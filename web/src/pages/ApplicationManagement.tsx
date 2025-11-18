import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

// Mock data for applications
const mockApplications = [
  {
    id: '1',
    animalId: 'SFP-123',
    animalName: 'Max',
    applicantName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '123-456-7890',
    status: 'Interview Scheduled',
    dateSubmitted: '2025-11-15',
    interviewDate: '2025-11-18',
    interviewTime: '10:00 AM',
    notes: 'Applicant has prior experience with Golden Retrievers.',
  },
  {
    id: '2',
    animalId: 'SFP-124',
    animalName: 'Luna',
    applicantName: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '234-567-8901',
    status: 'Reviewing',
    dateSubmitted: '2025-11-14',
    notes: 'Applicant lives in an apartment but has experience with cats.',
  },
  {
    id: '3',
    animalId: 'SFP-125',
    animalName: 'Rocky',
    applicantName: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '345-678-9012',
    status: 'New',
    dateSubmitted: '2025-11-16',
  },
];

export default function ApplicationManagement() {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = currentUser?.role.includes('admin');
  const isInterviewer = currentUser?.role.includes('interviewer');

  if (!currentUser || (!isAdmin && !isInterviewer)) {
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
                You do not have permission to access this page.
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
  
  // Filter applications based on status
  let filteredApplications = mockApplications;
  
  // Apply role-based filtering
  if (!isAdmin) {
    // For Interviewers, only show applications for animals assigned to them
    // In a real app, this would use actual assignment data
    filteredApplications = mockApplications.filter(app => 
      ['SFP-123', 'SFP-124'].includes(app.animalId) // Mock assignment for demo
    );
  }
  
  // Apply status filter
  if (activeTab !== 'all') {
    filteredApplications = filteredApplications.filter(app => app.status === activeTab);
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredApplications = filteredApplications.filter(app => 
      app.applicantName.toLowerCase().includes(term) || 
      app.animalName.toLowerCase().includes(term) ||
      app.animalId.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term)
    );
  }
  
  const handleStatusChange = (applicationId: string, newStatus: string) => {
    toast.success(`Application status updated to ${newStatus}`);

    // If changing to approved, simulate creating an adopter account
    if (newStatus === 'approved') {
      const app = mockApplications.find(a => a.id === applicationId);
      if (app) {
        toast.info(`Adopter account created for ${app.applicantName}. Temporary password has been sent.`);
      }
    }
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
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Application Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Review and manage adoption applications</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                className="inline-flex items-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <i className="fa-solid fa-calendar-plus mr-2"></i>
                Schedule Interview
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
                placeholder="Search applications by name, animal ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'New', label: 'New' },
                { id: 'Reviewing', label: 'Reviewing' },
                { id: 'Interview Scheduled', label: 'Interview Scheduled' },
                { id: 'Approved', label: 'Approved' },
                { id: 'Rejected', label: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#4C51A4] text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Applications List Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden"
        >
        {/* Group applications by animal */}
        {filteredApplications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-search text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">No applications found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Try changing your search or filter criteria</p>
            </div>
          </div>
        ) : (
          // Group applications by animal
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {Array.from(new Set(filteredApplications.map(app => app.animalId))).map(animalId => {
              const animalApplications = filteredApplications.filter(app => app.animalId === animalId);
              const firstApp = animalApplications[0];
              
              return (
                <div key={animalId} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3">
                        <i className="fa-solid fa-paw text-[#4C51A4]"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{firstApp.animalName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{firstApp.animalId}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {animalApplications.length} {animalApplications.length === 1 ? 'application' : 'applications'}
                    </span>
                  </div>
                  
                  {/* Applications for this animal */}
                  <div className="mt-4 space-y-3">
                    {animalApplications.map(application => (
                      <div key={application.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                              <i className="fa-solid fa-user text-gray-600 dark:text-gray-400"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{application.applicantName}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{application.email} • {application.phone}</p>
                            </div>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            application.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            application.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            application.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            application.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                          <span>Submitted: {application.dateSubmitted}</span>
                          {application.interviewDate && (
                            <span className="text-[#4C51A4] font-medium">Interview: {application.interviewDate} {application.interviewTime}</span>
                          )}
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                           <Link 
                             to={`/applications/detail/${application.id}`}
                             className="text-[#4C51A4] hover:text-[#383C80] text-sm"
                           >
                             <i className="fa-solid fa-eye mr-1"></i> View Details
                           </Link>
                           <Link 
                             to={`/interviews/schedule/${application.id}`}
                             className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                           >
                             <i className="fa-solid fa-calendar-plus mr-1"></i> Schedule Interview
                           </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
      
      {/* Notes Section */}
      {(isAdmin || isInterviewer) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4C51A4] flex items-center justify-center text-white">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">Interviewer User</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">30 minutes ago</span>
                  </div><p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Scheduled an interview with Sarah Johnson for Max (SFP-123) on November 18, 2025 at 10:00 AM.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">System</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    New application received from Michael Chen for Luna (SFP-124).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}