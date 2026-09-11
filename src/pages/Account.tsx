import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputPwd } from "@/components/ui/InputPwd";
import { Input } from "@/components/ui/input";

type Status = "typing" | "submitting" | "success";

type User = {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
};

const initialForm = {
	firstname: "",
	lastname: "",
	password: "",
	confirm_password: "",
	avatar_url: "",
	email: "",
};

export const Account = () => {
	const [form, setForm] = useState(initialForm);
	const [status, setStatus] = useState<Status>("typing");
	const [error, setError] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		fetch("/api/users")
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setUsers(data);
			});
	}, []);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (form.password !== form.confirm_password) {
			setError("Mot de passe différent");
			return;
		}

		setError(null);
		setStatus("submitting");

		try {
			const res = await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify(form),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				const message = await res.text();
				throw new Error(message || "Échec de la création du compte");
			}

			setStatus("success");
		} catch (err) {
			setStatus("typing");
			setError(err instanceof Error ? err.message : "Une erreur est survenue");
		}
	}
	if (status === "success") {
		return (
			<Card className="p-10">
				<h1>Compte créé avec succès !</h1>
			</Card>
		);
	}

	return (
		<>
			<Card className="p-10">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Field>
						<FieldLabel>Prénom</FieldLabel>
						<Input
							name="firstname"
							value={form.firstname}
							onChange={handleChange}
							disabled={status === "submitting"}
							required
						/>
					</Field>

					<Field>
						<FieldLabel>Nom</FieldLabel>
						<Input
							name="lastname"
							value={form.lastname}
							onChange={handleChange}
							disabled={status === "submitting"}
							required
						/>
					</Field>

					<Field>
						<FieldLabel>Email</FieldLabel>
						<Input
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							disabled={status === "submitting"}
							required
						/>
					</Field>

					<Field>
						<FieldLabel>Mot de passe</FieldLabel>
						<InputPwd
							name="password"
							value={form.password}
							onChange={handleChange}
							disabled={status === "submitting"}
							required
						/>
					</Field>

					<Field>
						<FieldLabel>Confirmer mot de passe</FieldLabel>
						<InputPwd
							name="confirm_password"
							value={form.confirm_password}
							onChange={handleChange}
							disabled={status === "submitting"}
							required
						/>
						{error && (
							<FieldDescription className="text-red-400">
								{error}
							</FieldDescription>
						)}
					</Field>

					<Button disabled={status === "submitting"}>
						{status === "submitting" ? "Envoi..." : "Confirmer"}
					</Button>
				</form>
			</Card>

			<Card className="p-10 mt-4">
				<h2>Utilisateurs</h2>
				<ul>
					{users.map((user) => (
						<li key={user.id}>
							{user.firstname} {user.lastname} — {user.email}
						</li>
					))}
				</ul>
			</Card>
		</>
	);
};
