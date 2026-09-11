import { Elysia, t } from "elysia";
import { UserModel } from "./model";
import * as UserService from "./service";

export const users = new Elysia({ prefix: "/users" })
	.post("/", async ({ body }) => UserService.create(body), {
		body: UserModel.createBody,
		response: { 200: UserModel.createResponse },
	})
	.get("/", async () => UserService.findAll(), {
		response: { 200: t.Array(UserModel.publicUser) },
	});
