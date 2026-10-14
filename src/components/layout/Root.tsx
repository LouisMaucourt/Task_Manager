import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";

export const Root = () => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
			<Toaster />
		</QueryClientProvider>
	);
};
