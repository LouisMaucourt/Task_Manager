import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
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
import {
	createWorkspace,
	deleteWorkspace,
	getWorkspaces,
	updateWorkspace,
	type Workspace as WorkspaceType,
} from "@/modules/workspaces/api";

const initialWorkspace = {
	name: "",
	description: "",
};

const WorkspaceItem = ({ workspace }: { workspace: WorkspaceType }) => {
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [form, setForm] = useState({
		name: workspace.name,
		description: workspace.description,
	});

	const updateMutation = useMutation({
		mutationFn: updateWorkspace,
		onSuccess: () => {
			setEditOpen(false);
			toast.success("Workspace modifié");
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
		},
		onError: (error) => toast.error(error.message),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteWorkspace,
		onSuccess: () => {
			setDeleteOpen(false);
			toast.success("Workspace supprimé");
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
		},
		onError: (error) => toast.error(error.message),
	});
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		updateMutation.mutate({ id: workspace.id, ...form });
	}

	return (
		<li className="flex items-center gap-2">
			{workspace.name} — {workspace.description}
			<Dialog
				open={editOpen}
				onOpenChange={(open) => {
					setEditOpen(open);
					if (open) {
						setForm({
							name: workspace.name,
							description: workspace.description,
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
						<DialogTitle>Êtes-vous sûr ?</DialogTitle>
						<DialogDescription>
							Le workspace « {workspace.name} » sera supprimé définitivement.
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

export const Workspace = () => {
	const queryClient = useQueryClient();
	const [form, setForm] = useState(initialWorkspace);

	const query = useQuery({ queryKey: ["workspaces"], queryFn: getWorkspaces });

	const createMutation = useMutation({
		mutationFn: createWorkspace,
		onSuccess: () => {
			setForm(initialWorkspace);
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
		},
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		createMutation.mutate(form);
	}

	return (
		<>
			<Card className="p-10">
				<CardTitle>Créer un workspace</CardTitle>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Field>
						<FieldLabel>Nom</FieldLabel>
						<Input
							name="name"
							value={form.name}
							onChange={handleChange}
							disabled={createMutation.isPending}
							required
						/>
					</Field>
					<Field>
						<FieldLabel>Description</FieldLabel>
						<Input
							name="description"
							value={form.description}
							onChange={handleChange}
							disabled={createMutation.isPending}
							required
						/>
					</Field>

					<Button type="submit" disabled={createMutation.isPending}>
						{createMutation.isPending ? "Création..." : "Créer"}
					</Button>

					{createMutation.isError && (
						<p className="text-red-400">{createMutation.error.message}</p>
					)}
				</form>
			</Card>

			<Card className="p-10 mt-4">
				<h2>Workspaces</h2>
				{query.isPending && <p>Chargement...</p>}
				{query.isError && (
					<p className="text-red-400">Erreur : {query.error.message}</p>
				)}
				<ul>
					{query.data?.map((workspace) => (
						<WorkspaceItem key={workspace.id} workspace={workspace} />
					))}
				</ul>
			</Card>
		</>
	);
};
