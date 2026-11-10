import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/modules/users/api";
import {
	acceptInvitation,
	getWorkspacesInvitationToken,
} from "@/modules/workspaces_invitations/api";

const Centered = ({ children }: { children: React.ReactNode }) => (
	<div className="flex min-h-svh items-center justify-center p-4">
		{children}
	</div>
);

export const Invitation = () => {
	const { token = "" } = useParams();
	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		password: "",
	});

	const query = useQuery({
		queryKey: ["workspace_invitation", token],
		queryFn: () => getWorkspacesInvitationToken(token),
		enabled: !!token,
		retry: false,
	});

	const join = useMutation({
		mutationFn: async () => {
			if (!query.data) throw new Error("Invitation introuvable");
			await signUp({
				email: query.data.email,
				password: form.password,
				firstname: form.firstname,
				lastname: form.lastname,
			});
			return acceptInvitation(token);
		},
		onSuccess: async ({ workspace_id }) => {
			await window.cookieStore.set({
				name: "workspaceId",
				value: String(workspace_id),
				path: "/",
			});
			window.location.href = "/dashboard";
		},
	});

	if (query.isPending) return <p>Loading...</p>;

	if (query.isError) return <p>{query.error.message}</p>;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		join.mutate();
	};

	return (
		<Centered>
			<Card className="w-full max-w-md">
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<CardHeader>
						<CardTitle>Go to {query.data.workspace_name}</CardTitle>
						<CardDescription>{query.data.role}</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={query.data.email}
								readOnly
								disabled
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="firstname">Fistname</Label>
								<Input
									id="firstname"
									required
									value={form.firstname}
									onChange={(e) =>
										setForm({ ...form, firstname: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="lastname">Lastname</Label>
								<Input
									id="lastname"
									required
									value={form.lastname}
									onChange={(e) =>
										setForm({ ...form, lastname: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								minLength={8}
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
							/>
						</div>

						{join.isError && (
							<p className="text-sm text-red-400">{join.error.message}</p>
						)}
					</CardContent>

					<CardFooter>
						<Button type="submit" className="w-full" disabled={join.isPending}>
							{join.isPending
								? "Creation..."
								: "Create my account and join the workspace"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</Centered>
	);
};
