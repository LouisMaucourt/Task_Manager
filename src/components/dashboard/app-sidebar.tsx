"use client";

import {
	FolderIcon,
	InboxIcon,
	LayoutDashboardIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";
import type * as React from "react";

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
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar";

const navigation = [
	{ title: "Dashboard", icon: LayoutDashboardIcon, url: "/dashboard" },
	{ title: "Projets", icon: FolderIcon, url: "/dashboard/project" },
];

export default function SidebarDemo() {
	return (
		<div className="h-[320px] w-full max-w-2xl overflow-hidden rounded-lg border">
			<SidebarProvider
				className="h-full min-h-0"
				style={{ "--sidebar-width": "12rem" } as React.CSSProperties}
			>
				<Sidebar collapsible="none" className="h-full border-r">
					<SidebarHeader>
						<span className="px-2 text-sm font-semibold">Studio</span>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Workspace</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigation.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton isActive={item.active}>
												<item.icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
											{item.badge ? (
												<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
											) : null}
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter>
						<span className="px-2 text-xs text-muted-foreground">
							Studio · Registry
						</span>
					</SidebarFooter>
				</Sidebar>
				<SidebarInset className="min-h-0">
					<div className="flex h-full flex-col gap-2 p-4">
						<h3 className="text-sm font-semibold">Registry</h3>
						<p className="text-sm text-muted-foreground">
							This workspace is ready to share. Browse the registry, install
							from the CLI, or open the docs from the sidebar.
						</p>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
