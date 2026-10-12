import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputPwd } from "@/components/ui/InputPwd";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers, signIn, signUp } from "@/modules/users/api";

const initialSignUp = {
	firstname: "",
	lastname: "",
	email: "",
	password: "",
	confirm_password: "",
	avatar_url: "",
};

const initialSignIn = {
	email: "",
	password: "",
};

export const Account = () => {
	const queryClient = useQueryClient();
	const [signUpForm, setSignUpForm] = useState(initialSignUp);
	const [signInForm, setSignInForm] = useState(initialSignIn);
	const [formError, setFormError] = useState<string | null>(null);

	const query = useQuery({ queryKey: ["users"], queryFn: getUsers });

	const signUpMutation = useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			setSignUpForm(initialSignUp);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const signInMutation = useMutation({
		mutationFn: signIn,
		onSuccess: () => {
			setSignInForm(initialSignIn);
		},
	});

	function handleSignUpChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setSignUpForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSignInChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setSignInForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSignUp(e: React.FormEvent) {
		e.preventDefault();
		setFormError(null);

		if (signUpForm.password !== signUpForm.confirm_password) {
			setFormError("Les mots de passe ne correspondent pas");
			return;
		}

		const { confirm_password, ...payload } = signUpForm;
		signUpMutation.mutate(payload);
	}

	function handleSignIn(e: React.FormEvent) {
		e.preventDefault();
		signInMutation.mutate(signInForm);
	}

	return (
		<>
			<Tabs defaultValue="signin" className="w-[800px]">
				<TabsList>
					<TabsTrigger value="signin">Connexion</TabsTrigger>
					<TabsTrigger value="signup">Inscription</TabsTrigger>
				</TabsList>

				<TabsContent value="signin">
					<Card className="p-10">
						<CardTitle>Connexion</CardTitle>
						<form onSubmit={handleSignIn} className="flex flex-col gap-4">
							<Field>
								<FieldLabel>Email</FieldLabel>
								<Input
									name="email"
									type="email"
									value={signInForm.email}
									onChange={handleSignInChange}
									disabled={signInMutation.isPending}
									required
								/>
							</Field>
							<Field>
								<InputPwd
									name="password"
									value={signInForm.password}
									onChange={handleSignInChange}
									disabled={signInMutation.isPending}
									required
								/>
							</Field>

							<Button type="submit" disabled={signInMutation.isPending}>
								{signInMutation.isPending ? "Connexion..." : "Se connecter"}
							</Button>

							{signInMutation.isError && (
								<p className="text-red-400">{signInMutation.error.message}</p>
							)}
						</form>
					</Card>
				</TabsContent>

				<TabsContent value="signup">
					<Card className="p-10">
						<CardTitle>Inscription</CardTitle>
						<form onSubmit={handleSignUp} className="flex flex-col gap-4">
							<Field>
								<FieldLabel>Prénom</FieldLabel>
								<Input
									name="firstname"
									value={signUpForm.firstname}
									onChange={handleSignUpChange}
									disabled={signUpMutation.isPending}
									required
								/>
							</Field>
							<Field>
								<FieldLabel>Nom</FieldLabel>
								<Input
									name="lastname"
									value={signUpForm.lastname}
									onChange={handleSignUpChange}
									disabled={signUpMutation.isPending}
									required
								/>
							</Field>
							<Field>
								<FieldLabel>Email</FieldLabel>
								<Input
									name="email"
									type="email"
									value={signUpForm.email}
									onChange={handleSignUpChange}
									disabled={signUpMutation.isPending}
									required
								/>
							</Field>
							<Field>
								<InputPwd
									name="password"
									value={signUpForm.password}
									onChange={handleSignUpChange}
									disabled={signUpMutation.isPending}
									required
								/>
							</Field>
							<Field>
								<FieldLabel>Confirmer mot de passe</FieldLabel>
								<InputPwd
									name="confirm_password"
									value={signUpForm.confirm_password}
									onChange={handleSignUpChange}
									disabled={signUpMutation.isPending}
									required
								/>
							</Field>

							<Button type="submit" disabled={signUpMutation.isPending}>
								{signUpMutation.isPending ? "Envoi..." : "Confirmer"}
							</Button>

							{formError && <p className="text-red-400">{formError}</p>}
							{signUpMutation.isError && (
								<p className="text-red-400">{signUpMutation.error.message}</p>
							)}
							{signUpMutation.isSuccess && <p>Compte créé avec succès !</p>}
						</form>
					</Card>
				</TabsContent>
			</Tabs>

			<Card className="p-10 mt-4">
				<h2>Utilisateurs</h2>
				{query.isPending && <p>Chargement...</p>}
				{query.isError && (
					<p className="text-red-400">Erreur : {query.error.message}</p>
				)}
				<ul>
					{query.data?.map((user) => (
						<li key={user.id}>
							{user.firstname} {user.lastname} — {user.email}
						</li>
					))}
				</ul>
			</Card>
		</>
	);
};
