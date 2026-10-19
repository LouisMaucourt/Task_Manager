import type { BoardList, CreateBoardListBody } from "./model";

export async function getBoardsList(boardListId: string): Promise<BoardList[]> {
	const res = await fetch(`/api/boardslist/${boardListId}`);
	if (!res.ok) throw new Error("Failed to get project");
	return res.json();
}
export async function createBoardList(
	data: CreateBoardListBody,
): Promise<BoardList> {
	const res = await fetch("/api/boardslist", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create project");
	return res.json();
}
