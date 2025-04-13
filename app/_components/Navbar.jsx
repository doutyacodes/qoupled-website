"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "../_services/GlobalApi";
import { Heart, LogOut, UserPlus, X, User, Search, AlertCircle, CheckCircle, Menu } from "lucide-react";

const ModernNavbar = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupleId, setCoupleId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Assuming you have an API to fetch user data
          // const userData = await GlobalApi.GetUserProfile(token);
          // setUser(userData.data);
          
          // Placeholder for demonstration
          setUser({ username: "John" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCoupleId("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = async () => {
    if (!coupleId) {
      setErrorMessage("Please enter a valid couple ID");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("User not authenticated, please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await GlobalApi.AddCoupleRequest(coupleId, token);
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred while adding the couple.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="w-full flex justify-center py-4 fixed top-0 z-50 bg-gradient-to-r from-rose-500 to-red-600 shadow-md">
        <div className="max-w-7xl w-full flex justify-between items-center px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-white mr-2" />
            <span className="text-xl font-bold text-white">Qoupled</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => router.push('/tests')}
              className="text-white hover:text-rose-100 transition-colors"
            >
              Tests
            </button>
            <button 
              onClick={() => router.push('/matches')}
              className="text-white hover:text-rose-100 transition-colors"
            >
              Matches
            </button>
            <button
              onClick={openModal}
              className="text-white bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Couple
            </button>
            {user && (
              <div className="flex items-center bg-white/10 rounded-full py-1 px-3">
                <User className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">{user.username}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="text-white hover:text-rose-100 transition-colors flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleMobileMenu}></div>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform ease-in-out duration-300">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-rose-500 mr-2" />
                <span className="font-bold">Qoupled</span>
              </div>
              <button onClick={toggleMobileMenu} className="text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Mobile menu items */}
            <div className="py-2">
              {user && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-rose-100 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.username}</p>
                      <p className="text-xs text-gray-500">Manage your profile</p>
                    </div>
                  </div>
                </div>
              )}
              
              <a 
                href="/tests" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
              >
                Tests
              </a>
              <a 
                href="/matches" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
              >
                Matches
              </a>
              <button 
                onClick={openModal}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Couple
              </button>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Couple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999999] px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-red-600 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Couple
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couple ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent pr-10"
                    placeholder="Enter the couple's ID"
                    value={coupleId}
                    onChange={(e) => setCoupleId(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the ID of the person you want to connect with
                </p>
              </div>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Couple
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavbar;