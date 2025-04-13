// File: /app/api/compatibility-matches/route.js
import { db } from '@/utils';
import { COMPATIBILITY_RESULTS, USER, USER_DETAILS } from '@/utils/schema';
import { NextResponse } from 'next/server';
import { and, eq, gte } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';

export async function GET(req) {
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.userId;
  const testId = 2; // Compatibility test ID
  
  // Get parameters from query string
  const url = new URL(req.url);
  const minCompatibility = parseInt(url.searchParams.get('minCompatibility') || '50');
  const maxResults = parseInt(url.searchParams.get('limit') || '100');
  const compatibleOnly = url.searchParams.get('compatibleOnly') === 'true';
  
  try {
    // Get compatibility results where this user is either user_1 or user_2
    const resultsAsUser1 = await db
      .select({
        matchUserId: COMPATIBILITY_RESULTS.user_2_id,
        score: COMPATIBILITY_RESULTS.compatibilityScore
      })
      .from(COMPATIBILITY_RESULTS)
      .where(
        and(
          eq(COMPATIBILITY_RESULTS.test_id, testId),
          eq(COMPATIBILITY_RESULTS.user_1_id, userId),
          gte(COMPATIBILITY_RESULTS.compatibilityScore, minCompatibility)
        )
      )
      .execute();
      
    const resultsAsUser2 = await db
      .select({
        matchUserId: COMPATIBILITY_RESULTS.user_1_id,
        score: COMPATIBILITY_RESULTS.compatibilityScore
      })
      .from(COMPATIBILITY_RESULTS)
      .where(
        and(
          eq(COMPATIBILITY_RESULTS.test_id, testId),
          eq(COMPATIBILITY_RESULTS.user_2_id, userId),
          gte(COMPATIBILITY_RESULTS.compatibilityScore, minCompatibility)
        )
      )
      .execute();
      
    // Combine results
    const allResults = [...resultsAsUser1, ...resultsAsUser2];
    
    // Get user details for all matched users
    const matchedUserIds = allResults.map(result => result.matchUserId);
    
    let matchedUsers = [];
    
    if (matchedUserIds.length > 0) {
      // First get basic user info
      const userBasicDetails = await db
        .select({
          id: USER.id,
          username: USER.username,
          gender: USER.gender,
          birthDate: USER.birthDate
        })
        .from(USER)
        .where(
          USER.id.in(matchedUserIds)
        )
        .execute();
      
      // Then get extended user details
      const userExtendedDetails = await db
        .select({
          id: USER_DETAILS.id,
          location: USER_DETAILS.location,
          education: USER_DETAILS.education,
          religion: USER_DETAILS.religion
        })
        .from(USER_DETAILS)
        .where(
          USER_DETAILS.id.in(matchedUserIds)
        )
        .execute();
      
      // Join user details with compatibility scores
      matchedUsers = userBasicDetails.map(basicInfo => {
        const matchResult = allResults.find(r => r.matchUserId === basicInfo.id);
        const extendedInfo = userExtendedDetails.find(d => d.id === basicInfo.id) || {};
        
        // Calculate age
        const now = new Date();
        const birthDate = new Date(basicInfo.birthDate);
        const age = now.getFullYear() - birthDate.getFullYear() - 
                   (now.getMonth() < birthDate.getMonth() || 
                   (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate()) ? 1 : 0);
        
        // Determine if compatible (example logic - customize based on your needs)
        // For demo purposes, we're considering matches with >75% score as "Qoupled Compatible"
        const isCompatible = matchResult.score > 75;
        
        // Mock interests (in a real app, you'd fetch these from a database)
        const interests = ['Reading', 'Travel', 'Music', 'Sports', 'Art', 'Cooking', 'Gaming', 'Hiking']
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 5) + 1);
        
        return {
          id: basicInfo.id,
          name: basicInfo.username,
          gender: basicInfo.gender,
          age: age,
          location: extendedInfo.location || "Unknown",
          interests: interests,
          compatibility: matchResult.score,
          isCompatible: isCompatible,
          // Add a placeholder image - in a real app, you'd use actual user photos
          imageUrl: `https://randomuser.me/api/portraits/${basicInfo.gender?.toLowerCase() === 'female' ? 'women' : 'men'}/${basicInfo.id % 99 || 1}.jpg`
        };
      });
      
      // Apply compatibility filter if requested
      if (compatibleOnly) {
        matchedUsers = matchedUsers.filter(user => user.isCompatible);
      }
      
      // Sort by compatibility score (descending)
      matchedUsers.sort((a, b) => b.compatibility - a.compatibility);
      
      // Limit results
      matchedUsers = matchedUsers.slice(0, maxResults);
    }
    
    return NextResponse.json({
      matchedUsers: matchedUsers,
      totalMatches: matchedUsers.length
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching compatibility matches:", error);
    return NextResponse.json({ 
      message: 'Error fetching compatibility matches',
      error: error.message
    }, { status: 500 });
  }
}