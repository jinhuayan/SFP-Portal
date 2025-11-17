import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { mockAnimals } from '@/data/mockAnimals';
import { toast } from 'sonner';

// Mock data for interviewers
const mockInterviewers = [
  {
    id: '1',
    name: 'Interviewer User',
    email: 'interviewer@example.com',
    role: ['Interviewer'],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: ['Admin', 'Interviewer'],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Supervisor User',
    email: 'supervisor@example.com',
    role: ['Interviewer'],
    status: 'Active',
  },
];

// Mock data for animal-interviewer assignments
const mockAssignments = {
  'SFP-123': ['1'], // Max has one interviewer
  'SFP-124': ['1', '2'], // Luna has two interviewers
  // Rocky (SFP-125) has no interviewers yet
};

// Interface for assignment state
interface AssignmentState {
  [animalId: string]: string[];
}

export default function AssignInterviewer() {
  const { currentUser } = useContext(AuthContext);
  const [assignments, setAssignments] = useState<AssignmentState>(mockAssignments);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [searchAnimal, setSearchAnimal] = useState('');
  const [searchInterviewer, setSearchInterviewer] = useState('');

  // Check if user is admin
  if (!currentUser || !currentUser.role.includes('admin')) {
    return (
      <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
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
                className="bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter animals by search term
  const filteredAnimals = mockAnimals.filter(animal => 
    animal.name.toLowerCase().includes(searchAnimal.toLowerCase()) ||
    animal.uniqueId.toLowerCase().includes(searchAnimal.toLowerCase())
  );

  // Filter interviewers by search term
  const filteredInterviewers = mockInterviewers.filter(interviewer => 
    interviewer.name.toLowerCase().includes(searchInterviewer.toLowerCase()) ||
    interviewer.email.toLowerCase().includes(searchInterviewer.toLowerCase())
  );

  // Handle assignment of interviewer to animal
  const handleAssignInterviewer = (animalId: string, interviewerId: string) => {
    setAssignments(prev => {
      const currentAssignments = prev[animalId] || [];
      
      // Check if already assigned
      if (currentAssignments.includes(interviewerId)) {
        toast.info('Interviewer is already assigned to this animal');
        return prev;
      }
      
      // Create new assignment
      const updated = {
        ...prev,
        [animalId]: [...currentAssignments, interviewerId]
      };
      
      // Get animal name for notification
      const animal = mockAnimals.find(a => a.uniqueId === animalId);
      const interviewer = mockInterviewers.find(i => i.id === interviewerId);
      
      toast.success(`${interviewer?.name} has been assigned to ${animal?.name}`);
      return updated;
    });
  };

  // Handle removal of interviewer from animal
  const handleRemoveInterviewer = (animalId: string, interviewerId: string) => {
    setAssignments(prev => {
      const currentAssignments = prev[animalId] || [];
      
      // Create new assignments without the removed interviewer
      const updated = {
        ...prev,
        [animalId]: currentAssignments.filter(id => id !== interviewerId)
      };
      
      // Get names for notification
      const animal = mockAnimals.find(a => a.uniqueId === animalId);
      const interviewer = mockInterviewers.find(i => i.id === interviewerId);
      
      toast.success(`${interviewer?.name} has been removed from ${animal?.name}`);
      return updated;
    });
  };

  // Get assigned interviewers for a specific animal
  const getAssignedInterviewers = (animalId: string) => {
    const assignedIds = assignments[animalId] || [];
    return mockInterviewers.filter(interviewer => assignedIds.includes(interviewer.id));
  };

  // Get unassigned interviewers for a specific animal
  const getUnassignedInterviewers = (animalId: string) => {
    const assignedIds = assignments[animalId] || [];
    return mockInterviewers.filter(interviewer => !assignedIds.includes(interviewer.id));
  };

  return (
    <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Assign Interviewers</h1>
              <p className="text-gray-600 dark:text-gray-400">Assign and manage interviewers for animals</p>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Animals List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 lg:col-span-1"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Available Animals</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchAnimal}
                  onChange={(e) => setSearchAnimal(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredAnimals.map((animal) => (
                <motion.div
                  key={animal.uniqueId}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAnimal === animal.uniqueId 
                      ? 'border-[#4C51A4] bg-[#4C51A4]/5 dark:bg-[#4C51A4]/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => setSelectedAnimal(animal.uniqueId)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={animal.imageUrls[0]} 
                        alt={animal.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-white">{animal.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{animal.uniqueId}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        animal.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        animal.status === 'Draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
                        animal.status === 'Adopted' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {animal.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Assignments Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 lg:col-span-2"
          >
            {selectedAnimal ? (
              <>
                {/* Selected Animal Info */}
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <button 
                      onClick={() => setSelectedAnimal(null)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-4"
                      aria-label="Back"
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    {(() => {
                      const animal = mockAnimals.find(a => a.uniqueId === selectedAnimal);
                      if (!animal) return null;
                      
                      return (
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img 
                              src={animal.imageUrls[0]} 
                              alt={animal.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{animal.name}</h2>
                            <p className="text-gray-600 dark:text-gray-400">{animal.uniqueId} • {animal.species} • {animal.age}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Current Assignments */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                      Assigned Interviewers ({getAssignedInterviewers(selectedAnimal).length})
                    </h3>
                    
                    {getAssignedInterviewers(selectedAnimal).length > 0 ? (
                      <div className="space-y-3">
                        {getAssignedInterviewers(selectedAnimal).map((interviewer) => (
                          <div 
                            key={interviewer.id} 
                            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3">
                                <i className="fa-solid fa-user-tie text-[#4C51A4]"></i>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-white">{interviewer.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{interviewer.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveInterviewer(selectedAnimal, interviewer.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              aria-label={`Remove ${interviewer.name}`}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-user-tie text-gray-400 text-2xl"></i>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No Interviewers Assigned</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          This animal doesn't have any interviewers assigned yet.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Available Interviewers */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Available Interviewers
                      </h3>
                      <div className="relative w-48">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchInterviewer}
                          onChange={(e) => setSearchInterviewer(e.target.value)}
                          className="w-full px-4 py-1.5 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                        <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                      </div>
                    </div>
                    
                    {getUnassignedInterviewers(selectedAnimal).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredInterviewers
                          .filter(interviewer => getUnassignedInterviewers(selectedAnimal).some(i => i.id === interviewer.id))
                          .map((interviewer) => (
                            <div 
                              key={interviewer.id} 
                              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#4C51A4] hover:bg-[#4C51A4]/5 dark:hover:bg-[#4C51A4]/10 transition-all cursor-pointer"
                              onClick={() => handleAssignInterviewer(selectedAnimal, interviewer.id)}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3">
                                  <i className="fa-solid fa-user-tie text-[#4C51A4] text-sm"></i>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800 dark:text-white text-sm">{interviewer.name}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{interviewer.email}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignInterviewer(selectedAnimal, interviewer.id);
                                }}
                                className="text-[#4C51A4] hover:text-[#383C80] p-1 rounded-full hover:bg-[#4C51A4]/10 transition-colors"
                                aria-label={`Assign ${interviewer.name}`}
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-check-circle text-green-500 text-2xl"></i>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">All Interviewers Assigned</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          All available interviewers are already assigned to this animal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-user-tie text-gray-400 text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Select an Animal</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                  Choose an animal from the list to assign or manage interviewers. Each animal can have multiple interviewers assigned.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Animals</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{mockAnimals.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-paw text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Interviewers</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{mockInterviewers.length}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-tie text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Animals with Interviewers</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {Object.keys(assignments).filter(animalId => assignments[animalId].length > 0).length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check-circle text-xl"></i>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}