import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getWorkspaces } from "@/modules/workspaces/api";
import { WorkspaceItem } from "./items/WorkspaceItem";

export type WorkspaceFormValues = { name: string; description: string };

type FormProps = {
	initialValues?: WorkspaceFormValues;
	onSubmit: (values: WorkspaceFormValues) => void;
	isPending: boolean;
	submitLabel: string;
	pendingLabel: string;
	error?: string;
	onCancel?: () => void;
};

export const WorkspaceForm = ({
	initialValues = { name: "", description: "" },
	onSubmit,
	isPending,
	submitLabel,
	pendingLabel,
	error,
	onCancel,
}: FormProps) => {
	const [form, setForm] = useState(initialValues);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onSubmit(form);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<Field>
				<FieldLabel>Nom</FieldLabel>
				<Input
					name="name"
					value={form.name}
					onChange={handleChange}
					disabled={isPending}
					required
				/>
			</Field>
			<Field>
				<FieldLabel>Description</FieldLabel>
				<Input
					name="description"
					value={form.description}
					onChange={handleChange}
					disabled={isPending}
					required
				/>
			</Field>

			{error && <p className="text-red-400">{error}</p>}

			<div className="flex justify-end gap-2">
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel}>
						Annuler
					</Button>
				)}
				<Button type="submit" disabled={isPending}>
					{isPending ? pendingLabel : submitLabel}
				</Button>
			</div>
		</form>
	);
};

export const Workspace = () => {
	const query = useQuery({ queryKey: ["workspaces"], queryFn: getWorkspaces });

	return (
		<Card className="p-10">
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
	);
};
