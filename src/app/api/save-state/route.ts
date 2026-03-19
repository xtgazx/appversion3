import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    await sql`
      INSERT INTO app_state (id, data, updated_at)
      VALUES ('default', ${JSON.stringify(body)}::jsonb, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}