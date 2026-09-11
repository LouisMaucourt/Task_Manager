import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Root } from "./components/layout/Root";
import { Account } from "./pages/Account";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{ index: true, Component: Home },
			{ path: "account", Component: Account },
			// {
			//     path: "auth",
			//     Component: AuthLayout,
			//     children: [
			//         { path: "login", Component: Login },
			//         { path: "register", Component: Register },
			//     ],
			// },
		],
	},
]);
