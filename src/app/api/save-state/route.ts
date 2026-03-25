import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    const incomingUpdatedAt =
      typeof body?.updatedAt === "string" ? body.updatedAt : null;

    const existing = await sql`
      SELECT data
      FROM app_state
      WHERE id = ${userId}
      LIMIT 1
    `;

    const existingData = existing[0]?.data ?? null;
    const existingUpdatedAt =
      typeof existingData?.updatedAt === "string"
        ? existingData.updatedAt
        : null;

    if (
      existingUpdatedAt &&
      incomingUpdatedAt &&
      new Date(incomingUpdatedAt).getTime() < new Date(existingUpdatedAt).getTime()
    ) {
      return Response.json({
        success: true,
        skipped: true,
        reason: "stale_client_data",
      });
    }

    await sql`
      INSERT INTO app_state (id, data, updated_at)
      VALUES (${userId}, ${JSON.stringify(body)}::jsonb, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}