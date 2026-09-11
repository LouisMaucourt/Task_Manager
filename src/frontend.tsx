import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "@/router";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
