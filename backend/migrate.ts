import { readFileSync } from "node:fs";
import { pool } from "./client";

const schema = readFileSync("./backend/schema.sql", "utf-8");

async function migrate() {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		await client.query(schema);
		await client.query("COMMIT");
		console.log("✅ Migration OK");
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("❌ Migration failed");
		console.error(err);
		process.exitCode = 1;
	} finally {
		client.release();
		await pool.end();
	}
}

migrate();
