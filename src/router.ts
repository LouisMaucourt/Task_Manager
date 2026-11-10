import { createBrowserRouter } from "react-router";
import { AuthLayout } from "./components/layout/AuthLayout";
import { Root } from "./components/layout/Root";
import { Account } from "./pages/Account";
import { Boards } from "./pages/Boards";
import { BoardsList } from "./pages/BoardsList";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Invitation } from "./pages/Invitation";
import { Members } from "./pages/Members";
import { Projects } from "./pages/Projects";
import { Test } from "./pages/Test";
import { Workspace } from "./pages/Workspace";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{ index: true, Component: Home },
			{ path: "account", Component: Account },
			{ path: "invitation/:token", Component: Invitation },
			{
				path: "dashboard",
				Component: AuthLayout,
				children: [
					{ index: true, Component: Dashboard },
					{ path: "workspace", Component: Workspace },
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
