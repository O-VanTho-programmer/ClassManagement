import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hubId = searchParams.get("hub_id");
    const classId = searchParams.get("class_id");

    if (!hubId || !classId) {
      return NextResponse.json({ message: "Missing hub_id or class_id" }, { status: 400 });
    }

    // Check permission
    const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_CLASS, hubId);
    if (permissionCheck instanceof NextResponse) {
      return permissionCheck;
    }

    // Fetch the grade weights for this class
    const [weights]: any[] = await pool.query(
      `SELECT 
        ClassId AS class_id,
        Category AS category,
        Weight AS weight
       FROM class_grade_weight
       WHERE ClassId = ?`,
      [classId]
    );

    return NextResponse.json({
      message: "Success",
      data: weights
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching class grade weights:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
