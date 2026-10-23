import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import { createBoardList, getBoardsList } from "@/modules/boardsList/api";
import type { BoardList } from "@/modules/boardsList/model";
import { getTasksByBoard } from "@/modules/tasks/api";
import type { Task } from "@/modules/tasks/model";
import { TaskItem } from "./items/TaskItem";
import { Card } from "./ui/card";

const initialData = {
	name: "",
};

export const BoardsList = () => {
	const { state } = useLocation() as { state: { board?: BoardList } | null };
	const board = state?.board;
	console.log(board);
	const { id } = useParams();
	const [form, setForm] = useState(initialData);
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["boardslist", id],
		queryFn: () => getBoardsList(id as string),
	});
	const queryTask = useQuery({
		queryKey: ["tasks", id],
		queryFn: () => getTasksByBoard(id as string),
		enabled: query.isSuccess,
	});

	const tasksByList = useMemo(() => {
		const map = new Map<string, Task[]>();
		for (const task of queryTask.data ?? []) {
			const arr = map.get(task.listId) ?? [];
			arr.push(task);
			map.set(task.listId, arr);
		}
		return map;
	}, [queryTask.data]);

	const createMutation = useMutation({
		mutationKey: ["boardslist", id],
		mutationFn: createBoardList,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["boardslist", id] });
			setForm(initialData);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		createMutation.mutate({ ...form, boardsId: id });
	};

	return (
		<Card className="p-5">
			BoardList - {board?.name}
			<Card className="p-3">
				<form onSubmit={handleSubmit}>
					<input
						placeholder="Name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
					<button type="submit" disabled={createMutation.isPending}>
						{createMutation.isPending ? "Creation..." : "Créer"}
					</button>
					{createMutation.isError && (
						<p className="text-red-400">{createMutation.error.message}</p>
					)}
				</form>
			</Card>
			{query.isError && <p>{query.error.message}</p>}
			{query.isPending && <p>Loading...</p>}
			{query.data && (
				<ul>
					{query.data && (
						<ul className="flex items-start gap-3">
							{query.data.map((list) => (
								<li
									key={list.id}
									className="flex w-64 flex-col gap-2 rounded border p-3"
								>
									<h3>
										{list.position}. {list.name}
									</h3>
									<TaskItem
										listId={list.id}
										boardId={id as string}
										tasks={tasksByList.get(list.id) ?? []}
										lists={query.data}
									/>
								</li>
							))}
						</ul>
					)}
				</ul>
			)}
		</Card>
	);
};
