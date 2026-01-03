import pool from "@/lib/db";

/**
 * Server-side function to update user permissions in a hub
 * This should be used from server-side code (API routes), not from client-side
 */
export async function updateUserPermissionInHubServer(
    selectedPermissions: string[],
    teacherId: string,
    hubId: string
): Promise<void> {
    let connection;
    try {
        if (!teacherId || !hubId) {
            throw new Error("Missing teacherId or hubId");
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [hubRoleIdRow]: any[] = await connection.query(`
            SELECT HubRoleId FROM hub_role WHERE HubId = ? AND UserId = ?
        `, [hubId, teacherId]);

        if (hubRoleIdRow.length === 0) {
            throw new Error("Teacher not found in Hub");
        }

        const hubRoleId = hubRoleIdRow[0].HubRoleId;

        await connection.query(`
            DELETE FROM hub_permissions WHERE HubRoleId = ?
        `, [hubRoleId]);

        if (!selectedPermissions || selectedPermissions.length === 0) {
            await connection.commit();
            return;
        }

        const [permissionsRows]: any[] = await connection.query(`
            SELECT PermissionId FROM permissions WHERE Code IN (?)
        `, [selectedPermissions]);

        if (permissionsRows.length === 0) {
            throw new Error(`Invalid permissions: ${selectedPermissions.join(", ")}`);
        }

        const hubRoleIdWithPermissionIds = permissionsRows.map((row: any) => [hubRoleId, row.PermissionId]);

        await connection.query(`
            INSERT INTO hub_permissions (HubRoleId, PermissionId) VALUES ?
        `, [hubRoleIdWithPermissionIds]);

        await connection.commit();
    } catch (error) {
        console.error("Error updating permissions:", error);
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

