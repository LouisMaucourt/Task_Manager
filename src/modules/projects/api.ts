import type { CreateProjectBody, Project, updateProjectBody } from "./model";

export async function getProjects(): Promise<Project[]> {
	const res = await fetch("/api/projects");
	if (!res.ok) throw new Error("Failed to get project");
	return res.json();
}

export async function createProject(data: CreateProjectBody): Promise<Project> {
	const res = await fetch("/api/projects", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create project");
	return res.json();
}
export async function updateProject({
	id,
	...data
}: updateProjectBody & { id: string }): Promise<Project> {
	const res = await fetch(`/api/projects/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to change project");
	return res.json();
}
export async function deleteProject(id: string): Promise<Project> {
	const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete project");
	return res.json();
}
