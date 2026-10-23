import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createTask } from "@/modules/tasks/api";
import type { Task } from "@/modules/tasks/model";
import { TaskEditDialog } from "../dialog/TaskEditDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ListOption = { id: string; name: string };

type Props = {
	listId: string;
	boardId: string;
	tasks: Task[];
	lists: ListOption[];
};

export const TaskItem = ({ listId, boardId, tasks, lists }: Props) => {
	const queryClient = useQueryClient();
	const [title, setTitle] = useState("");

	const mutation = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
			setTitle("");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate({ title, listId });
	};

	return (
		<div className="flex flex-col gap-2">
			<ul className="flex flex-col gap-1">
				{tasks.map((task) => (
					<li
						key={task.id}
						className="flex items-center gap-2 rounded border p-2"
					>
						<span>{task.title}</span>
						<span className="text-xs opacity-60">{task.priority}</span>
						<span>{task.position}</span>
						<TaskEditDialog task={task} lists={lists} />
					</li>
				))}
			</ul>

			<form onSubmit={handleSubmit} className="flex flex-col gap-1">
				<Input
					placeholder="Nouvelle tâche"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={mutation.isPending}
					required
				/>
				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? "Création..." : "Ajouter"}
				</Button>
				{mutation.isError && (
					<p className="text-red-400">{mutation.error.message}</p>
				)}
			</form>
		</div>
	);
};
