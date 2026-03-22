import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT data
      FROM app_state
      WHERE id = ${userId}
      LIMIT 1
    `;

    return Response.json({
      success: true,
      data: result[0]?.data ?? null,
    });
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