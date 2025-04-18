"use client"
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
  const [activeTab, setActiveTab] = useState('personal');
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
    { color: userData.isProfileVerified ? "#87CEEB" : "#6B7280", text: "Profile verified" },
    { color: userData.isPhoneVerified ? "#008000" : "#6B7280", text: "Phone verified" },
    { color: userData.isEmailVerified ? "#008000" : "#6B7280", text: "Email verified" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  const profileIcons = [
    { 
      icon: <MapPin size={24} className="text-rose-500" />, 
      text1: "Location", 
      text2: userData.city || "Not set" 
    },
    { 
      icon: <UserCheck size={24} className="text-rose-500" />, 
      text1: "Age", 
      text2: userData.birthDate ? calculateAge(userData.birthDate) : "Not set" 
    },
    { 
      icon: <Mail size={24} className="text-rose-500" />, 
      text1: "Email", 
      text2: userData.email || "Not set" 
    },
    { 
      icon: <Phone size={24} className="text-rose-500" />, 
      text1: "Phone", 
      text2: userData.phone || "Not set" 
    },
    { 
      icon: <Heart size={24} className="text-rose-500" />, 
      text1: "Gender", 
      text2: userData.gender || "Not set" 
    },
    { 
      icon: <Heart size={24} className="text-rose-500" />, 
      text1: "Religion", 
      text2: userData.religion || "Not set" 
    },
    { 
      icon: <Heart size={24} className="text-rose-500" />, 
      text1: "Caste", 
      text2: userData.caste || "Not set" 
    },
    { 
      icon: <Heart size={24} className="text-rose-500" />, 
      text1: "Height", 
      text2: userData.height || "Not set" 
    },
    { 
      icon: <Heart size={24} className="text-rose-500" />, 
      text1: "Weight", 
      text2: userData.weight || "Not set" 
    },
    { 
      icon: <Briefcase size={24} className="text-rose-500" />, 
      text1: "Income", 
      text2: userData.income || "Not set" 
    },
    { 
      icon: <Languages size={24} className="text-rose-500" />, 
      text1: "Languages", 
      text2: userData.languages?.length || "0" 
    },
    { 
      icon: <BookOpen size={24} className="text-rose-500" />, 
      text1: "Education", 
      text2: userData.education?.length || "0" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Top Section with Gradient */}
          <div className="relative bg-gradient-to-r from-rose-500 to-red-600 pt-8 pb-24 px-4 md:px-8">
            <div className="text-white text-center">
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="opacity-90">View and manage your personal information</p>
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

          {/* Profile Content */}
          <div className="relative px-4 md:px-8 pb-8">
            {/* Profile Image */}
            <div className="relative -mt-20 mb-6 flex justify-center">
              <div className="relative">
                <div className="rounded-full border-4 border-white overflow-hidden h-40 w-40 bg-gray-200">
                  {editMode ? (
                    imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : userData.profileImageUrl ? (
                      <img 
                        src={`${BASE_IMAGE_URL}${userData.profileImageUrl}`} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <UserCheck size={50} className="text-gray-400" />
                      </div>
                    )
                  ) : userData.profileImageUrl ? (
                    <img 
                      src={`${BASE_IMAGE_URL}${userData.profileImageUrl}`} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <UserCheck size={50} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                {editMode && (
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full cursor-pointer hover:bg-rose-600 transition-colors">
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

            {/* User Name */}
            <div className="text-center mb-6">
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
            </div>

            {/* Verifications */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-center mb-4 text-gray-700">VERIFICATIONS</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {verifications.map((item, index) => (
                  <div key={index} className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" fill={item.color}/>
                    </svg>
                    <div className="text-neutral-500 text-sm">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b">
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'personal' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Info
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'education' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('education')}
                >
                  Education
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'career' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('career')}
                >
                  Career
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'languages' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('languages')}
                >
                  Languages
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div>
                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                        <input
                          type="text"
                          name="religion"
                          value={formData.religion}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                        <input
                          type="text"
                          name="caste"
                          value={formData.caste}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                        <input
                          type="text"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Income</label>
                        <input
                          type="text"
                          name="income"
                          value={formData.income}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-8">
                      {profileIcons.map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center text-center">
                          <div className="mb-2">{item.icon}</div>
                          <div className="text-gray-500 text-sm">{item.text1}</div>
                          <div className="font-medium">{item.text2}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <div>
                  {editMode ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Education</h3>
                      
                      {formData.education && formData.education.length > 0 ? (
                        <div className="space-y-4 mb-4">
                          {formData.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">{edu.degree}</div>
                                <div className="text-sm text-gray-500">{edu.graduationYear}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEducation(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 mb-4">No education added yet.</div>
                      )}
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Add New Education</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            placeholder="Degree / Course"
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Graduation Year"
                            value={newEducation.graduationYear}
                            onChange={(e) => setNewEducation({...newEducation, graduationYear: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addEducation}
                          className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
                        >
                          Add Education
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Education</h3>
                      
                      {userData.education && userData.education.length > 0 ? (
                        <div className="space-y-4">
                          {userData.education.map((edu, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <BookOpen className="text-rose-500 mr-3" size={24} />
                                <div>
                                  <div className="font-medium">{edu.degree}</div>
                                  <div className="text-sm text-gray-500">{edu.graduationYear}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center p-8">No education information available</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Career Tab */}
              {activeTab === 'career' && (
                <div>
                  {editMode ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Career</h3>
                      
                      {formData.jobs && formData.jobs.length > 0 ? (
                        <div className="space-y-4 mb-4">
                          {formData.jobs.map((job, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">{job.jobTitle}</div>
                                <div className="text-sm text-gray-500">{job.company}</div>
                                {job.location && <div className="text-sm text-gray-500">{job.location}</div>}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeJob(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 mb-4">No job history added yet.</div>
                      )}
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Add New Job</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={newJob.jobTitle}
                            onChange={(e) => setNewJob({...newJob, jobTitle: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Company"
                            value={newJob.company}
                            onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={newJob.location}
                            onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addJob}
                          className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
                        >
                          Add Job
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Career</h3>
                      
                      {userData.jobs && userData.jobs.length > 0 ? (
                        <div className="space-y-4">
                          {userData.jobs.map((job, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <Briefcase className="text-rose-500 mr-3" size={24} />
                                <div>
                                  <div className="font-medium">{job.jobTitle}</div>
                                  <div className="text-sm text-gray-500">{job.company}</div>
                                  {job.location && <div className="text-sm text-gray-500">{job.location}</div>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center p-8">No career information available</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Languages Tab */}
              {activeTab === 'languages' && (
                <div>
                  {editMode ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Languages</h3>
                      
                      {formData.languages && formData.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.languages.map((lang) => (
                            <div key={lang.id} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                              <span>{lang.name}</span>
                              <button
                                type="button"
                                onClick={() => removeLanguage(lang.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 mb-4">No languages added yet.</div>
                      )}
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Add New Language</h4>
                        <div className="flex gap-4">
                          <select
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:border-rose-500 focus:outline-none"
                          >
                            <option value="">Select a language</option>
                            {availableLanguages.map((lang) => (
                              <option key={lang.id} value={lang.id}>
                                {lang.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={addLanguage}
                            className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Languages</h3>
                      
                      {userData.languages && userData.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {userData.languages.map((lang) => (
                            <div key={lang.id} className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                              <Languages className="text-rose-500 mr-2" size={18} />
                              <span>{lang.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center p-8">No language information available</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {editMode ? (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({...userData});
                      setImagePreview(null);
                      setProfileImage(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                  >
                    <Pencil size={18} className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}