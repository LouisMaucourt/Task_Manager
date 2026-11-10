import { Resend } from "resend";
import { Email } from "@/components/email/invitation";

const resend = new Resend(process.env.RESEND_API);

export async function sendInvitationEmail(to: string, token: string) {
	const { error } = await resend.emails.send({
		from: "Mon App <onboarding@resend.dev>",
		to: "louis.maucourt7@gmail.com",
		subject: "Vous êtes invité à rejoindre un workspace",
		react: <Email url={`${process.env.APP_URL}/invitation/${token}`} />,
	});
	if (error) throw new Error(error.message);
}
