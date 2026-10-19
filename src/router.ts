import { createBrowserRouter } from "react-router";
import { Boards } from "./components/Boards";
import { BoardsList } from "./components/BoardsList";
import { Dashboard } from "./components/Dashboard";
import { Home } from "./components/Home";
import { AuthLayout } from "./components/layout/AuthLayout";
import { Root } from "./components/layout/Root";
import { Members } from "./components/Members";
import { Projects } from "./components/Projects";
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
					{ path: "projects", Component: Projects },
					{
						path: "projects/:id",
						children: [
							{
								index: true,
								Component: Boards,
							},
							{
								path: "boards/:id",
								Component: BoardsList,
							},
						],
					},

					{ path: "members", Component: Members },
					{ path: "test", Component: Test },
				],
			},
		],
	},
]);
