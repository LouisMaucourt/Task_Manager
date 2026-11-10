import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Resend } from "resend";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	createWorkspaceInvitation,
	getWorkspacesInvitation,
} from "@/modules/workspaces_invitations/api";
import type { CreateWorkspaceInvitationBody } from "@/modules/workspaces_invitations/model";
import { getCookie } from "@/utilis/cookies";
import { Email } from "../components/email/invitation";
import { Button } from "../components/ui/button";

type InvitableRole = NonNullable<CreateWorkspaceInvitationBody["role"]>;

const INVITABLE_ROLES: readonly InvitableRole[] = ["admin", "member", "viewer"];
const initialForm: { email: string; role: InvitableRole } = {
	email: "",
	role: "member",
};

export const Members = () => {
	const queryClient = useQueryClient();
	const workspaceId = getCookie("workspaceId");
	const [form, setForm] = useState(initialForm);

	const query = useQuery({
		queryKey: ["workspace_invitation", workspaceId],
		queryFn: () => getWorkspacesInvitation(workspaceId as string),
		enabled: !!workspaceId,
	});

	const createMutation = useMutation({
		mutationFn: (data: CreateWorkspaceInvitationBody) =>
			createWorkspaceInvitation(workspaceId as string, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["workspace_invitation", workspaceId],
			});
			setForm(initialForm);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate(form);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					name="email"
					placeholder="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					required
				/>
				<Select
					value={form.role}
					onValueChange={(value) =>
						setForm({ ...form, role: value as InvitableRole })
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Choisir un rôle" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{INVITABLE_ROLES.map((role) => (
								<SelectItem key={role} value={role}>
									{role}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button type="submit" disabled={createMutation.isPending}>
					Envoyer
				</Button>
				{createMutation.isError && (
					<p className="text-red-400">{createMutation.error.message}</p>
				)}
			</form>

			{query.isPending && <p>Loading...</p>}
			{query.isError && <p className="text-red-400">{query.error.message}</p>}
			<ul>
				{query.data?.map((wm) => (
					<li key={wm.id}>
						{wm.id} ({wm.role})
					</li>
				))}
			</ul>
		</div>
	);
};
