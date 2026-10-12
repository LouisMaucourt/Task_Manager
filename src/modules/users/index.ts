import { Elysia, t } from "elysia";
import { UserModel } from "./model";
import * as UserService from "./service";

export const users = new Elysia({ prefix: "/users" }).get(
	"/",
	async () => UserService.getUsers(),
	{
		response: { 200: t.Array(UserModel.publicUser) },
	},
);
