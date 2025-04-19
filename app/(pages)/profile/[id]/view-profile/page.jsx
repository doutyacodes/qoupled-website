// "use client";

// import React, { useState, useEffect } from 'react';
// import Image from "next/image";
// import Link from "next/link";
// import { useParams } from 'next/navigation';
// import { 
//   MapPin, UserCheck, Mail, Phone, Heart, 
//   Briefcase, BookOpen, Languages, Building, 
//   Ruler, Scale, GraduationCap, Check, DollarSign 
// } from 'lucide-react';

// import { 
//   User,
//   CircleDollarSign,
//   Users,
//   Clock 
// } from "lucide-react";

// import { encryptText } from '@/utils/encryption';

// // Helper function to calculate age
// function calculateAge(birthDate) {
//   if (!birthDate) return "Not set";
//   const today = new Date();
//   const birth = new Date(birthDate);
//   let age = today.getFullYear() - birth.getFullYear();
//   const monthDiff = today.getMonth() - birth.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//     age--;
//   }
//   return `${age}`;
// }

// export default function UserProfile() {
//   const params = useParams();
//   const userId = params.id;
  
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BASE_IMAGE_URL = 'https://wowfy.in/wowfy_app_codebase/photos/';

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`/api/users/${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUserData(data.user);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     }

//     fetchUserData();
//   }, [userId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
//         <div className="text-white text-xl font-semibold">Loading profile...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
//           <p className="text-gray-700">{error}</p>
//           <Link href="/dashboard" className="block mt-4 text-center py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition">
//             Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-red-500 mb-2">User Not Found</h2>
//           <p className="text-gray-700">The user profile you're looking for doesn't exist.</p>
//           <Link href="/dashboard" className="block mt-4 text-center py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition">
//             Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Determine which verifications are active
//   const verifications = [
//     { active: userData.isProfileVerified, text: "Photo verified", color: "#87CEEB" },
//     { active: userData.isProfileVerified, text: "ID verified", color: "#6B7280" },
//     { active: userData.isEmailVerified, text: "Email verified", color: "#6B7280" },
//     { active: userData.isPhoneVerified, text: "Phone verified", color: "#008000" }
//   ];

//   // Profile information icons
//   const profileIcons = [
//     { 
//       icon: <MapPin size={24} className="text-rose-500" />, 
//       text1: "Location", 
//       text2: userData.city || "Not set" 
//     },
//     { 
//       icon: <Clock size={24} className="text-rose-500" />, 
//       text1: "Age", 
//       text2: userData.birthDate ? calculateAge(userData.birthDate) : "Not set" 
//     },
//     { 
//       icon: <Mail size={24} className="text-rose-500" />, 
//       text1: "Email", 
//       text2: userData.email || "Not set" 
//     },
//     { 
//       icon: <Phone size={24} className="text-rose-500" />, 
//       text1: "Phone", 
//       text2: userData.phone || "Not set" 
//     },
//     { 
//       icon: <User size={24} className="text-rose-500" />, 
//       text1: "Gender", 
//       text2: userData.gender || "Not set" 
//     },
//     { 
//       icon: <BookOpen size={24} className="text-rose-500" />, 
//       text1: "Religion", 
//       text2: userData.religion || "Not set" 
//     },
//     { 
//       icon: <Users size={24} className="text-rose-500" />, 
//       text1: "Caste", 
//       text2: userData.caste || "Not set" 
//     },
//     { 
//       icon: <Ruler size={24} className="text-rose-500" />, 
//       text1: "Height", 
//       text2: userData.height || "Not set" 
//     },
//     { 
//       icon: <Scale size={24} className="text-rose-500" />, 
//       text1: "Weight", 
//       text2: userData.weight || "Not set" 
//     },
//     { 
//       icon: <CircleDollarSign size={24} className="text-rose-500" />, 
//       text1: "Income", 
//       text2: userData.income || "Not set" 
//     },
//     { 
//       icon: <Users size={24} className="text-rose-500" />, 
//       text1: "Languages", 
//       text2: userData.languages?.length || "0" 
//     },
//     { 
//       icon: <BookOpen size={24} className="text-rose-500" />, 
//       text1: "Education", 
//       text2: userData.education?.length || "0" 
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500">
//       <div className="container mx-auto py-8 px-4">
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           {/* Main content container */}
//           <div className="flex flex-col lg:flex-row justify-evenly gap-10 p-6 md:p-10">
//             {/* Left side - Profile picture and name */}
//             <div className="flex flex-col gap-7 items-center w-full lg:w-1/3">
//             <div className="w-full max-w-xl">
//             <div className="w-full h-96 rounded-lg overflow-hidden shadow-md relative">
//                 <Image 
//                 src={`${BASE_IMAGE_URL}${userData.profileImageUrl}`} 
//                 fill
//                 alt={`Profile picture of ${userData.username}`}
//                 className="object-cover"
//                 />
//             </div>
//             </div>

//               <div className="text-2xl sm:text-4xl text-neutral-800 font-bold">{userData.username}</div>
              
//               {/* Basic info row */}
//               <div className="flex flex-col w-full gap-5">
//                 <div className="flex flex-row w-full justify-between text-sm md:text-lg text-neutral-500 md:font-semibold">
//                   <div>Citizenship: Indian</div>
//                   <div>Age: {userData.age || "25"}</div>
//                   <div>Gender: {userData.gender || "Female"}</div>
//                 </div>
                
//                 {/* Verifications */}
//                 <div className="flex flex-col w-full text-start gap-2">
//                   <div className="font-bold text-xl text-start text-neutral-800 hidden md:block">VERIFICATIONS</div>
//                   <div className="flex flex-wrap md:justify-between justify-center md:gap-0 gap-4 items-center">
//                     {verifications.map((item, index) => (
//                       <div key={index} className="flex flex-col items-center justify-center m-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="icon" aria-label={`${item.text} checkmark`}>
//                           <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//                           <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" fill={item.active ? item.color : "#D1D5DB"}/>
//                         </svg>
//                         <div className="text-neutral-500 text-sm hidden md:block">{item.text}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Right side - Profile details */}
//             <div className="flex flex-col md:gap-12 gap-6 w-full lg:w-3/5">
//               <div className="flex flex-col gap-12">
//                 <div className="text-2xl sm:text-3xl font-bold text-center hidden md:block text-neutral-500">MY PROFILE</div>
                
//                 {/* Profile icons grid */}
//                 <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-x-4 md:gap-y-10 gap-y-5">
//                   {profileIcons.map((item, index) => (
//                     <div key={index} className="flex flex-col items-center justify-center gap-1 md:text-sm text-xs text-neutral-500">
//                       <div className="flex items-center justify-center">
//                         {item.icon}
//                       </div>
//                       <div>{item.text1}</div>
//                       {item.text2 && <div>{item.text2}</div>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Action buttons */}
//               <div className="flex gap-4 text-white md:text-xl text-sm text-center font-semibold">
//                 <Link 
//                   href={`/compatibility-check?userId=${encodeURIComponent(encryptText(`${userId}`))}`}
//                   className="w-full bg-rose-500 hover:bg-rose-600 cursor-pointer px-3 md:py-8 py-4 rounded-xl transition"
//                 >
//                   <div>CHECK</div>
//                   <div>COMPATIBILITY</div>
//                 </Link>
//                 <Link 
//                   href={`/matches/add/${userId}`}
//                   className="w-full bg-green-500 hover:bg-green-600 cursor-pointer px-3 md:py-8 py-4 rounded-xl transition"
//                 >
//                   <div>MOVE TO</div>
//                   <div>MY MATCHES</div>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { 
  MapPin, Mail, Phone, Heart, Briefcase, 
  BookOpen, Languages, Users, Ruler, Scale, 
  GraduationCap, Check, CircleDollarSign, 
  User, Clock, Building
} from 'lucide-react';

import { encryptText } from '@/utils/encryption';
import ModernNavbar from '@/app/_components/Navbar';

// Helper function to calculate age
function calculateAge(birthDate) {
  if (!birthDate) return "Not set";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age}`;
}

export default function UserProfile() {
  const params = useParams();
  const userId = params.id;
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_IMAGE_URL = 'https://wowfy.in/wowfy_app_codebase/photos/';

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Link href="/dashboard" className="block mt-4 text-center py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-2">User Not Found</h2>
          <p className="text-gray-700">The user profile you're looking for doesn't exist.</p>
          <Link href="/dashboard" className="block mt-4 text-center py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Determine which verifications are active
  const verifications = [
    { active: userData.isProfileVerified, text: "Photo verified", color: "#87CEEB" },
    { active: userData.isProfileVerified, text: "ID verified", color: "#6B7280" },
    { active: userData.isEmailVerified, text: "Email verified", color: "#6B7280" },
    { active: userData.isPhoneVerified, text: "Phone verified", color: "#008000" }
  ];

  // Profile information icons
  const profileIcons = [
    { 
      icon: <MapPin size={22} className="text-rose-500" />, 
      text1: "Location", 
      text2: userData.city || "Not set" 
    },
    { 
      icon: <Clock size={22} className="text-rose-500" />, 
      text1: "Age", 
      text2: userData.birthDate ? calculateAge(userData.birthDate) : "Not set" 
    },
    { 
      icon: <Mail size={22} className="text-rose-500" />, 
      text1: "Email", 
      text2: userData.email || "Not set" 
    },
    { 
      icon: <Phone size={22} className="text-rose-500" />, 
      text1: "Phone", 
      text2: userData.phone || "Not set" 
    },
    { 
      icon: <User size={22} className="text-rose-500" />, 
      text1: "Gender", 
      text2: userData.gender || "Not set" 
    },
    { 
      icon: <BookOpen size={22} className="text-rose-500" />, 
      text1: "Religion", 
      text2: userData.religion || "Not set" 
    },
    { 
      icon: <Users size={22} className="text-rose-500" />, 
      text1: "Caste", 
      text2: userData.caste || "Not set" 
    },
    { 
      icon: <Ruler size={22} className="text-rose-500" />, 
      text1: "Height", 
      text2: userData.height || "Not set" 
    },
    { 
      icon: <Scale size={22} className="text-rose-500" />, 
      text1: "Weight", 
      text2: userData.weight || "Not set" 
    },
    { 
      icon: <CircleDollarSign size={22} className="text-rose-500" />, 
      text1: "Income", 
      text2: userData.income || "Not set" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500">
      <ModernNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Main content container */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 p-6 md:p-8">
            {/* Left side - Profile picture and name */}
            <div className="flex flex-col gap-6 items-center lg:w-2/5 w-full">
              {/* Large profile image */}
              <div className="w-full rounded-xl overflow-hidden shadow-lg">
                <div className="relative aspect-[4/3] w-full">
                  <Image 
                    src={`${BASE_IMAGE_URL}${userData.profileImageUrl}`} 
                    fill
                    alt={`Profile picture of ${userData.username}`}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="text-3xl text-center text-neutral-800 font-bold">{userData.username}</div>
              
              {/* Basic info row */}
              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-row w-full justify-between text-neutral-500 font-medium">
                  <div>Citizenship: Indian</div>
                  <div>Age: {userData.age || "25"}</div>
                  <div>Gender: {userData.gender || "Female"}</div>
                </div>
                
                {/* Verifications */}
                {/* <div className="flex flex-col w-full text-start gap-3">
                  <div className="font-bold text-xl text-neutral-800">VERIFICATIONS</div>
                  <div className="flex flex-wrap gap-2">
                    {verifications.map((item, index) => (
                      <div key={index} className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {item.active && <Check size={14} className="mr-1.5" />}
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div> */}
                <div className="flex flex-col w-full text-start gap-2">
                   <div className="font-bold text-xl text-start text-neutral-800 hidden md:block">VERIFICATIONS</div>
                   <div className="flex flex-wrap md:justify-between justify-center md:gap-0 gap-4 items-center">
                     {verifications.map((item, index) => (
                      <div key={index} className="flex flex-col items-center justify-center m-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="icon" aria-label={`${item.text} checkmark`}>
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" fill={item.active ? item.color : "#D1D5DB"}/>
                        </svg>
                        <div className="text-neutral-500 text-sm hidden md:block">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Profile details */}
            <div className="flex flex-col gap-8 lg:w-3/5 w-full">
              <div className="text-2xl font-bold text-neutral-700 border-b border-gray-200 pb-2">
                PROFILE DETAILS
              </div>
              
              {/* Profile icons grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {profileIcons.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1 text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      {item.icon}
                      <span className="font-medium">{item.text1}</span>
                    </div>
                    <div className="text-neutral-800 ml-7">{item.text2}</div>
                  </div>
                ))}
              </div>
              
              {/* Education section */}
              <div className="bg-gray-100 rounded-xl p-3">
                <h2 className="flex items-center text-xl font-semibold mb-4 text-neutral-700 border-b pb-2">
                  <GraduationCap size={20} className="mr-2 text-rose-500" />
                  Education
                </h2>
                {userData.education && userData.education.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.education.map((edu, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="font-medium text-lg">{edu.degree}</div>
                        <div className="text-gray-600">Graduated in {edu.graduationYear}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No education information available</p>
                )}
              </div>
              
              {/* Jobs section */}
              <div className="bg-gray-100 rounded-xl p-3">
                <h2 className="flex items-center text-xl font-semibold mb-4 text-neutral-700 border-b pb-2">
                  <Briefcase size={20} className="mr-2 text-rose-500" />
                  Work Experience
                </h2>
                {userData.jobs && userData.jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.jobs.map((job, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="font-medium text-lg">{job.company}</div>
                        <div className="text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No work experience available</p>
                )}
              </div>
              
              {/* Languages section */}
              <div className="bg-gray-100 rounded-xl p-3">
                <h2 className="flex items-center text-xl font-semibold mb-4 text-neutral-700 border-b pb-2">
                  <Languages size={20} className="mr-2 text-rose-500" />
                  Languages
                </h2>
                {userData.languages && userData.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.languages.map((language, index) => (
                      <span key={index} className="px-4 py-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No language information available</p>
                )}
              </div>

              {/* Compatibility check button */}
              <Link 
                  href={`/compatibility-check?userId=${encodeURIComponent(encryptText(`${userId}`))}`}
                  className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105 mt-4"
                >
                  <Heart size={20} />
                  Check Compatibility
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}