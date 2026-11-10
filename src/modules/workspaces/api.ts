import type {
	CreateWorkspaceBody,
	UpdateWorkspaceBody,
	Workspace,
} from "./model";

export async function getWorkspaces(): Promise<Workspace[]> {
	const res = await fetch("/api/workspace");
	if (!res.ok) throw new Error("Failed to load workspaces");
	return res.json();
}

export async function createWorkspace(
	data: CreateWorkspaceBody,
): Promise<Workspace> {
	const res = await fetch("/api/workspace", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create workspace");
	return res.json();
}

export async function updateWorkspace({
	id,
	...data
}: UpdateWorkspaceBody & { id: string }): Promise<Workspace> {
	const res = await fetch(`/api/workspace/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update workspace");
	return res.json();
}

export async function deleteWorkspace(id: string): Promise<Workspace> {
	const res = await fetch(`/api/workspace/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete workspace");
	return res.json();
}
