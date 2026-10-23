
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { createWorkspace } from "@/modules/workspaces/api";
import { WorkspaceForm } from "../Workspace";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const CreateWorkspaceDialog = ({ open, onOpenChange }: Props) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: createWorkspace,
		onSuccess: () => {
			onOpenChange(false);
			toast.success("Workspace créé");
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
		},
		onError: (error) => toast.error(error.message),
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Créer un workspace</DialogTitle>
				</DialogHeader>
				<WorkspaceForm
					onSubmit={(values) => mutation.mutate(values)}
					isPending={mutation.isPending}
					submitLabel="Créer"
					pendingLabel="Création..."
					error={mutation.error?.message}
					onCancel={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};

