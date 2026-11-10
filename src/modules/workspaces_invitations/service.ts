import { pool } from "../../../backend/client";
import { sendInvitationEmail } from "./mail";
import type {
	CreateWorkspaceInvitationBody,
	InvitationPreview,
	WorkspaceInvitation,
} from "./model";

export async function getWorkspacesInvitation(
	workspaceId: string,
): Promise<WorkspaceInvitation[]> {
	const result = await pool.query(
		`SELECT id, workspace_id, email, role, token, expires_at
		 FROM workspace_invitations
		 WHERE workspace_id = $1`,
		[workspaceId],
	);
	return result.rows.map((row) => ({
		...row,
		expires_at: new Date(row.expires_at).toISOString(),
	}));
}
export async function getWorkspacesInvitationToken(
	token: string,
): Promise<InvitationPreview | null> {
	const result = await pool.query(
		`SELECT i.email, i.role, w.name AS workspace_name
		 FROM workspace_invitations i
		 JOIN workspaces w ON w.id = i.workspace_id
		 WHERE i.token = $1
		   AND i.accepted_at IS NULL
		   AND i.expires_at > now()`,
		[token],
	);
	return result.rows[0] ?? null;
}
export async function acceptInvitation(
	token: string,
	user: { id: string; email: string },
): Promise<{ workspace_id: string } | null> {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const { rows } = await client.query(
			`SELECT id, workspace_id, email, role
			 FROM workspace_invitations
			 WHERE token = $1
			   AND accepted_at IS NULL
			   AND expires_at > now()
			 FOR UPDATE`,
			[token],
		);
		const inv = rows[0];

		if (!inv || inv.email.toLowerCase() !== user.email.toLowerCase()) {
			await client.query("ROLLBACK");
			return null;
		}

		await client.query(
			`INSERT INTO workspace_members (workspace_id, user_id, role)
			 VALUES ($1, $2, $3)
			 ON CONFLICT (workspace_id, user_id) DO NOTHING`,
			[inv.workspace_id, user.id, inv.role],
		);

		await client.query(
			`UPDATE workspace_invitations SET accepted_at = now() WHERE id = $1`,
			[inv.id],
		);

		await client.query("COMMIT");
		return { workspace_id: inv.workspace_id };
	} catch (e) {
		await client.query("ROLLBACK");
		throw e;
	} finally {
		client.release();
	}
}
export async function createWorkspaceInvitation(
	workspaceId: string,
	body: CreateWorkspaceInvitationBody,
	invitedBy: string,
): Promise<WorkspaceInvitation> {
	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const result = await pool.query(
		`INSERT INTO workspace_invitations
            (workspace_id, email, invited_by, role, token, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, workspace_id, email, role, token, expires_at`,
		[
			workspaceId,
			body.email,
			invitedBy,
			body.role ?? "member",
			token,
			expiresAt,
		],
	);

	const row = result.rows[0];

	try {
		await sendInvitationEmail(body.email, row.token);
	} catch (err) {
		console.error("Échec de l'envoi de l'email d'invitation:", err);
	}

	return { ...row, expires_at: new Date(row.expires_at).toISOString() };
}
// export async function updateWorkspace(
// 	id: string,
// 	body: UpdateWorkspaceBody,
// 	ownerId: string,
// ): Promise<Workspace | null> {
// 	const result = await pool.query(
// 		`UPDATE workspaces
// 		 SET name = COALESCE($2, name),
// 		     description = COALESCE($3, description),
// 		     updated_at = now()
// 		 WHERE id = $1 AND owner_id = $4
// 		 RETURNING id, name, COALESCE(description, '') AS description`,
// 		[id, body.name ?? null, body.description ?? null, ownerId],
// 	);
// 	return result.rows[0] ?? null;
// }

// export async function deleteWorkspace(
// 	id: string,
// 	ownerId: string,
// ): Promise<Workspace | null> {
// 	const result = await pool.query(
// 		`DELETE FROM workspaces
// 		 WHERE id = $1 AND owner_id = $2
// 		 RETURNING id, name, COALESCE(description, '') AS description`,
// 		[id, ownerId],
// 	);
// 	return result.rows[0] ?? null;
// }
