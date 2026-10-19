import { pool } from "../../../backend/client";
import type { CreateProjectBody, Project, updateProjectBody } from "./model";

export async function getDefaultWorkspaceId(
	userId: string,
): Promise<string | null> {
	const result = await pool.query(
		`SELECT workspace_id FROM workspace_members WHERE user_id = $1 LIMIT 1`,
		[userId],
	);
	return result.rows[0]?.workspace_id ?? null;
}

export async function getProject(workspaceId: string): Promise<Project[]> {
	const result = await pool.query(
		`SELECT id, name, description, key, workspace_id AS "workspaceId"
		FROM projects
		WHERE workspace_id = $1`,
		[workspaceId],
	);
	return result.rows;
}

export async function createProject(
	data: CreateProjectBody,
	workspaceId: string,
	userId: string,
): Promise<Project> {
	const result = await pool.query(
		`INSERT INTO projects (
			name,
			description,
			key,
			workspace_id,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, name, description, key,
		          workspace_id AS "workspaceId"`,
		[data.name, data.description ?? null, data.key, workspaceId, userId],
	);

	return result.rows[0];
}

export async function updateProject(
	id: string,
	body: updateProjectBody,
	workspaceId: string,
): Promise<Project | null> {
	const result = await pool.query(
		`UPDATE projects
		 SET name = COALESCE($3, name),
		     description = COALESCE($4, description),
		     key = COALESCE($5, key),
		     updated_at = now()
		 WHERE id = $1 AND workspace_id = $2
		 RETURNING id, name, description, key,
		           workspace_id AS "workspaceId"`,
		[
			id,
			workspaceId,
			body.name ?? null,
			body.description ?? null,
			body.key ?? null,
		],
	);

	return result.rows[0] ?? null;
}
export async function deleteProject(
	id: string,
	workspaceId: string,
): Promise<Project | null> {
	const result = await pool.query(
		`DELETE FROM projects
		 WHERE id = $1 AND workspace_id = $2
		 RETURNING id, name, description, key,
		           workspace_id AS "workspaceId"`,
		[id, workspaceId],
	);

	return result.rows[0] ?? null;
}
