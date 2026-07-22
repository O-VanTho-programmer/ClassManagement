import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
  let connection: PoolConnection | undefined;

  try {
    const body = await req.json();
    const { hubId, classId, weights } = body;

    if (!hubId || !classId) {
      return NextResponse.json({ message: "Missing hubId or classId" }, { status: 400 });
    }

    if (!Array.isArray(weights)) {
      return NextResponse.json({ message: "Weights must be an array of category weights" }, { status: 400 });
    }

    // Validate weights structure and sum
    let totalWeight = 0;
    for (const w of weights) {
      if (typeof w.category !== "string" || w.category.trim() === "") {
        return NextResponse.json({ message: "Each weight item must have a valid category name" }, { status: 400 });
      }
      if (typeof w.weight !== "number" || w.weight < 0) {
        return NextResponse.json({ message: "Each weight must be a non-negative number" }, { status: 400 });
      }
      totalWeight += w.weight;
    }

    // Soft check to ensure weights total 100% if weights are defined
    if (weights.length > 0 && Math.abs(totalWeight - 100) > 0.01) {
      return NextResponse.json({ 
        message: `Total weight sum must equal 100%. Current sum: ${totalWeight}%` 
      }, { status: 400 });
    }

    // Check permission
    const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_CLASS, hubId, body);
    if (permissionCheck instanceof NextResponse) {
      return permissionCheck;
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query("DELETE FROM class_grade_weight WHERE ClassId = ?", [classId]);

    if (weights.length > 0) {
      const insertSql = "INSERT INTO class_grade_weight (ClassId, Category, Weight) VALUES (?, ?, ?)";
      for (const w of weights) {
        await connection.query(insertSql, [classId, w.category.trim(), w.weight]);
      }
    }

    await connection.commit();

    return NextResponse.json({
      message: "Class grade weights saved successfully",
      data: weights
    }, { status: 200 });

  } catch (error) {
    console.error("Error saving class grade weights:", error);
    if (connection) await connection.rollback();
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
