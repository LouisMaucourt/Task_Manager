import type { Board, CreateBoardBody, UpdateBoardBody } from "./model";

export async function getBoards(projectId: string): Promise<Board[]> {
	const res = await fetch(`/api/boards/${projectId}`);
	if (!res.ok) throw new Error("Failed to get project");
	return res.json();
}

export async function createBoard(data: CreateBoardBody): Promise<Board> {
	const res = await fetch("/api/boards", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create project");
	return res.json();
}

export async function updateBoard({
	id,
	...body
}: UpdateBoardBody & { id: string }): Promise<Board> {
	const res = await fetch(`/api/boards/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error("Failed to change project");
	return res.json();
}

export async function deleteBoard(id: string): Promise<Board> {
	const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to erase project");
	return res.json();
}
