"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "../_services/GlobalApi";
import { Heart, LogOut, UserPlus, X, User, Menu, ChevronDown, Users, Mail } from "lucide-react";

const ModernNavbar = () => {
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
              onClick={() => router.push('/my-matches')}
              className="text-white hover:text-rose-100 transition-colors"
            >
              My Matches
            </button>
            <button 
              onClick={() => router.push('/connections')}
              className="text-white hover:text-rose-100 transition-colors"
            >
              <Users className="h-4 w-4 mr-1 inline" />
              Connections
            </button>
            <button
              onClick={() => router.push('/my-invitations')}
              className="text-white bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </button>
            
            {/* Profile Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center bg-white/10 hover:bg-white/20 rounded-full py-1 px-3 transition-colors"
                >
                  <User className="h-4 w-4 text-white mr-2" />
                  {/* <span className="text-white text-sm font-medium">{user.username}</span> */}
                  <ChevronDown className="h-4 w-4 text-white ml-2" />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        router.push('/profile/my-profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
                    >
                      <User className="h-4 w-4 inline mr-2" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
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
                      {/* <p className="text-sm font-medium text-gray-800">{user.username}</p> */}
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
                href="/my-matches" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
              >
                My Matches
              </a>
              <a 
                href="/connections" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Connections
              </a>
              <a 
                href="/my-invitations" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </a>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <a 
                  href="/profile/my-profile" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </a>
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
    </>
  );
};

export default ModernNavbar;