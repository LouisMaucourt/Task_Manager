import { pool } from "../../../backend/client";
import type {
	CreateWorkspaceBody,
	UpdateWorkspaceBody,
	Workspace,
} from "./model";

export async function getWorkspaces(userId: string): Promise<Workspace[]> {
	const result = await pool.query(
		`SELECT w.id, w.name, COALESCE(w.description, '') AS description
		 FROM workspaces w
		 JOIN workspace_members wm ON wm.workspace_id = w.id
		 WHERE wm.user_id = $1
		 ORDER BY w.name`,
		[userId],
	);
	return result.rows;
}
export async function createWorkspace(
	body: CreateWorkspaceBody,
	ownerId: string,
): Promise<Workspace> {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		const slug = `${body.name}-${crypto.randomUUID()}`;
		const result = await client.query(
			`INSERT INTO workspaces (name, slug, description, owner_id)
			 VALUES ($1, $2, $3, $4)
			 RETURNING id, name, COALESCE(description, '') AS description`,
			[body.name, slug, body.description, ownerId],
		);

		const workspace = result.rows[0];

		await client.query(
			`INSERT INTO workspace_members (workspace_id, user_id, role)
			 VALUES ($1, $2, 'owner')`,
			[workspace.id, ownerId],
		);

		await client.query("COMMIT");

		return workspace;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
}

export async function updateWorkspace(
	id: string,
	body: UpdateWorkspaceBody,
	ownerId: string,
): Promise<Workspace | null> {
	const result = await pool.query(
		`UPDATE workspaces
		 SET name = COALESCE($2, name),
		     description = COALESCE($3, description),
		     updated_at = now()
		 WHERE id = $1 AND owner_id = $4
		 RETURNING id, name, COALESCE(description, '') AS description`,
		[id, body.name ?? null, body.description ?? null, ownerId],
	);
	return result.rows[0] ?? null;
}

export async function deleteWorkspace(
	id: string,
	ownerId: string,
): Promise<Workspace | null> {
	const result = await pool.query(
		`DELETE FROM workspaces
		 WHERE id = $1 AND owner_id = $2
		 RETURNING id, name, COALESCE(description, '') AS description`,
		[id, ownerId],
	);
	return result.rows[0] ?? null;
}
