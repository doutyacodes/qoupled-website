"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Heart, UserCheck, MapPin, Phone, Mail, Upload, Pencil, Save, Trash2, BookOpen, Briefcase, Languages, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    birthDate: '',
    gender: '',
    phone: '',
    isPhoneVerified: false,
    email: '',
    isEmailVerified: false,
    profileImageUrl: '',
    country: '',
    state: '',
    city: '',
    religion: '',
    caste: '',
    height: '',
    weight: '',
    income: '',
    isProfileVerified: false,
    isProfileComplete: false,
    education: [],
    jobs: [],
    languages: []
  });
  
  // State for form fields
  const [formData, setFormData] = useState({...userData});
  
  // State for new items
  const [newEducation, setNewEducation] = useState({ degree: '', graduationYear: '' });
  const [newJob, setNewJob] = useState({ jobTitle: '', company: '', location: '' });
  const [newLanguage, setNewLanguage] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const BASE_IMAGE_URL = 'https://wowfy.in/wowfy_app_codebase/photos/';


  useEffect(() => {
    fetchUserProfile();
    fetchAvailableLanguages();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication failed. Please log in again.');
        return;
      }
      
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setUserData(response.data);
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableLanguages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/languages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setAvailableLanguages(response.data);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCPanel = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('coverImage', file);
    formData.append('type', 'photo');
    
    try {
      const response = await axios.post(
        'https://wowfy.in/wowfy_app_codebase/upload.php',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      if (response.data.success) {
        return response.data.filePath;
      }
      throw new Error(response.data.error);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const addEducation = () => {
    if (newEducation.degree.trim() === '') {
      toast.error('Please enter a degree');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {...newEducation}]
    }));
    
    setNewEducation({ degree: '', graduationYear: '' });
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addJob = () => {
    if (newJob.jobTitle.trim() === '') {
      toast.error('Please enter a job title');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      jobs: [...prev.jobs, {...newJob}]
    }));
    
    setNewJob({ jobTitle: '', company: '', location: '' });
  };

  const removeJob = (index) => {
    setFormData(prev => ({
      ...prev,
      jobs: prev.jobs.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage === '') {
      toast.error('Please select a language');
      return;
    }
    
    // Check if language already exists
    if (formData.languages.some(lang => lang.id === parseInt(newLanguage))) {
      toast.error('Language already added');
      return;
    }
    
    const selectedLanguage = availableLanguages.find(lang => lang.id === parseInt(newLanguage));
    
    if (selectedLanguage) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, selectedLanguage]
      }));
      
      setNewLanguage('');
    }
  };

  const removeLanguage = (id) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      let profileImagePath = null;
      if (profileImage) {
        profileImagePath = await uploadImageToCPanel(profileImage);
        if (!profileImagePath) {
          setIsLoading(false);
          return;
        }
      }
      
      const dataToSubmit = {
        ...formData,
        profileImageUrl: profileImagePath || formData.profileImageUrl
      };
      
      const response = await axios.put('/api/users/profile', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        setUserData(response.data);
        setEditMode(false);
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const verifications = [
    { status: userData.isProfileVerified, text: "Profile verified" },
    { status: userData.isPhoneVerified, text: "Phone verified" },
    { status: userData.isEmailVerified, text: "Email verified" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 px-4 py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Profile</h1>
          <p className="max-w-2xl mx-auto opacity-90">
            View and update your personal information
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header with Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-rose-500 to-red-600">
            <div className="absolute -bottom-16 md:-bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="rounded-full border-4 border-white overflow-hidden h-32 w-32 md:h-40 md:w-40 bg-gray-200">
                  {editMode ? (
                    imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : userData.profileImageUrl ? (
                      <Image 
                        src={userData.profileImageUrl} 
                        alt="Profile" 
                        width={160} 
                        height={160} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <UserCheck size={50} className="text-gray-400" />
                      </div>
                    )
                  ) : userData.profileImageUrl ? (
                    <Image 
                      src={`${BASE_IMAGE_URL}${userData.profileImageUrl}`} 
                      alt="Profile" 
                      width={160} 
                      height={160} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <UserCheck size={50} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                {editMode && (
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full cursor-pointer hover:bg-rose-600 transition-colors duration-200">
                    <Upload size={16} />
                    <input 
                      type="file" 
                      id="profile-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {!editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="absolute top-4 right-4 bg-white text-rose-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Pencil size={20} />
              </button>
            )}
          </div>
          
          <div className="pt-20 md:pt-24 px-4 md:px-8 pb-8">
            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="text-center mb-8">
                {editMode ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="text-2xl md:text-3xl font-bold text-center border-b border-gray-300 focus:border-rose-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold">{userData.username}</h2>
                )}
                
                <div className="flex justify-center mt-2 space-x-3 text-gray-600">
                  {userData.city && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {userData.city}{userData.state ? `, ${userData.state}` : ''}
                    </div>
                  )}
                  {userData.birthDate && (
                    <div>
                      {calculateAge(userData.birthDate)} years
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center flex-wrap gap-2 mt-4">
                  {verifications.map((item, index) => (
                    item.status && (
                      <div key={index} className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        <CheckCircle size={14} className="mr-1" />
                        {item.text}
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {editMode ? (
                /* code  */
              ) : (
                <div>
                  {/* View Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Personal Info Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-lg font-semibold mb-4 text-rose-600">Personal Information</h3>
                      
                      <div className="space-y-3">
                        {userData.birthDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Age:</span>
                            <span className="font-medium">{calculateAge(userData.birthDate)} years</span>
                          </div>
                        )}
                        
                        {userData.gender && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Gender:</span>
                            <span className="font-medium">{userData.gender}</span>
                          </div>
                        )}

                    {/*  some other codes like caste relogion, etc etc */}

                    </div>
                    
                    {/* Contact Info  */}

                    {/* Income  */}
                    )}
                  </div>
                  
                  {/* Education Section */}
                  )}
                  
                  {/* Job Section */}
                  {/* Languages Section */       
                  {/* Edit Profile Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                    >
                      <Pencil size={18} className="mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}