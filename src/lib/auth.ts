import { betterAuth } from "better-auth";
import { pool } from "../../backend/client";

export const auth = betterAuth({
	database: pool,
	emailAndPassword: { enabled: true },
	user: {
		fields: { image: "avatar_url" },
		additionalFields: {
			firstname: { type: "string", required: true },
			lastname: { type: "string", required: true },
		},
	},
});
