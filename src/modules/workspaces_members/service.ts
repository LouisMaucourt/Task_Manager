import { pool } from "../../../backend/client";
import type { CreateWorkspaceBody, WorkspaceMembers } from "./model";

export async function getWorkspacesMembers(
	workspaceId: string,
): Promise<WorkspaceMembers[]> {
	const result = await pool.query(
		`SELECT id, workspace_id as workspaceId, user_id as userId, role
		 FROM workspace_members
		 WHERE workspace_id = $1`,
		[workspaceId],
	);
	return result.rows;
}
export async function createWorkspaceMember(
	workspaceId: string,
	body: CreateWorkspaceBody,
): Promise<WorkspaceMembers> {
	const user = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [
		body.email,
	]);
	if (user.rowCount === 0) throw new Error("User not found");

	const result = await pool.query(
		`INSERT INTO workspace_members (workspace_id, user_id, role)
		 VALUES ($1, $2, $3)
		 RETURNING id, workspace_id, user_id, role`,
		[workspaceId, user.rows[0].id, body.role],
	);
	return result.rows[0];
}

// export async function updateWorkspace(
// 	id: string,
// 	body: UpdateWorkspaceBody,
// 	ownerId: string,
// ): Promise<Workspace | null> {
// 	const result = await pool.query(
// 		`UPDATE workspaces
// 		 SET name = COALESCE($2, name),
// 		     description = COALESCE($3, description),
// 		     updated_at = now()
// 		 WHERE id = $1 AND owner_id = $4
// 		 RETURNING id, name, COALESCE(description, '') AS description`,
// 		[id, body.name ?? null, body.description ?? null, ownerId],
// 	);
// 	return result.rows[0] ?? null;
// }

// export async function deleteWorkspace(
// 	id: string,
// 	ownerId: string,
// ): Promise<Workspace | null> {
// 	const result = await pool.query(
// 		`DELETE FROM workspaces
// 		 WHERE id = $1 AND owner_id = $2
// 		 RETURNING id, name, COALESCE(description, '') AS description`,
// 		[id, ownerId],
// 	);
// 	return result.rows[0] ?? null;
// }
