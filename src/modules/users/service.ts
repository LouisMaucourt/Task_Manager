import { status } from "elysia";
import { sql } from "../../../backend/client";
import type { UserModel } from "./model";

export async function create(data: UserModel["createBody"]) {
	const existing = await sql`
		SELECT id FROM users WHERE email = ${data.email} LIMIT 1
	`;
	if (existing.length > 0) {
		throw status(409, "Email déjà utilisé");
	}
	const hashedPassword = await Bun.password.hash(data.password);

	const [user] = await sql`
		INSERT INTO users (firstname, lastname, email, password_hash, avatar_url)
		VALUES (${data.firstname}, ${data.lastname}, ${data.email}, ${hashedPassword}, ${data.avatar_url ?? null})
		RETURNING id, firstname, email
	`;

	return user;
}

export async function findAll(): Promise<UserModel["publicUser"][]> {
	return sql`
		SELECT id, firstname, lastname, email, avatar_url FROM users
	`;
}
