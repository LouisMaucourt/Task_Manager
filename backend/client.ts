import postgres from "postgres";

declare global {
	var __sql: ReturnType<typeof postgres> | undefined;
}

export const sql =
	globalThis.__sql ??
	(globalThis.__sql = postgres(process.env.DATABASE_URL!, {
		max: 10,
	}));
