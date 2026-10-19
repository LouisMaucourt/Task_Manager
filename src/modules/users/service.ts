import { pool } from "../../../backend/client";
import type { CreateProjectBody, Project } from "../projects/model";
import type { UserModel } from "./model";

export async function getUsers(): Promise<UserModel["publicUser"][]> {
	const result = await pool.query(
		`SELECT id, firstname, lastname, email, avatar_url FROM "user"`,
	);
	return result.rows;
}

export async function createWorkspace(
	body: CreateProjectBody,
	ownerId: string,
): Promise<Project> {
	const slug = `${body.name}-${crypto.randomUUID()}`;

	const result = await pool.query(
		`INSERT INTO workspaces (name, description, key, workspace_id)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, name, COALESCE(description, '') AS description`,
		[body.name, slug, body.description, ownerId],
	);
	return result.rows[0];
}