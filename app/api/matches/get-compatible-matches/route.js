import { db } from '@/utils';
import { QUIZ_SEQUENCES, USER, USER_LANGUAGES, USER_OCCUPATION, LANGUAGES, MBTI_COMPATIBILITY } from '@/utils/schema';
import { NextResponse } from 'next/server';
import { eq, and, inArray, desc, asc } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';

export async function GET(req) {
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.userId;

  try {
    // Step 1: Get the current user's MBTI type from completed quiz
    const userSequence = await db
      .select({
        type_sequence: QUIZ_SEQUENCES.type_sequence,
      })
      .from(QUIZ_SEQUENCES)
      .where(
        and(
          eq(QUIZ_SEQUENCES.user_id, userId),
          eq(QUIZ_SEQUENCES.isCompleted, true),
          eq(QUIZ_SEQUENCES.quiz_id, 1) // Assuming quiz_id 1 is the MBTI test
        )
      )
      .orderBy(desc(QUIZ_SEQUENCES.createddate))
      .limit(1);

    if (userSequence.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No completed compatibility test found' },
        { status: 404 }
      );
    }

    const userMbtiType = userSequence[0].type_sequence;

    // Step 2: Get compatible MBTI types for the user's type, only great, good, average tiers
    const compatibleTypes = await db
      .select({
        compatibleType: MBTI_COMPATIBILITY.compatibleType,
        tier: MBTI_COMPATIBILITY.tier,
        match_order: MBTI_COMPATIBILITY.match_order,
      })
      .from(MBTI_COMPATIBILITY)
      .where(
        and(
          eq(MBTI_COMPATIBILITY.mbtiType, userMbtiType),
          inArray(MBTI_COMPATIBILITY.tier, ['great', 'good', 'average'])
        )
      )
      .orderBy(asc(MBTI_COMPATIBILITY.match_order));

    if (compatibleTypes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No compatibility data found' },
        { status: 404 }
      );
    }

    const compatibleMbtiTypes = compatibleTypes.map(type => type.compatibleType);

    // Step 3: Get users with those compatible MBTI types
    const compatibleUserIds = await db
      .select({
        user_id: QUIZ_SEQUENCES.user_id,
        type_sequence: QUIZ_SEQUENCES.type_sequence,
      })
      .from(QUIZ_SEQUENCES)
      .where(
        and(
          inArray(QUIZ_SEQUENCES.type_sequence, compatibleMbtiTypes),
          eq(QUIZ_SEQUENCES.isCompleted, true),
          eq(QUIZ_SEQUENCES.quiz_id, 1)
        )
      );

    if (compatibleUserIds.length === 0) {
      return NextResponse.json(
        { success: true, matches: [] },
        { status: 200 }
      );
    }

    // Get unique user IDs (in case a user has taken the test multiple times)
    const uniqueUserIds = [...new Set(compatibleUserIds.map(item => item.user_id))];
    
    // Filter out the current user
    const filteredUserIds = uniqueUserIds.filter(id => id !== userId);

    // Step 4: Get user details for these compatible users
    const userDetails = await db
      .select()
      .from(USER)
      .where(inArray(USER.id, filteredUserIds));

    // Create compatibility map
    const compatibilityMap = compatibleTypes.reduce((acc, type) => {
      acc[type.compatibleType] = {
        tier: type.tier,
        order: type.match_order,
      };
      return acc;
    }, {});

    // Step 8: Combine all data to create the response
    const matches = userDetails.map(user => {
      // Find the user's MBTI type from quiz results
      const userMbtiData = compatibleUserIds.find(item => item.user_id === user.id);
      const mbtiType = userMbtiData ? userMbtiData.type_sequence : null;
      
      // Get compatibility information
      const compatibilityInfo = mbtiType ? compatibilityMap[mbtiType] : null;
      
      const compatibilityTier = compatibilityInfo ? compatibilityInfo.tier : 'average';

      // Create a placeholder image URL
      return {
        id: user.id,
        username: user.username,
        birthDate: user.birthDate,
        gender: user.gender,
        imageUrl: user.profileImageUrl,
        compatibilityTier,
        matchOrder: compatibilityInfo?.order || 99,
      };
    });

    // Sort matches by compatibility tier (great > good > average)
    const tierOrder = { great: 1, good: 2, average: 3 };
    matches.sort((a, b) => {
    // First by tier
    const tierDiff = tierOrder[a.compatibilityTier] - tierOrder[b.compatibilityTier];
    if (tierDiff !== 0) return tierDiff;
    
    // Then by order within the same tier
    return a.matchOrder - b.matchOrder;
    });
    return NextResponse.json(
      { success: true, matches },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching compatible matches:", error);
    return NextResponse.json(
      { success: false, message: 'Error fetching compatible matches' },
      { status: 500 }
    );
  }
}