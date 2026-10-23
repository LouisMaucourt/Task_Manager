import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	deleteWorkspace,
	updateWorkspace,
	type Workspace as WorkspaceType,
} from "@/modules/workspaces/api";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { WorkspaceForm } from "../Workspace";

export const WorkspaceItem = ({ workspace }: { workspace: WorkspaceType }) => {
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: ["workspaces"] });

	const updateMutation = useMutation({
		mutationFn: updateWorkspace,
		onSuccess: () => {
			setEditOpen(false);
			toast.success("Workspace modifié");
			refresh();
		},
		onError: (error) => toast.error(error.message),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteWorkspace,
		onSuccess: () => {
			setDeleteOpen(false);
			toast.success("Workspace supprimé");
			refresh();
		},
		onError: (error) => toast.error(error.message),
	});

	return (
		<li className="flex items-center gap-2">
			{workspace.name} — {workspace.description}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogTrigger asChild>
					<button type="button" aria-label="Modifier">
						<Pencil size={16} />
					</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le workspace</DialogTitle>
					</DialogHeader>
					<WorkspaceForm
						initialValues={{
							name: workspace.name,
							description: workspace.description,
						}}
						onSubmit={(values) =>
							updateMutation.mutate({ id: workspace.id, ...values })
						}
						isPending={updateMutation.isPending}
						submitLabel="Enregistrer"
						pendingLabel="Enregistrement..."
						error={updateMutation.error?.message}
						onCancel={() => setEditOpen(false)}
					/>
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
						<DialogTitle>Êtes-vous sûr ?</DialogTitle>
						<DialogDescription>
							Le workspace « {workspace.name} » sera supprimé définitivement.
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
							Annuler
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={deleteMutation.isPending}
							onClick={() => deleteMutation.mutate(workspace.id)}
						>
							{deleteMutation.isPending ? "Suppression..." : "Supprimer"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</li>
	);
};
