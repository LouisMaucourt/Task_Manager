import { data } from "react-router";
import type { CreateTaskBody, Task, UpdateTaskBody } from "./model";

export async function getTasksByBoard(boardId: string): Promise<Task[]> {
	const res = await fetch(`/api/tasks/board/${boardId}`);
	if (!res.ok) throw new Error("Failed to get tasks");
	return res.json();
}

export async function createTask(data: CreateTaskBody): Promise<Task> {
	const res = await fetch("/api/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Impossible de créer la tâche");
	return res.json();
}

export async function updateTask({
	id,
	...data
}: UpdateTaskBody & { id: string }): Promise<Task> {
	const res = await fetch(`/api/tasks/${id}`, {
		method: "PATCH",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to change Task");
	return res.json();
}
export async function deletedTask(id: string): Promise<Task> {
	const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete Task");
	return res.json();
}
