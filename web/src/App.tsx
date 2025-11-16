import { Routes, Route } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Home from "@/pages/Home";
import Adoptables from "@/pages/Adoptables";
import AnimalDetailPage from "@/pages/AnimalDetailPage";
import ApplyPage from "@/pages/ApplyPage";
import AdoptedPage from "@/pages/AdoptedPage";
import ContractPage from "@/pages/ContractPage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import AnimalManagement from "@/pages/AnimalManagement";
import AddAnimal from "@/pages/AddAnimal";
import ApplicationManagement from "@/pages/ApplicationManagement";
import UserManagement from "@/pages/UserManagement";
import SignContractPage from "@/pages/SignContractPage";
import ApplicationDetails from "@/pages/ApplicationDetails";
import ScheduleInterview from "@/pages/ScheduleInterview";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { useTheme } from '@/hooks/useTheme';
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AssignInterviewer from "./pages/AssignInterviewer";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string[];
    isAuthenticated: boolean;
  } | null>(null);
  
  const { isDark } = useTheme();
  
  const login = (user: {
    id: string;
    name: string;
    email: string;
    role: string[];
  }) => {
    setCurrentUser({ ...user, isAuthenticated: true });
  };
  
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout }}
    >
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/adoptables" element={<Adoptables />} />
            <Route path="/animal/:id" element={<AnimalDetailPage />} />
            <Route path="/apply/:id" element={<ApplyPage />} />
            <Route path="/adopted" element={<AdoptedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<div className="text-center text-xl py-12">About Us - Coming Soon</div>} />
            <Route path="/contact" element={<div className="text-center text-xl py-12">Contact Page - Coming Soon</div>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
             } />
              {/* Application Management Routes */}
            <Route path="/applications/detail/:id" element={
              <ProtectedRoute requiredRoles={['Interviewer', 'Admin']}>
                <ApplicationDetails />
              </ProtectedRoute>
            } />
            
             <Route path="/contract/:id" element={
               <ProtectedRoute requiredRoles={['Adopter']}>
                 <ContractPage />
               </ProtectedRoute>
             } />
             
             {/* Sign Contract Route */}
             <Route path="/sign-contract/:id" element={
               <ProtectedRoute requiredRoles={['Adopter']}>
                 <SignContractPage />
               </ProtectedRoute>
             } />
            
            <Route path="/animals/manage" element={
              <ProtectedRoute requiredRoles={['Foster', 'Super Foster', 'Admin']}>
                <AnimalManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/applications/manage" element={
              <ProtectedRoute requiredRoles={['Interviewer', 'Admin']}>
                <ApplicationManagement />
              </ProtectedRoute>
            } />
            
             <Route path="/users/manage" element={
              <ProtectedRoute requiredRoles={['Admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            {/* Assign Interviewers Route */}
            {/* <Route path="/interviewers/assign" element={
              <ProtectedRoute requiredRoles={['Admin']}>
                <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                  <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Assign Interviewers to Animals</h1>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                      <p className="text-gray-600 dark:text-gray-400">
                        Assigning interviewers functionality is currently being developed. Please check back soon!
                      </p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } /> */}
            <Route path="/interviewers/assign" element={
              <ProtectedRoute requiredRoles={['Admin']}>
                <AssignInterviewer />
              </ProtectedRoute>
            } />  
            
              {/* Add profile editing route */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                  <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Edit Profile</h1>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                      <p className="text-gray-600 dark:text-gray-400">
                        Profile editing functionality is currently being developed. Please check back soon!
                      </p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
              {/* Add Animal Management Routes */}
             <Route path="/animals/add" element={
               <ProtectedRoute requiredRoles={['Foster', 'Super Foster', 'Admin']}>
                 <AddAnimal />
               </ProtectedRoute>
             } />
            <Route path="/animals/edit/:id" element={
              <ProtectedRoute requiredRoles={['Foster', 'Super Foster', 'Admin']}>
                <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                  <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Edit Animal</h1>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                      <p className="text-gray-600 dark:text-gray-400">
                        Animal editing functionality is currently being developed. Please check back soon!
                      </p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/animals/detail/:id" element={
              <ProtectedRoute requiredRoles={['Foster', 'Super Foster', 'Admin', 'Interviewer']}>
                <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                  <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Animal Details (Internal)</h1>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                      <p className="text-gray-600 dark:text-gray-400">
                        Internal animal details functionality is currently being developed. Please check back soon!
                      </p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            {/* Interview Scheduling Route */}
            <Route path="/interviews/schedule/:id" element={
              <ProtectedRoute requiredRoles={['Interviewer', 'Admin']}>
                <ScheduleInterview />
              </ProtectedRoute>
            } />
            {/* Contract Signing Route */}
            <Route path="/contract/sign/:id" element={
              <ProtectedRoute requiredRoles={['Adopter']}>
                <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                  <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Sign Adoption Contract</h1>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                      <p className="text-gray-600 dark:text-gray-400">
                        Contract signing functionality is currently being developed. Please check back soon!
                      </p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
