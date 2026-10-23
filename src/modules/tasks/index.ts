import Elysia, { t } from "elysia";
import { auth } from "@/lib/auth";
import { TaskModel } from "./model";
import * as TaskService from "./service";

export const tasks = new Elysia({ prefix: "/tasks" })
	.resolve(async ({ request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return status(401, "Non authentifié");
		return { user: session.user };
	})
	.get(
		"/board/:boardId",
		({ params }) => TaskService.getTasksByBoard(params.boardId),
		{
			params: TaskModel.boardParams,
			response: t.Array(TaskModel.task),
		},
	)
	.post("/", ({ body, user }) => TaskService.createTask(body, user.id), {
		body: TaskModel.createBody,
		response: TaskModel.task,
	})
	.patch(
		"/:id",
		async ({ params, body, status }) => {
			const task = await TaskService.updateTask(params.id, body);
			return task ?? status(404, "Task not found");
		},
		{
			params: TaskModel.idParams,
			body: TaskModel.updateBody,
			response: { 200: TaskModel.task, 404: t.String() },
		},
	)
	.delete(
		"/:id",
		async ({ params, status }) => {
			const task = await TaskService.deleteTask(params.id);
			return task ?? status(404, "Task not found");
		},
		{
			params: TaskModel.idParams,
			response: { 200: TaskModel.task, 404: t.String() },
		},
	);
