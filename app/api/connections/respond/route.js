import { db } from '@/utils';
import { CONNECTIONS } from '@/utils/schema';
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';

export async function POST(req) {
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.userId;

  try {
    const { connectionId, status } = await req.json();

    if (!connectionId || !status || !["accepted", "rejected", "blocked"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    // First, check if the connection exists and the current user is the receiver
    const existingConnection = await db
      .select()
      .from(CONNECTIONS)
      .where(
        and(
          eq(CONNECTIONS.connectionId, connectionId),
          eq(CONNECTIONS.receiverId, userId),
          eq(CONNECTIONS.status, "pending")
        )
      );

    if (existingConnection.length === 0) {
      return NextResponse.json(
        { message: "Connection not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // Update the connection status
    await db
      .update(CONNECTIONS)
      .set({
        status: status,
        respondedAt: new Date()
      })
      .where(eq(CONNECTIONS.connectionId, connectionId));

    return NextResponse.json(
      { message: `Connection ${status} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error responding to connection invitation:", error);
    return NextResponse.json(
      { message: "Error responding to connection invitation" },
      { status: 500 }
    );
  }
}