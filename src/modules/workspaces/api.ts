export type Workspace = {
	id: string;
	name: string;
	description: string;
};

export type CreateWorkspace = {
	name: string;
	description: string;
};

export async function getWorkspaces(): Promise<Workspace[]> {
	const res = await fetch("/api/workspace");
	if (!res.ok) throw new Error("Impossible de charger les workspaces");
	return res.json();
}

export async function createWorkspace(
	data: CreateWorkspace,
): Promise<Workspace> {
	const res = await fetch("/api/workspace", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Impossible de créer le workspace");
	return res.json();
}

export async function updateWorkspace({
	id,
	...data
}: CreateWorkspace & { id: string }): Promise<Workspace> {
	const res = await fetch(`/api/workspace/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Impossible de modifier le workspace");
	return res.json();
}
export async function deleteWorkspace(id: string): Promise<Workspace> {
	const res = await fetch(`/api/workspace/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Impossible de supprimer le workspace");
	return res.json();
}
