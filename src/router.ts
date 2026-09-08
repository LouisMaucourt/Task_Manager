import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import { Input } from "./components/ui/Input";

async function loadRootData() {
    return null;
}

export let router = createBrowserRouter([
    {
        path: "/",
        Component: Input,
        loader: loadRootData,
    },
    {
        path: "/e",
        Component: Input,
        loader: loadRootData,
    },
]);

