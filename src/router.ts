import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { Home } from "./components/Home";
import { AuthLayout } from "./components/layout/AuthLayout";
import { Root } from "./components/layout/Root";
import { Test } from "./components/Test";
import { Account } from "./pages/Account";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{ index: true, Component: Home },
			{ path: "account", Component: Account },
			{
				path: "dashboard",
				Component: AuthLayout,
				children: [
					{ index: true, Component: Dashboard },
					{ path: "project", Component: Test },
				],
			},
		],
	},
]);
