import { pool } from "../../../backend/client";
import type { CreateTaskBody, Task, UpdateTaskBody } from "./model";

export async function getTasksByBoard(boardId: string): Promise<Task[]> {
	const result = await pool.query(
		`SELECT t.id, t.title, COALESCE(t.description, '') AS description,
				t.position, t.priority, t.list_id AS "listId"
		 FROM tasks t
		 JOIN board_lists bl ON bl.id = t.list_id
		 WHERE bl.board_id = $1
		 ORDER BY t.position`,
		[boardId],
	);

	return result.rows;
}

export async function createTask(
	body: CreateTaskBody,
	userId: string,
): Promise<Task> {
	const result = await pool.query(
		`INSERT INTO tasks (project_id, list_id, number, title, position, created_by)
		 SELECT
			b.project_id,
			bl.id,
			(SELECT COALESCE(MAX(number), 0) + 1 FROM tasks WHERE project_id = b.project_id),
			$2,
			(SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE list_id = bl.id),
			$3
		 FROM board_lists bl
		 JOIN boards b ON b.id = bl.board_id
		 WHERE bl.id = $1
		 RETURNING id, title, COALESCE(description, '') AS description,
				   position, priority, list_id AS "listId"`,
		[body.listId, body.title, userId],
	);

	if (!result.rows[0]) throw new Error("List not found");

	return result.rows[0];
}

export async function updateTask(
	id: string,
	body: UpdateTaskBody,
): Promise<Task | null> {
	const result = await pool.query(
		`UPDATE tasks
		 SET title = COALESCE($2, title),
			 description = COALESCE($3, description),
			 priority = COALESCE($4, priority),
			 position = CASE
				WHEN $5 IS NOT NULL THEN $5
				WHEN $6 IS NOT NULL AND $6 <> list_id THEN
					(SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE list_id = $6)
				ELSE position
			 END,
			 list_id = COALESCE($6, list_id),
			 updated_at = now()
		 WHERE id = $1
		   AND (
				$6 IS NULL
				OR EXISTS (
					SELECT 1
					FROM board_lists bl
					JOIN boards b ON b.id = bl.board_id
					WHERE bl.id = $6 AND b.project_id = tasks.project_id
				)
		   )
		 RETURNING id, title, COALESCE(description, '') AS description,
				   position, priority, list_id AS "listId"`,
		[
			id,
			body.title ?? null,
			body.description ?? null,
			body.priority ?? null,
			body.position ?? null,
			body.listId ?? null,
		],
	);

	return result.rows[0] ?? null;
}

export async function deleteTask(id: string): Promise<Task | null> {
	const result = await pool.query(
		`DELETE FROM tasks
		 WHERE id = $1
		 RETURNING id, title, COALESCE(description, '') AS description,
				   position, priority, list_id AS "listId"`,
		[id],
	);

	return result.rows[0] ?? null;
}
