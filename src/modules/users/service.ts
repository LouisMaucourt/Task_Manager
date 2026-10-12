import { pool } from "../../../backend/client";
import type { UserModel } from "./model";

export async function getUsers(): Promise<UserModel["publicUser"][]> {
	const result = await pool.query(
		`SELECT id, firstname, lastname, email, avatar_url FROM "user"`,
	);
	return result.rows;
}
