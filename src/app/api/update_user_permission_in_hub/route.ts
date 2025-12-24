import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    let connection;
    try {
        const { selectedPermissions, teacherId, hubId } = await req.json();

        if (!teacherId || !hubId) {
            return NextResponse.json({ message: "Missing info" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [hubRoleIdRow]: any[] = await connection.query(`
            SELECT HubRoleId FROM hub_role WHERE HubId = ? AND UserId = ?
        `, [hubId, teacherId]);

        if (hubRoleIdRow.length == 0) {
            return NextResponse.json({ message: "Teacher not found in Hub" }, { status: 400 });
        }

        const hubRoleId = hubRoleIdRow[0].HubRoleId;


        await connection.query(`
            DELETE FROM hub_permissions WHERE HubRoleId = ?
        `, [hubRoleId]);

        if (!selectedPermissions || selectedPermissions.length == 0) {
            return NextResponse.json({ message: "No permissions selected" }, { status: 400 });
        }

        const [permissionsRows]: any[] = await connection.query(`
            SELECT PermissionId FROM permissions WHERE Code IN (?)
        `, [selectedPermissions]);

        if(permissionsRows.length == 0){
            return NextResponse.json({ message: "Invalid permissions" + selectedPermissions }, { status: 400 });
        }

        const hubRoleIdWithPermissionIds = permissionsRows.map((row: any) => [hubRoleId, row.PermissionId]);

        await connection.query(`
            INSERT INTO hub_permissions (HubRoleId, PermissionId) VALUES ?
        `, [hubRoleIdWithPermissionIds]);

        await connection.commit();

        return NextResponse.json({ message: "Permissions updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating permissions:", error);
        if (connection) {
            await connection.rollback();
        }
        return NextResponse.json({ message: "Error updating permissions" }, { status: 500 });
    } finally {
        if (connection) {
            connection.release();   
        }
    }
}