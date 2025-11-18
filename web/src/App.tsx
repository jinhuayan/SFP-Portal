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
import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AssignInterviewer from "./pages/AssignInterviewer";
import { getUserFromCookie, deleteCookie } from "@/lib/cookies";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string[];
    token?: string;
    isAuthenticated: boolean;
  } | null>(null);

  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Restore session from cookie on app initialization
  useEffect(() => {
    console.log("App mounting - checking for cookies...");
    console.log("All cookies:", document.cookie);

    const user = getUserFromCookie();
    console.log("👤 User from cookie:", user);

    if (user) {
      setCurrentUser(user);
    } else {
      console.log("❌ No user session found in cookies");
    }

    // Mark session loading as complete
    setIsLoadingSession(false);
  }, []);

  const login = (user: {
    id: string;
    name: string;
    email: string;
    role: string[];
    token?: string;
  }) => {
    const userWithAuth = { ...user, isAuthenticated: true };
    setCurrentUser(userWithAuth);
    // No need to manually set cookie - backend sets it via Set-Cookie header
  };

  const logout = async () => {
    try {
      // Call logout API to clear httpOnly cookie
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies in request
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    // Clear client-side state and cookies
    setCurrentUser(null);
    deleteCookie("user_info");
    deleteCookie("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, isLoadingSession }}
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
            <Route
              path="/about"
              element={
                <div className="text-center text-xl py-12">
                  About Us - Coming Soon
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <div className="text-center text-xl py-12">
                  Contact Page - Coming Soon
                </div>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Application Management Routes */}
            <Route
              path="/applications/detail/:id"
              element={
                <ProtectedRoute requiredRoles={["interviewer", "admin"]}>
                  <ApplicationDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/contract/:id"
              element={
                <ProtectedRoute requiredRoles={["adopter"]}>
                  <ContractPage />
                </ProtectedRoute>
              }
            />

            {/* Sign Contract Route */}
            <Route
              path="/sign-contract/:id"
              element={
                <ProtectedRoute requiredRoles={["adopter"]}>
                  <SignContractPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/animals/manage"
              element={
                <ProtectedRoute
                  requiredRoles={["foster", "super foster", "admin"]}
                >
                  <AnimalManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/applications/manage"
              element={
                <ProtectedRoute requiredRoles={["interviewer", "admin"]}>
                  <ApplicationManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule-interview"
              element={
                <ProtectedRoute requiredRoles={["admin", "interviewer"]}>
                  <ScheduleInterview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule-interview/:id"
              element={
                <ProtectedRoute requiredRoles={["admin", "interviewer"]}>
                  <ScheduleInterview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/manage"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            {/* Assign Interviewers Route */}
            <Route
              path="/interviewers/assign"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AssignInterviewer />
                </ProtectedRoute>
              }
            />

            {/* Add profile editing route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                        Edit Profile
                      </h1>
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                        <p className="text-gray-600 dark:text-gray-400">
                          Profile editing functionality is currently being
                          developed. Please check back soon!
                        </p>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            {/* Add Animal Management Routes */}
            <Route
              path="/animals/add"
              element={
                <ProtectedRoute
                  requiredRoles={["foster", "super foster", "admin"]}
                >
                  <AddAnimal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/animals/edit/:id"
              element={
                <ProtectedRoute
                  requiredRoles={["foster", "super foster", "admin"]}
                >
                  <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                        Edit Animal
                      </h1>
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                        <p className="text-gray-600 dark:text-gray-400">
                          Animal editing functionality is currently being
                          developed. Please check back soon!
                        </p>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/animals/detail/:id"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "foster",
                    "super foster",
                    "admin",
                    "interviewer",
                  ]}
                >
                  <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                        Animal Details (Internal)
                      </h1>
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                        <p className="text-gray-600 dark:text-gray-400">
                          Internal animal details functionality is currently
                          being developed. Please check back soon!
                        </p>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            {/* Interview Scheduling Route */}
            <Route
              path="/interviews/schedule/:id"
              element={
                <ProtectedRoute requiredRoles={["interviewer", "admin"]}>
                  <ScheduleInterview />
                </ProtectedRoute>
              }
            />
            {/* Contract Signing Route */}
            <Route
              path="/contract/sign/:id"
              element={
                <ProtectedRoute requiredRoles={["adopter"]}>
                  <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                        Sign Adoption Contract
                      </h1>
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                        <p className="text-gray-600 dark:text-gray-400">
                          Contract signing functionality is currently being
                          developed. Please check back soon!
                        </p>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
