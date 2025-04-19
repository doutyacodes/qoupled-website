// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { UserCheck, Clock, Bookmark, BookmarkCheck, MapPin, Zap, Check, Filter, Search, BadgeCheck } from 'lucide-react';
// import Image from 'next/image';
// import { calculateAge } from '@/utils/helpers';

// export default function MyMatches() {
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [savedProfiles, setSavedProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const BASE_IMAGE_URL = 'https://wowfy.in/wowfy_app_codebase/photos/';

//   useEffect(() => {
//     async function fetchMatches() {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/matches/get-compatible-matches', {
//             method: 'GET', // or 'POST' if you're sending data
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}` // if needed
//             }
//           });
//         const data = await response.json();
        
//         if (data.success) {
//           setUsers(data.matches);
          
//           // Get saved profiles from local storage
//           const saved = JSON.parse(localStorage.getItem('savedProfiles') || '[]');
//           setSavedProfiles(saved);
//         } else {
//           console.error('Failed to fetch matches:', data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchMatches();
//   }, []);

//   const toggleSaveProfile = (userId) => {
//     setSavedProfiles(prev => {
//       const newSavedProfiles = prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId];
      
//       // Save to localStorage
//       localStorage.setItem('savedProfiles', JSON.stringify(newSavedProfiles));
//       return newSavedProfiles;
//     });
//   };

//   // Filter users based on search term and tier filter
// //   const filteredUsers = users.filter(user => {
// //     const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
// //     const tierMatch = filterTier === 'all' || user.compatibilityTier === filterTier;
// //     return nameMatch && tierMatch;
// //   });

// const filteredUsers = users;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 px-4 py-12">
//         <div className="container mx-auto max-w-7xl">
//         <div className="text-center mb-8 text-white">
//             <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Matches</h1>
//             <p className="max-w-2xl mx-auto opacity-90">
//             Discover people who match with you based on our compatibility algorithm
//             </p>
//         </div>

//       {/* Search and filter controls */}
//       {/* <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="relative flex-1">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 p-2.5"
//             placeholder="Search by name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Filter className="h-5 w-5 text-gray-400" />
//           </div>
//           <select
//             className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 p-2.5"
//             value={filterTier}
//             onChange={(e) => setFilterTier(e.target.value)}
//           >
//             <option value="all">All Matches</option>
//             <option value="great">Great Matches</option>
//             <option value="good">Good Matches</option>
//             <option value="average">Average Matches</option>
//           </select>
//         </div>
//       </div> */}

//       {filteredUsers.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">            
//         {filteredUsers.map(user => (
//             <div key={user.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
//                 {/* Card header with image */}
//                 <div className="relative h-56">
//                 <Image
//                     src={`${BASE_IMAGE_URL}${user.imageUrl}`} 
//                     alt={user.username}
//                     className="w-full h-full object-cover"
//                     width={400}
//                     height={320}
//                 />
//                 <div className="absolute top-3 right-3">
//                     <button
//                     onClick={() => toggleSaveProfile(user.id)}
//                     className={`p-2 rounded-full ${
//                         savedProfiles.includes(user.id)
//                         ? 'bg-rose-500 text-white'
//                         : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white'
//                     } transition-colors`}
//                     >
//                     {savedProfiles.includes(user.id) ? (
//                         <BookmarkCheck className="h-5 w-5" />
//                     ) : (
//                         <Bookmark className="h-5 w-5" />
//                     )}
//                     </button>
//                 </div>
                
//                 {/* Match tier badge */}
//                 <div className="absolute top-3 left-3">
//                     <div className={`${
//                         user.compatibilityTier === 'great' ? 'bg-green-500' : 
//                         user.compatibilityTier === 'good' ? 'bg-blue-500' : 
//                         'bg-amber-500'
//                     } text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-md`}>
//                         <BadgeCheck className="h-3 w-3 mr-1" />
//                         {user.compatibilityTier === 'great' ? 'Perfect Match' : 
//                         user.compatibilityTier === 'good' ? 'Great Match' : 'Good Match'}
//                     </div>
//                 </div>  

//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
//                     <div className="flex items-center justify-between">
//                     <h3 className="text-xl font-semibold text-white">
//                         {user.username}, {calculateAge(user.birthDate)}
//                     </h3>
//                     {user.occupation && (
//                         <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white text-sm flex items-center">
//                         <MapPin className="h-3 w-3 mr-1" />
//                         {user.occupation.place}
//                         </div>
//                     )}
//                     </div>
//                 </div>
//                 </div>
                
//                 {/* Card content */}
//                 <div className="p-5">     
//                 {/* Action buttons */}
//                 <div className="flex space-x-3 mt-5">
//                     <button 
//                         className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
//                         onClick={() => router.push(`/profile/${user.id}`)}
//                     >
//                         <UserCheck className="h-4 w-4 mr-2" />
//                         View Profile
//                     </button>
//                     <button 
//                         className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
//                         onClick={() => router.push(`/compatibility/${user.id}`)}
//                     >
//                         <Clock className="h-4 w-4 mr-2" />
//                         Match Details
//                     </button>
//                     </div>
//                 </div>
//             </div>
//             ))}
//         </div>
//       ) : (
//         <div className="bg-gray-50 p-8 rounded-lg text-center">
//           <h3 className="text-xl font-medium text-gray-700 mb-2">No matches found</h3>
//           <p className="text-gray-500">Try adjusting your filters or check back later for new matches.</p>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Clock, Bookmark, BookmarkCheck, MapPin, BadgeCheck, Filter, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { calculateAge } from '@/utils/helpers';
import { encryptText } from '@/utils/encryption';
import ModernNavbar from '@/app/_components/Navbar';

export default function MyMatches() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    tier: 'all',
    country: 'all',
    ageRange: [18, 40],
    language: 'all',
    jobTitle: 'all',
    isVerified: false
  });

  // Available filter options (will be populated from user data)
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    languages: [],
    jobTitles: []
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const BASE_IMAGE_URL = 'https://wowfy.in/wowfy_app_codebase/photos/';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch matches
        const matchesResponse = await fetch('/api/matches/get-compatible-matches', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const matchesData = await matchesResponse.json();
        
        // Fetch languages
        const languagesResponse = await fetch('/api/common/get-languages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const languagesData = await languagesResponse.json();
        
        // Fetch job titles
        const jobTitlesResponse = await fetch('/api/common/get-job-titles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const jobTitlesData = await jobTitlesResponse.json();
        
        if (matchesData.success) {
          setUsers(matchesData.matches);
          setFilteredUsers(matchesData.matches);
          
          // Get saved profiles from local storage
          const saved = JSON.parse(localStorage.getItem('savedProfiles') || '[]');
          setSavedProfiles(saved);

          // Extract unique filter options from the fetched data
          extractFilterOptions(matchesData.matches);
          
          // Set languages from API
          if (languagesData.success) {
            setFilterOptions(prev => ({
              ...prev,
              languages: languagesData.languages.map(lang => lang.title)
            }));
          }
          
          // Set job titles from API
          if (jobTitlesData.success) {
            setFilterOptions(prev => ({
              ...prev,
              jobTitles: jobTitlesData.jobTitles.map(job => job.title)
            }));
          }
        } else {
          console.error('Failed to fetch matches:', matchesData.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Extract unique filter options from users data
  const extractFilterOptions = (userData) => {
    const countries = Array.from(new Set(userData.map(user => user.country).filter(Boolean)));

    setFilterOptions(prev => ({
      ...prev,
      countries
    }));
  };

  // Apply filters when filter state changes
  useEffect(() => {
    const applyFilters = () => {
      let result = [...users];

      // Filter by compatibility tier
      if (filters.tier !== 'all') {
        result = result.filter(user => user.compatibilityTier === filters.tier);
      }

      // Filter by country
      if (filters.country !== 'all') {
        result = result.filter(user => user.country === filters.country);
      }

      // Filter by age range
      result = result.filter(user => {
        const age = calculateAge(user.birthDate);
        return age >= filters.ageRange[0] && age <= filters.ageRange[1];
      });

      // Filter by language
      if (filters.language !== 'all') {
        result = result.filter(user => 
          user.languages && user.languages.includes(filters.language)
        );
      }
      
      // Filter by job title
      if (filters.jobTitle !== 'all') {
        result = result.filter(user => 
          user.jobTitle === filters.jobTitle
        );
      }

      // Filter by verified profiles
      if (filters.isVerified) {
        result = result.filter(user => user.isProfileVerified);
      }

      setFilteredUsers(result);
    };

    applyFilters();
  }, [filters, users]);


  const resetFilters = () => {
    setFilters({
      tier: 'all',
      country: 'all',
      ageRange: [18, 40],
      language: 'all',
      jobTitle: 'all',
      isVerified: false
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      );
    }    

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500  mt-10">
      <ModernNavbar />
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Matches</h1>
          <p className="max-w-2xl mx-auto opacity-90">
            Discover people who match with you based on our compatibility algorithm
          </p>
        </div>

  {/* Filter toggle button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white/90 hover:bg-white text-rose-500 rounded-lg font-medium shadow-md transition-all"
        >
          <Filter className="h-5 w-5 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        <div className="text-white font-medium">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'match' : 'matches'} found
        </div>
      </div>


        {/* Filters section */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-5 mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Filter Matches</h3>
              <button 
                onClick={resetFilters}
                className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Reset All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Compatibility Tier Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compatibility
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5"
                  value={filters.tier}
                  onChange={(e) => handleFilterChange('tier', e.target.value)}
                >
                  <option value="all">All Matches</option>
                  <option value="great">Perfect Matches</option>
                  <option value="good">Great Matches</option>
                  <option value="average">Good Matches</option>
                </select>
              </div>

              {/* Country Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="all">All Countries</option>
                  {filterOptions.countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5"
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  <option value="all">All Languages</option>
                  {filterOptions.languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              
              {/* Job Title Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5"
                  value={filters.jobTitle}
                  onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                >
                  <option value="all">All Occupations</option>
                  {filterOptions.jobTitles.map(job => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
              </div>

              {/* Age Range Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="18"
                    max="40"
                    value={filters.ageRange[0]}
                    onChange={(e) => handleFilterChange('ageRange', [parseInt(e.target.value), filters.ageRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="range"
                    min="18"
                    max="40"
                    value={filters.ageRange[1]}
                    onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Verified Profiles checkbox */}
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-500 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  checked={filters.isVerified}
                  onChange={(e) => handleFilterChange('isVerified', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">Verified profiles only</span>
              </label>
            </div>
          </div>
        )}

        {/* Results */}
        {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">            
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
              {/* Card header with image */}
              <div className="relative h-56">
                <Image
                  src={`${BASE_IMAGE_URL}${user.imageUrl}`} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                  width={400}
                  height={320}
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleSaveProfile(user.id)}
                    className={`p-2 rounded-full ${
                      savedProfiles.includes(user.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white'
                    } transition-colors`}
                  >
                    {savedProfiles.includes(user.id) ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Match tier badge */}
                <div className="absolute top-3 left-3">
                  <div className={`${
                    user.compatibilityTier === 'great' ? 'bg-green-500' : 
                    user.compatibilityTier === 'good' ? 'bg-blue-500' : 
                    'bg-amber-500'
                  } text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-md`}>
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    {user.compatibilityTier === 'great' ? 'Perfect Match' : 
                    user.compatibilityTier === 'good' ? 'Great Match' : 'Good Match'}
                  </div>
                </div>  

                {/* Verified badge if applicable */}
                {user.isProfileVerified && (
                  <div className="absolute top-12 left-3">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-md">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Verified
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {user.username}, {calculateAge(user.birthDate)}
                    </h3>
                    {user.city && (
                      <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white text-sm flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.city}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Card content */}
              <div className="p-5">
                {/* Additional info tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.religion && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {user.religion}
                    </span>
                  )}
                  {user.languages && user.languages.length > 0 && user.languages.map(lang => (
                    <span key={lang} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {lang}
                    </span>
                  ))}
                  {user.occupation && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {user.occupation}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 mt-3">
                  <button 
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
                    onClick={() => router.push(`/profile/${user.id}/view-profile`)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    View Profile
                  </button>
                  <button 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
                    onClick={() => router.push(`/compatibility-check?userId=${encodeURIComponent(encryptText(`${user.id}`))}`)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Check Compatibility
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
          <div className="bg-white p-8 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more potential matches.</p>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
