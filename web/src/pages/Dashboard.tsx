import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { mockAnimals } from '@/data/mockAnimals';
import { calculateDaysInSFP } from '@/data/mockAnimals';

// Mock data for statistics
const stats = {
  totalAnimals: 25,
  availableForAdoption: 15,
  inFosterCare: 8,
  recentlyAdopted: 2,
  pendingApplications: 7,
  interviewsScheduled: 3
};

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  
  if (!currentUser) {
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
                You need to be logged in to access this page.
              </p>
              <a 
                href="/login" 
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get recently added animals
  const recentlyAdded = mockAnimals
    .filter(animal => animal.status === 'Published')
    .sort((a, b) => new Date(b.intakeDate).getTime() - new Date(a.intakeDate).getTime())
    .slice(0, 3);
  
  // Get upcoming interviews (mock data)
  const upcomingInterviews = [
    { id: '1', animalName: 'Max', applicantName: 'Sarah Johnson', date: '2025-11-18', time: '10:00 AM' },
    { id: '2', animalName: 'Luna', applicantName: 'Michael Chen', date: '2025-11-19', time: '2:30 PM' },
    { id: '3', animalName: 'Rocky', applicantName: 'Emily Wilson', date: '2025-11-20', time: '11:00 AM' },
  ];
  
  const isAdmin = currentUser.role.includes('admin');
  const isFosterOrSuperFoster = currentUser.role.includes('foster') || currentUser.role.includes('super foster');
  const isInterviewer = currentUser.role.includes('interviewer');
  const isAdopter = currentUser.role.includes('adopter');
  
  return (
    <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {currentUser.name}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="flex -space-x-2">
                {currentUser.role.map((role, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium role-badge ${
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
            </div>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isAdmin && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Animals</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalAnimals}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-paw text-xl"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Available for Adoption</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.availableForAdoption}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-house-chimney text-xl"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">In Foster Care</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.inFosterCare}</h3>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-home text-xl"></i>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          
          {isInterviewer && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Applications</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.pendingApplications}</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-file-signature text-xl"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Interviews Scheduled</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.interviewsScheduled}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-calendar-check text-xl"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Recently Adopted</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.recentlyAdopted}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-heart text-xl"></i>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          
          {isFosterOrSuperFoster && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Animals in Your Care</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">3</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-paw text-xl"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Published Animals</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">2</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-globe text-xl"></i>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Draft Animals</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">1</h3>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-edit text-xl"></i>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          
           {isAdopter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 md:col-span-3"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Applications</h3>
              <div className="space-y-4">
                {/* Max Application */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                        <img 
                          src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Golden%20Retriever%20smiling%20in%20a%20park%2C%20sunny%20day&sign=0a8096e4ed11398eb700ce8d02b38e6b" 
                          alt="Max" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Max (SFP-123)</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Golden Retriever • Male • 2 years</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Interview Scheduled
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                    <span>Submitted: 2025-11-15</span>
                    <span className="text-[#4C51A4] font-medium">Interview: 2025-11-18 10:00 AM</span>
                  </div>
                </div>
                {/* Contract Ready Application */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                        <img 
                          src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Siamese%20cat%20with%20blue%20eyes%20sitting%20on%20a%20windowsill&sign=b6ffb648b9daa01fdc8362ee1ff460df" 
                          alt="Luna" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Luna (SFP-124)</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Siamese • Female • 1 year</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Approved - Contract Ready
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Submitted: 2025-11-10</span>
                     <a 
                       href={`/sign-contract/${mockAnimals.find(a => a.uniqueId === 'SFP-124')?.id}`} 
                       className="inline-flex items-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-1 px-3 rounded-lg transition-all duration-200 text-sm"
                     >
                      <i className="fa-solid fa-file-signature mr-1"></i> Sign Contract
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recently Added Animals */}
          {(isAdmin || isFosterOrSuperFoster) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recently Added Animals</h2>
                <a 
                  href="/animals/manage" 
                  className="text-[#4C51A4] hover:text-[#383C80] font-medium text-sm flex items-center"
                >
                  View All
                  <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                </a>
              </div>
              
              <div className="space-y-4">
                {recentlyAdded.map((animal) => (
                  <div 
                    key={animal.id} 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={animal.imageUrls[0]} 
                        alt={animal.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">{animal.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{animal.uniqueId} • {animal.breed}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          animal.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          animal.status === 'Draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {animal.status}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center mr-4">
                          <i className="fa-solid fa-calendar-days text-[#4C51A4] mr-1"></i>
                          {calculateDaysInSFP(animal.intakeDate)} days in SFP
                        </span>
                        <span className="flex items-center">
                          <i className="fa-solid fa-dollar-sign text-[#4C51A4] mr-1"></i>
                          ${animal.adoptionFee}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Upcoming Interviews */}
          {isInterviewer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Interviews</h2>
                <a 
                  href="/applications/manage" 
                  className="text-[#4C51A4] hover:text-[#383C80] font-medium text-sm flex items-center"
                >
                  View All
                  <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                </a>
              </div>
              
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div 
                    key={interview.id} 
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {interview.animalName}
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        {interview.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      With {interview.applicantName}
                    </p>
                    <div className="mt-2 text-sm font-medium text-[#4C51A4] flex items-center">
                      <i className="fa-solid fa-clock mr-1"></i>
                      {interview.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Quick Links</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isAdmin && (
                <>
                  <a 
                    href="/animals/manage" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-paw"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Manage Animals</span>
                  </a>
                  
                  <a 
                    href="/applications/manage" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-file-signature"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Applications</span>
                  </a>
                  
                   <a 
                    href="/users/manage" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Manage Users</span>
                  </a>
                   <Link 
                     to="/interviewers/assign" 
                     className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                   >
                     <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mr-3">
                       <i className="fa-solid fa-user-tie"></i>
                     </div>
                     <span className="font-medium text-gray-800 dark:text-white">Assign Interviewers</span>
                   </Link>
                </>
              )}
              
              {(isFosterOrSuperFoster) && (
                <>
                  <a 
                    href="/animals/manage" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-paw"></i>
                    </div>
                     <span className="font-medium text-gray-800 dark:text-white">Manage Animals</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-plus"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Add New</span>
                  </a>
                </>
              )}
              
              {isInterviewer && (
                <>
                  <a 
                    href="/applications/manage" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-file-signature"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Applications</span>
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-calendar-plus"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Schedule Interview</span>
                  </a>
                </>
              )}
              
              {isAdopter && (
                <>
                  <a 
                    href="#" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-file-alt"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">My Applications</span>
                  </a>
                  
                  <a 
                    href="/adoptables" 
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mr-3">
                      <i className="fa-solid fa-search"></i>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Browse Pets</span>
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}