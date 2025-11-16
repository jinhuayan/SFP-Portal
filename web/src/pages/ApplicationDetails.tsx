import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { getAnimalById } from '@/data/mockAnimals';
import { toast } from 'sonner';

// Mock application data with complete details
const mockApplication = {
  id: '1',
  animalId: 'SFP-123',
  animalName: 'Max',
  applicantName: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '123-456-7890',
  address: '123 Main Street',
  city: 'Vancouver',
  province: 'BC',
  postalCode: 'V1V 1V1',
  householdType: 'House with Yard',
  hasChildren: true,
  childrenAges: '5, 8',
  hasOtherPets: false,
  otherPetsDetails: '',
  experienceWithPets: 'experienced',
  hoursAway: '8-10',
  reasonForAdoption: 'We are looking for a friendly dog to join our family. We have a large yard and love spending time outdoors. Max seems like the perfect fit!',
  emergencyContactName: 'Emily Johnson',
  emergencyContactPhone: '234-567-8901',
  status: 'Interview Scheduled',
  dateSubmitted: '2025-11-15',
  assignedTo: '1',
  internalNotes: 'Applicant seems well-prepared and has prior experience with Golden Retrievers. Home check scheduled for November 20.',
  interviewHistory: [
    {
      id: '1',
      date: '2025-11-18',
      time: '10:00 AM',
      interviewer: 'Interviewer User',
      notes: 'Initial meeting went well. Sarah and her family interacted well with Max.',
      type: 'In-person',
    },
  ],
};

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [application] = useState(mockApplication);
  const [status, setStatus] = useState(application.status);
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  const animal = getAnimalById(application.animalId);
  
  // Check if user has permission to view this application
  const isAdmin = currentUser?.role.includes('Admin');
  const isAssignedInterviewer = currentUser?.id === application.assignedTo;
  
  if (!isAdmin && !isAssignedInterviewer) {
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
                You do not have permission to view this application.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    toast.success(`Application status updated to ${newStatus}`);
    
    // If changing to Approved, simulate creating an adopter account
    if (newStatus === 'Approved') {
      toast.info(`Adopter account created for ${application.applicantName}. Temporary password has been sent.`);
    }
  };
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      toast.success('Note added successfully');
      setNewNote('');
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
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="Back"
            >
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Application Details</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Application #{application.id} • Submitted on {application.dateSubmitted}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applicant & Animal Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Applicant Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Applicant Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-user text-gray-500 dark:text-gray-400"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{application.applicantName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{application.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{application.phone}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                  <p className="text-gray-800 dark:text-white">{application.address}</p>
                  <p className="text-gray-800 dark:text-white">{`${application.city}, ${application.province} ${application.postalCode}`}</p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Emergency Contact</p>
                  <p className="text-gray-800 dark:text-white">{application.emergencyContactName}</p>
                  <p className="text-gray-800 dark:text-white">{application.emergencyContactPhone}</p>
                </div>
              </div>
            </div>
            
            {/* Animal Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Animal Information</h2>
              {animal ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                      <img 
                        src={animal.imageUrls[0]} 
                        alt={animal.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{animal.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{animal.uniqueId}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{`${animal.breed} • ${animal.age} • ${animal.sex}`}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Adoption Fee</p>
                    <p className="text-gray-800 dark:text-white">${animal.adoptionFee}</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                    <p className="text-gray-800 dark:text-white">{animal.location}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400">Animal information not available</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Right Column - Application Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Status & Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Application Status</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Current status: <span className={`font-medium ${
                      status === 'New' ? 'text-blue-600 dark:text-blue-400' :
                      status === 'Reviewing' ? 'text-yellow-600 dark:text-yellow-400' :
                      status === 'Interview Scheduled' ? 'text-purple-600 dark:text-purple-400' :
                      status === 'Approved' ? 'text-green-600 dark:text-green-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>{status}</span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="New">New</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => navigate(`/interviews/schedule/${application.id}`)}
                  className="inline-flex items-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <i className="fa-solid fa-calendar-plus mr-2"></i>
                  Schedule Interview
                </button>
                <button 
                  onClick={() => toast.info('Email sent to applicant')}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <i className="fa-solid fa-envelope mr-2"></i>
                  Contact Applicant
                </button>
                {(isAdmin || isAssignedInterviewer) && (
                  <button 
                    onClick={() => setShowInternalNotes(!showInternalNotes)}
                    className="inline-flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    <i className={`fa-solid mr-2 ${showInternalNotes ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    {showInternalNotes ? 'Hide Internal Notes' : 'Show Internal Notes'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Application Form Details */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Application Form Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Household Type</p>
                    <p className="text-gray-800 dark:text-white capitalize">{application.householdType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Children in Home</p>
                    <p className="text-gray-800 dark:text-white">{application.hasChildren ? 'Yes' : 'No'}</p>
                    {application.hasChildren && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ages: {application.childrenAges}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Other Pets</p>
                    <p className="text-gray-800 dark:text-white">{application.hasOtherPets ? 'Yes' : 'No'}</p>
                    {application.hasOtherPets && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{application.otherPetsDetails}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pet Experience</p>
                    <p className="text-gray-800 dark:text-white capitalize">{
                      application.experienceWithPets === 'none' ? 'No experience' :
                      application.experienceWithPets === 'limited' ? 'Limited experience' :
                      application.experienceWithPets === 'some' ? 'Some experience' :
                      application.experienceWithPets === 'experienced' ? 'Experienced' :
                      'Very experienced'
                    }</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hours Away Per Day</p>
                    <p className="text-gray-800 dark:text-white">{application.hoursAway} hours</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason for Adoption</p>
                    <p className="text-gray-800 dark:text-white">{application.reasonForAdoption}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Internal Notes */}
            {(isAdmin || isAssignedInterviewer) && showInternalNotes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Internal Notes</h2>
                {application.internalNotes && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-800 dark:text-white">{application.internalNotes}</p>
                  </div>
                )}
                
                {/* Add New Note */}
                <div className="mt-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new internal note..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    rows={3}
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className={`inline-flex items-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                        !newNote.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Add Note
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Interview History */}
            {application.interviewHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Interview History</h2>
                <div className="space-y-4">
                  {application.interviewHistory.map((interview) => (
                    <div key={interview.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {interview.type === 'In-person' ? 'In-person Interview' : 'Virtual Interview'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Interviewer: {interview.interviewer}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {interview.date} • {interview.time}
                        </span>
                      </div>
                      {interview.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-800 dark:text-white">{interview.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}