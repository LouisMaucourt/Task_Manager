import { t, type UnwrapSchema } from "elysia";

export const UserModel = {
	createBody: t.Object({
		firstname: t.String(),
		lastname: t.String(),
		email: t.String({ format: "email" }),
		password: t.String({ minLength: 8 }),
		avatar_url: t.Optional(t.String()),
	}),
	createResponse: t.Object({
		id: t.String(),
		firstname: t.String(),
		email: t.String(),
	}),
	publicUser: t.Object({
		id: t.String(),
		firstname: t.String(),
		lastname: t.String(),
		email: t.String(),
		avatar_url: t.Optional(t.String()),
	}),
} as const;

export type UserModel = {
	[K in keyof typeof UserModel]: UnwrapSchema<(typeof UserModel)[K]>;
};
