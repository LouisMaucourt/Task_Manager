import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { createBoard, getBoards } from "@/modules/boards/api";
import type { Board } from "@/modules/boards/model";
import type { Project } from "@/modules/projects/model";
import { BoardItem } from "./items/BoardItem";

export const Boards = () => {
	const { state } = useLocation() as { state: { project?: Project } | null };
	const project = state?.project;
	console.log(project);
	const { id: projectId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const [name, setName] = useState("");

	const query = useQuery({
		queryKey: ["boards", projectId],
		queryFn: () => getBoards(projectId as string),
	});

	const createMutation = useMutation({
		mutationFn: createBoard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["boards", projectId] });
			setName("");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!projectId) return;
		createMutation.mutate({ name, projectId });
	};

	if (!projectId) return <p className="text-red-400">Missing project id</p>;

	return (
		<div>
			<h2>Boards {project?.name}</h2>

			<form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
				<input
					placeholder="Nom"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<button type="submit" disabled={createMutation.isPending}>
					{createMutation.isPending ? "Creation..." : "Created"}
				</button>
				{createMutation.isError && (
					<p className="text-red-400">{createMutation.error.message}</p>
				)}
			</form>

			{query.isPending && <p>Loading...</p>}
			{query.isError && <p className="text-red-400">{query.error.message}</p>}

			{query.data && (
				<ul className="flex flex-col gap-2">
					{query.data.map((board) => (
						<BoardItem key={board.id} board={board} />
					))}
				</ul>
			)}
		</div>
	);
};
