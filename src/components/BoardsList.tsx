import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { createBoardList, getBoardsList } from "@/modules/boardsList/api";
import { Card } from "./ui/card";

const initialData = {
	name: "",
};

export const BoardsList = () => {
	const { id } = useParams();
	const [form, setForm] = useState(initialData);
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["boardslist", id],
		queryFn: () => getBoardsList(id as string),
	});

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
		<div>
			<Card>
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
					{query.data.map((list) => (
						<li key={list.id}>{list.name}</li>
					))}
				</ul>
			)}
		</div>
	);
};
