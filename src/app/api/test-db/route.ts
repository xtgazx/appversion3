import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`SELECT 1 as test`;

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}