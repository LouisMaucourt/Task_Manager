import { authClient } from "@/lib/auth-client";
import type { UserModel } from "./model";

export type SignUpPayload = {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	avatar_url?: string;
};

export type SignInPayload = {
	email: string;
	password: string;
	rememberMe?: boolean;
};

export async function getUsers(): Promise<UserModel["publicUser"][]> {
	const res = await fetch("/api/users");
	if (!res.ok) throw new Error("Impossible de charger les utilisateurs");
	return res.json();
}

export async function signUp(payload: SignUpPayload) {
	const { data, error } = await authClient.signUp.email({
		email: payload.email,
		password: payload.password,
		name: `${payload.firstname} ${payload.lastname}`,
		firstname: payload.firstname,
		lastname: payload.lastname,
		image: payload.avatar_url || undefined,
	});

	if (error) throw new Error(error.message || "Échec de la création du compte");
	return data;
}

export async function signIn(payload: SignInPayload) {
	const { data, error } = await authClient.signIn.email({
		email: payload.email,
		password: payload.password,
		rememberMe: payload.rememberMe ?? true,
		callbackURL: "/dashboard",
	});

	if (error) throw new Error(error.message || "Échec de la connexion");
	return data;
}
