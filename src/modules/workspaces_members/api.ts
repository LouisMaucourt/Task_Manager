import type { WorkspaceMembers } from "./model";

export async function getWorkspacesMembers(
	workspaceId: string,
): Promise<WorkspaceMembers[]> {
	const res = await fetch(`/api/workspacemembers/${workspaceId}`);
	if (!res.ok) throw new Error("Failed to fetch workspace members");
	return res.json();
}

export async function createWorkspaceMembers(
	workspaceId: string,
	data: WorkspaceMembers,
): Promise<WorkspaceMembers> {
	const res = await fetch(`/api/workspacemembers/${workspaceId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create workspace member");
	return res.json();
}
