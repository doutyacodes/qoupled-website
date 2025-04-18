// "use client";

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useParams, useRouter } from 'next/navigation';
// import { Heart, Calendar, MapPin, Briefcase, Languages, Users, ChevronLeft, CheckCircle } from 'lucide-react';

// export default function UserProfile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const params = useParams();
//   const router = useRouter();
//   const userId = params.id;

//   useEffect(() => {
//     async function fetchUserProfile() {
//       try {
//         const response = await fetch(`/api/users/${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }
//         const data = await response.json();
//         setUser(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (userId) {
//       fetchUserProfile();
//     }
//   }, [userId]);

//   const calculateAge = (birthDate) => {
//     const today = new Date();
//     const birth = new Date(birthDate);
//     let age = today.getFullYear() - birth.getFullYear();
//     const monthDiff = today.getMonth() - birth.getMonth();
    
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const handleCompatibilityCheck = () => {
//     router.push(`/compatibility-check?userId=${userId}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex flex-col items-center justify-center py-6 px-4">
//         <div className="w-full max-w-4xl bg-white/30 backdrop-blur-sm rounded-xl p-8 text-center">
//           <div className="animate-pulse flex flex-col items-center">
//             <div className="rounded-full bg-white/50 h-32 w-32 mb-4"></div>
//             <div className="h-6 bg-white/50 rounded w-1/2 mb-3"></div>
//             <div className="h-4 bg-white/50 rounded w-1/3 mb-6"></div>
//             <div className="h-24 bg-white/50 rounded w-full mb-6"></div>
//             <div className="h-12 bg-white/50 rounded w-2/3"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex flex-col items-center justify-center py-6 px-4">
//         <div className="w-full max-w-4xl bg-white rounded-xl p-8 text-center">
//           <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
//           <p className="text-gray-700">{error}</p>
//           <button 
//             onClick={() => router.back()}
//             className="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex flex-col items-center justify-center py-6 px-4">
//         <div className="w-full max-w-4xl bg-white rounded-xl p-8 text-center">
//           <h1 className="text-2xl font-bold text-gray-700 mb-4">User Not Found</h1>
//           <p className="text-gray-600">The user profile you're looking for doesn't exist or has been removed.</p>
//           <button 
//             onClick={() => router.back()}
//             className="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex flex-col items-center py-6 px-4">
//       {/* Header with branding */}
//       <div className="w-full max-w-4xl flex justify-between items-center mb-6">
//         <div className="flex items-center">
//           <Heart className="h-6 w-6 text-white mr-2" />
//           <span className="text-xl font-bold text-white">Qoupled</span>
//         </div>
        
//         <button 
//           onClick={() => router.back()}
//           className="flex items-center bg-white/10 hover:bg-white/20 transition-colors text-white py-1 px-3 rounded-lg text-sm"
//         >
//           <ChevronLeft className="h-4 w-4 mr-1" />
//           <span>Back</span>
//         </button>
//       </div>
      
//       {/* Profile Content */}
//       <div className="w-full max-w-4xl">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {/* Profile Header */}
//           <div className="relative h-64 md:h-80">
//             <Image
//               src={`/api/placeholder/800/320`}
//               alt={user.username}
//               className="w-full h-full object-cover"
//               width={800}
//               height={320}
//             />
            
//             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
//               <div className="flex items-end">
//                 <div className="bg-white rounded-full p-1 mr-4">
//                   <Image
//                     src={`/api/placeholder/128/128`}
//                     alt={user.username}
//                     className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
//                     width={128}
//                     height={128}
//                   />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">
//                     {user.username}, {calculateAge(user.birthDate)}
//                   </h1>
//                   {user.gender && (
//                     <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm inline-flex items-center mt-2">
//                       <Users className="h-3 w-3 mr-2" />
//                       {user.gender}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Profile Content */}
//           <div className="p-6 md:p-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Left Column */}
//               <div>
//                 <div className="mb-6">
//                   <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  
//                   <div className="space-y-4">
//                     <div className="flex items-start">
//                       <Calendar className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
//                       <div>
//                         <h3 className="font-medium text-gray-700">Birth Date</h3>
//                         <p className="text-gray-600">
//                           {new Date(user.birthDate).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                     </div>
                    
//                     {user.languages && user.languages.length > 0 && (
//                       <div className="flex items-start">
//                         <Languages className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <h3 className="font-medium text-gray-700">Languages</h3>
//                           <div className="flex flex-wrap gap-2 mt-2">
//                             {user.languages.map(lang => (
//                               <div key={lang.id} className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm">
//                                 {lang.name}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Right Column */}
//               <div>
//                 {user.occupation && (
//                   <div className="mb-6">
//                     <h2 className="text-xl font-semibold text-gray-800 mb-4">Occupation</h2>
                    
//                     <div className="space-y-4">
//                       <div className="flex items-start">
//                         <Briefcase className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <h3 className="font-medium text-gray-700">Employment</h3>
//                           <p className="text-gray-600">{user.occupation.emp_nature}</p>
//                           {user.occupation.emp_name && (
//                             <p className="text-gray-600">{user.occupation.emp_name}</p>
//                           )}
//                           <p className="text-gray-600">{user.occupation.empt_type}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <MapPin className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <h3 className="font-medium text-gray-700">Location</h3>
//                           <p className="text-gray-600">{user.occupation.place}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <div className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5">$</div>
//                         <div>
//                           <h3 className="font-medium text-gray-700">Annual Income</h3>
//                           <p className="text-gray-600">${user.occupation.annual_income.toLocaleString()}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Compatibility Check Button */}
//             <div className="mt-8 flex justify-center">
//               <button
//                 onClick={handleCompatibilityCheck}
//                 className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
//               >
//                 <CheckCircle className="h-5 w-5 mr-2" />
//                 Check Compatibility
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/profile/[id]/page.js      try {

            // app/profile/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { 
  MapPin, UserCheck, Mail, Phone, Heart, 
  Briefcase, BookOpen, Languages, Building, 
  Ruler, Scale, GraduationCap, Check, DollarSign 
} from 'lucide-react';
import { encryptText } from '@/utils/encryption';

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
      icon: <MapPin size={24} className="text-rose-500" />, 
      text1: "London,", 
      text2: userData.city ? `${userData.city}` : "Not set" 
    },
    { 
      icon: <MapPin size={24} className="text-rose-500" />, 
      text1: "Bengaluru,", 
      text2: userData.state ? `${userData.state}` : "Not set" 
    },
    { 
      icon: <Heart size={24} className="text-rose-500" />, 
      text1: userData.religion || "Hindu,", 
      text2: userData.caste || "Not set" 
    },
    { 
      icon: <Ruler size={24} className="text-rose-500" />, 
      text1: userData.height ? `${userData.height}cm` : "Not set", 
      text2: "" 
    },
    { 
      icon: <Scale size={24} className="text-rose-500" />, 
      text1: userData.weight ? `${userData.weight}Kg` : "Not set", 
      text2: "" 
    },
    { 
      icon: <Languages size={24} className="text-rose-500" />, 
      text1: "Hindi, English,", 
      text2: userData.languages?.length > 0 ? userData.languages[0] : "Not set" 
    },
    { 
      icon: <GraduationCap size={24} className="text-rose-500" />, 
      text1: userData.education?.length > 0 ? userData.education[0].degree : "B. Tech, CSE", 
      text2: "" 
    },
    { 
      icon: <Building size={24} className="text-rose-500" />, 
      text1: "IIT,", 
      text2: userData.education?.length > 0 ? userData.education[0].graduationYear : "Madras" 
    },
    { 
      icon: <Briefcase size={24} className="text-rose-500" />, 
      text1: "Software", 
      text2: userData.jobs?.length > 0 ? userData.jobs[0].jobTitle : "Engineer" 
    },
    { 
      icon: <Building size={24} className="text-rose-500" />, 
      text1: userData.jobs?.length > 0 ? userData.jobs[0].company : "Apple Inc", 
      text2: "" 
    },
    { 
      icon: <UserCheck size={24} className="text-rose-500" />, 
      text1: "6+ Years", 
      text2: "" 
    },
    { 
      icon: <DollarSign size={24} className="text-rose-500" />, 
      text1: userData.income || "85+ Lakhs", 
      text2: "" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Main content container */}
          <div className="flex flex-col lg:flex-row justify-evenly gap-10 p-6 md:p-10">
            {/* Left side - Profile picture and name */}
            <div className="flex flex-col gap-7 items-center w-full lg:w-1/3">
            <div className="w-full max-w-xl">
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md relative">
                <Image 
                src={`${BASE_IMAGE_URL}${userData.profileImageUrl}`} 
                fill
                alt={`Profile picture of ${userData.username}`}
                className="object-cover"
                />
            </div>
            </div>

              <div className="text-2xl sm:text-4xl text-neutral-800 font-bold">{userData.username}</div>
              
              {/* Basic info row */}
              <div className="flex flex-col w-full gap-5">
                <div className="flex flex-row w-full justify-between text-sm md:text-lg text-neutral-500 md:font-semibold">
                  <div>Citizenship: Indian</div>
                  <div>Age: {userData.age || "25"}</div>
                  <div>Gender: {userData.gender || "Female"}</div>
                </div>
                
                {/* Verifications */}
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
            <div className="flex flex-col md:gap-12 gap-6 w-full lg:w-3/5">
              <div className="flex flex-col gap-12">
                <div className="text-2xl sm:text-3xl font-bold text-center hidden md:block text-neutral-500">MY PROFILE</div>
                
                {/* Profile icons grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-x-4 md:gap-y-10 gap-y-5">
                  {profileIcons.map((item, index) => (
                    <div key={index} className="flex flex-col items-center justify-center gap-1 md:text-sm text-xs text-neutral-500">
                      <div className="flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>{item.text1}</div>
                      {item.text2 && <div>{item.text2}</div>}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-4 text-white md:text-xl text-sm text-center font-semibold">
                <Link 
                  href={`/compatibility-check?userId=${encodeURIComponent(encryptText(`${userId}`))}`}
                  className="w-full bg-rose-500 hover:bg-rose-600 cursor-pointer px-3 md:py-8 py-4 rounded-xl transition"
                >
                  <div>CHECK</div>
                  <div>COMPATIBILITY</div>
                </Link>
                <Link 
                  href={`/matches/add/${userId}`}
                  className="w-full bg-green-500 hover:bg-green-600 cursor-pointer px-3 md:py-8 py-4 rounded-xl transition"
                >
                  <div>MOVE TO</div>
                  <div>MY MATCHES</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}