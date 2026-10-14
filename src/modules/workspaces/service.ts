import { pool } from "../../../backend/client";
import type {
	CreateWorkspaceBody,
	UpdateWorkspaceBody,
	Workspace,
} from "./model";

export async function getWorkspaces(ownerId: string): Promise<Workspace[]> {
	const result = await pool.query(
		`SELECT id, name, COALESCE(description, '') AS description
		 FROM workspaces
		 WHERE owner_id = $1`,
		[ownerId],
	);
	return result.rows;
}

export async function createWorkspace(
	body: CreateWorkspaceBody,
	ownerId: string,
): Promise<Workspace> {
	const slug = `${body.name}-${crypto.randomUUID()}`;

	const result = await pool.query(
		`INSERT INTO workspaces (name, slug, description, owner_id)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, name, COALESCE(description, '') AS description`,
		[body.name, slug, body.description, ownerId],
	);
	return result.rows[0];
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
