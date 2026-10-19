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
import { deleteProject, updateProject } from "@/modules/projects/api";
import type { Project } from "@/modules/projects/model";
import { Button } from "../ui/button";

export const ProjectItem = ({ project }: { project: Project }) => {
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [form, setForm] = useState({
		name: project.name,
		description: project.description,
	});

	const updateMutation = useMutation({
		mutationFn: updateProject,
		onSuccess: () => {
			setEditOpen(false);
			toast.success("Project edit");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: (error) => toast.error(error.message),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteProject,
		onSuccess: () => {
			setDeleteOpen(false);
			toast.success("Project deleted");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: (error) => toast.error(error.message),
	});
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		updateMutation.mutate({ id: project.id, ...form });
	}

	return (
		<li className="flex items-center gap-2">
			{project.name} — {project.description} -{" "}
			<Link state={{ project }} to={`/dashboard/projects/${project.id}`}>
				voir plus
			</Link>
			<Dialog
				open={editOpen}
				onOpenChange={(open) => {
					setEditOpen(open);
					if (open) {
						setForm({
							name: project.name,
							description: project.description,
						});
					}
				}}
			>
				<DialogTrigger asChild>
					<button type="button" aria-label="Modifier">
						<Pencil size={16} />
					</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le workspace</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Field>
							<FieldLabel>Nom</FieldLabel>
							<Input
								name="name"
								value={form.name}
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
								Annuler
							</Button>
							<Button type="submit" disabled={updateMutation.isPending}>
								{updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
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
						<DialogTitle>Are you sure ?</DialogTitle>
						<DialogDescription>
							Workspace « {project.name} » will be definted deleted.
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
							onClick={() => deleteMutation.mutate(project.id)}
						>
							{deleteMutation.isPending ? "Suppression..." : "Supprimer"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</li>
	);
};
