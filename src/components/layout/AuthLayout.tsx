import { useQuery } from "@tanstack/react-query";
import {
	CheckIcon,
	ChevronsUpDownIcon,
	FolderIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	PlusIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { getWorkspaces } from "@/modules/workspaces/api";

const workspaces = [
	{ id: "1", name: "Acme Inc" },
	{ id: "2", name: "Perso" },
	{ id: "3", name: "Équipe design" },
];

const navigation = [
	{ title: "Dashboard", icon: LayoutDashboardIcon, url: "/dashboard" },
	{ title: "Projets", icon: FolderIcon, url: "/dashboard/project" },
];

function WorkspaceSwitcher() {
	const { isMobile } = useSidebar();
	const query = useQuery({ queryKey: ["workspaces"], queryFn: getWorkspaces });
	const workspaces = query.data ?? [];
	const [activeId, setActiveId] = useState<string | null>(null);
	const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

	if (query.isPending) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" disabled>
						Chargement...
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
								{active?.name[0] ?? "?"}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{active?.name ?? "Aucun workspace"}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									Workspace
								</span>
							</div>
							<ChevronsUpDownIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Workspaces
						</DropdownMenuLabel>
						{workspaces.map((w) => (
							<DropdownMenuItem key={w.id} onClick={() => setActiveId(w.id)}>
								<div className="flex size-6 items-center justify-center rounded-md border text-xs">
									{w.name[0]}
								</div>
								{w.name}
								{w.id === active?.id && (
									<CheckIcon className="ml-auto size-4" />
								)}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<PlusIcon className="size-4" />
							Créer un workspace
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function UserMenu() {
	const { isMobile } = useSidebar();
	const { data: session, isPending } = authClient.useSession();

	if (isPending || !session) return null;

	const { user } = session;
	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		});
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent"
						>
							<Avatar className="size-8 rounded-lg">
								<AvatarImage src={user.image ?? undefined} alt={user.name} />
								<AvatarFallback className="rounded-lg">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
							<ChevronsUpDownIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "top"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col">
								<span className="text-sm font-medium">{user.name}</span>
								<span className="text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<UserIcon className="size-4" />
							Mon compte
						</DropdownMenuItem>
						<DropdownMenuItem>
							<SettingsIcon className="size-4" />
							Paramètres
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							<LogOutIcon className="size-4" />
							Se déconnecter
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export const AuthLayout = () => {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<WorkspaceSwitcher />
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{navigation.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											// isActive={pathname.startsWith(item.url)}
											tooltip={item.title}
										>
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<UserMenu />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger />
				</header>
				<div className="p-4">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
