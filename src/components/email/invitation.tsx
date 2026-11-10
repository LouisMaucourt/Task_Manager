import { Button, Html } from "react-email";

export function Email(props) {
	const { url } = props;

	return (
		<Html lang="en">
			<Button href={url}>Click me</Button>
		</Html>
	);
}

export default Email;
