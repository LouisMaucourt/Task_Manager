import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "./button";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";
import { InputGroup } from "./input-group";

type InputPwdProps = React.ComponentProps<typeof Input> & {
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputPwd = ({
	name,
	value,
	onChange,
	...props
}: InputPwdProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<Field>
			<FieldLabel htmlFor={name}>Mot de passe</FieldLabel>
			<InputGroup>
				<Input
					id={name}
					name={name}
					type={showPassword ? "text" : "password"}
					value={value}
					onChange={onChange}
					{...props}
				/>

				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => setShowPassword((prev) => !prev)}
					aria-label={
						showPassword
							? "Masquer le mot de passe"
							: "Afficher le mot de passe"
					}
				>
					{showPassword ? <EyeOff /> : <Eye />}
				</Button>
			</InputGroup>
		</Field>
	);
};
