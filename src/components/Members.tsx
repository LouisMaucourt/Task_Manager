import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { getWorkspaces } from "@/modules/workspaces/api";

export const Members = () => {
	const { data } = authClient.useSession();
	const workspaceId = localStorage.getItem("workspaceId");
	console.log(workspaceId);

    const initalData = {
        email:"",
        role: ""
    }
	return <div>Members

    </div>;
};
