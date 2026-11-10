import type {
	CreateWorkspaceInvitationBody,
	InvitationPreview,
	WorkspaceInvitation,
} from "./model";

export async function getWorkspacesInvitation(
	workspaceId: string,
): Promise<WorkspaceInvitation[]> {
	const res = await fetch(`/api/workspaceinvitation/${workspaceId}`);
	if (!res.ok) throw new Error("Failed to fetch workspace members");
	return res.json();
}
export async function getWorkspacesInvitationToken(
	token: string,
): Promise<InvitationPreview> {
	const res = await fetch(`/api/workspaceinvitation/token/${token}`);
	if (!res.ok) throw new Error("Invitation invalide ou expirée");
	return res.json();
}

export async function createWorkspaceInvitation(
	workspaceId: string,
	data: CreateWorkspaceInvitationBody,
) {
	const res = await fetch(`/api/workspaceinvitation/${workspaceId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new Error("Failed to create workspace invitation");

	return res.json();
}
export async function acceptInvitation(
	token: string,
): Promise<{ workspace_id: string }> {
	const res = await fetch(`/api/workspaceinvitation/token/${token}/accept`, {
		method: "POST",
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}
