import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createProject, getProjects } from "@/modules/projects/api";
import { ProjectItem } from "./items/ProjectItem";
import { Card } from "./ui/card";

const initialData = { name: "", description: "", key: "" };

export const Projects = () => {
	const queryClient = useQueryClient();
	const [form, setForm] = useState(initialData);

	const query = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});
	const createMutation = useMutation({
		mutationFn: createProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			setForm(initialData);
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate(form);
	};

	return (
		<div>
			Projects
			<Card className="p-10 mt-4">
				<form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
					<input
						name="name"
						placeholder="Name"
						value={form.name}
						onChange={handleChange}
						required
					/>
					<input
						name="description"
						placeholder="Description"
						value={form.description}
						onChange={handleChange}
					/>
					<input
						name="key"
						placeholder="Key"
						value={form.key}
						onChange={handleChange}
						required
					/>
					<button type="submit" disabled={createMutation.isPending}>
						{createMutation.isPending ? "Creation..." : "created"}
					</button>
					{createMutation.isError && (
						<p className="text-red-400">{createMutation.error.message}</p>
					)}
				</form>
				List Projects
				{query.isPending && <p>loading...</p>}
				{query.isError && (
					<p className="text-red-400">Error : {query.error.message}</p>
				)}
				<ul>
					{query.data?.map((p) => (
						<li key={p.id}>
							{p.name} - id: {p.workspaceId}
							<ProjectItem key={p.id} project={p} />
						</li>
					))}
				</ul>
			</Card>
		</div>
	);
};
