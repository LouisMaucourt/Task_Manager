import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { deleteBoard, updateBoard } from "@/modules/boards/api";
import type { Board } from "@/modules/boards/model";
import { Button } from "../ui/button";

export const BoardItem = ({ board }: { board: Board }) => {
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [name, setName] = useState(board.name);

	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: ["boards", board.projectId] });

	const updateMutation = useMutation({
		mutationFn: updateBoard,
		onSuccess: () => {
			setEditOpen(false);
			toast.success("Board edited");
			refresh();
		},
		onError: (error) => toast.error(error.message),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteBoard,
		onSuccess: () => {
			setDeleteOpen(false);
			toast.success("Board deleted");
			refresh();
		},
		onError: (error) => toast.error(error.message),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		updateMutation.mutate({ id: board.id, name });
	}

	return (
		<li className="flex items-center gap-2">
			<Link to={`boards/${board.id}`}>
				{board.name} - {board.position + 1}
			</Link>
			<Dialog
				open={editOpen}
				onOpenChange={(open) => {
					setEditOpen(open);
					if (open) setName(board.name);
				}}
			>
				<DialogTrigger asChild>
					<button type="button" aria-label="Modifier">
						<Pencil size={16} />
					</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Board</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Field>
							<FieldLabel>Name</FieldLabel>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={updateMutation.isPending}
								required
							/>
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
								Cancel
							</Button>
							<Button type="submit" disabled={updateMutation.isPending}>
								{updateMutation.isPending ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogTrigger asChild>
					<button type="button" aria-label="Supprimer">
						<Trash2 size={16} className="text-red-400" />
					</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							Board « {board.name} will be deleted
						</DialogDescription>
					</DialogHeader>

					{deleteMutation.isError && (
						<p className="text-red-400">{deleteMutation.error.message}</p>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setDeleteOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={deleteMutation.isPending}
							onClick={() => deleteMutation.mutate(board.id)}
						>
							{deleteMutation.isPending ? "Deletion..." : "Deleted"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</li>
	);
};
