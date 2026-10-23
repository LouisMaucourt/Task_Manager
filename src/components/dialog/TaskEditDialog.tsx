import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { deletedTask, updateTask } from "@/modules/tasks/api";
import type { Task } from "@/modules/tasks/model";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type ListOption = { id: string; name: string };

export const TaskEditDialog = ({
	task,
	lists,
}: {
	task: Task;
	lists: ListOption[];
}) => {
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [form, setForm] = useState({
		title: task.title ?? "",
		description: task.description ?? "",
		listId: task.listId ?? "",
	});

	const updateMutation = useMutation({
		mutationFn: updateTask,
		onSuccess: () => {
			setEditOpen(false);
			toast.success("Task edited");
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
		onError: (error) => toast.error(error.message),
	});
	const deleteMutation = useMutation({
		mutationFn: deletedTask,
		onSuccess: () => {
			setDeleteOpen(false);
			toast.success("Task deleted");
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
		onError: (error) => toast.error(error.message),
	});

	const openEdit = () => {
		setForm({
			title: task.title ?? "",
			description: task.description ?? "",
			listId: task.listId ?? "",
		});
		setEditOpen(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateMutation.mutate({ id: task.id, ...form });
	};

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	const stop = (e: React.SyntheticEvent) => e.stopPropagation();

	return (
		<>
			<Button type="button" size="icon" variant="ghost" onClick={openEdit}>
				<Pencil size={16} />
			</Button>
			<Button
				type="button"
				aria-label="Supprimer"
				variant="ghost"
				onClick={() => setDeleteOpen(true)}
			>
				<Trash2 size={16} className="text-red-400" />
			</Button>

			{createPortal(
				<>
					<Dialog open={editOpen} onOpenChange={setEditOpen}>
						<DialogContent onPointerDown={stop} onClick={stop}>
							<DialogHeader>
								<DialogTitle>Modifier la tâche</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<Field>
									<FieldLabel>Nom</FieldLabel>
									<Input
										name="title"
										value={form.title}
										onChange={handleChange}
										disabled={updateMutation.isPending}
										required
									/>
								</Field>
								<Field>
									<FieldLabel>Description</FieldLabel>
									<Input
										name="description"
										value={form.description}
										onChange={handleChange}
										disabled={updateMutation.isPending}
									/>
								</Field>
								<Field>
									<FieldLabel>Déplacer vers</FieldLabel>
									<select
										name="listId"
										value={form.listId}
										onChange={handleChange}
										disabled={updateMutation.isPending}
										required
										className="rounded-md border p-2"
									>
										{lists.map((list) => (
											<option key={list.id} value={list.id}>
												{list.name}
											</option>
										))}
									</select>
								</Field>

								{updateMutation.isError && (
									<p className="text-red-400">{updateMutation.error.message}</p>
								)}

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={() => setEditOpen(false)}
									>
										Annuler
									</Button>
									<Button type="submit" disabled={updateMutation.isPending}>
										{updateMutation.isPending
											? "Enregistrement..."
											: "Enregistrer"}
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>

					<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
						<DialogContent onPointerDown={stop} onClick={stop}>
							<DialogHeader>
								<DialogTitle>Are you sure ?</DialogTitle>
								<DialogDescription>
									Task « {task.title} » will be definitely deleted.
								</DialogDescription>
							</DialogHeader>

							{deleteMutation.isError && (
								<p className="text-red-400">{deleteMutation.error.message}</p>
							)}

							<DialogFooter>
								<Button variant="outline" onClick={() => setDeleteOpen(false)}>
									Annuler
								</Button>
								<Button
									variant="destructive"
									disabled={deleteMutation.isPending}
									onClick={() => deleteMutation.mutate(task.id)}
								>
									{deleteMutation.isPending ? "Suppression..." : "Supprimer"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</>,
				document.body,
			)}
		</>
	);
};
