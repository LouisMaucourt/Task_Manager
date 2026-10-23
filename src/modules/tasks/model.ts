import { t, type UnwrapSchema } from "elysia";

export const TaskModel = {
	boardParams: t.Object({ boardId: t.String() }),
	idParams: t.Object({ id: t.String() }),

	createBody: t.Object({
		title: t.String({ minLength: 1 }),
		listId: t.String(),
	}),
	updateBody: t.Partial(
		t.Object({
			title: t.String({ minLength: 1 }),
			description: t.String(),
			priority: t.String(),
			position: t.Number(),
			listId: t.String(),
		}),
	),

	task: t.Object({
		id: t.String(),
		title: t.String(),
		description: t.String(),
		position: t.Number(),
		priority: t.String(),
		listId: t.String(),
	}),
};

export type Task = UnwrapSchema<typeof TaskModel.task>;
export type CreateTaskBody = UnwrapSchema<typeof TaskModel.createBody>;
export type UpdateTaskBody = UnwrapSchema<typeof TaskModel.updateBody>;
