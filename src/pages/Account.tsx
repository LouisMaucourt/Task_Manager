import { useState } from "react";

export const Account = () => {
	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		password: "",
		avatar_url: "",
		email: "",
	});

	return (
		<div className="">
			<form></form>
		</div>
	);
};
