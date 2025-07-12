"use client"

import { logout } from "@/app/(auth)/login/actions";
import { useCompanyContext } from "@/stores/company.store";
import { useUserContext } from "@/stores/user.store";
import Link from "next/link";
import ProfileAvatar from "../profile-avatar/ProfileAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import AppTitle from "./AppTitle";

export default function AppNavbar() {
  const { user } = useUserContext()
  const { company } = useCompanyContext()

  return (
    <header className="bg-slate-800 text-white group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex">
          <SidebarTrigger className="-ml-1 h-4 w-4" />
        </div>
        <AppTitle user={user} company={company} />
        <div className="flex flex-1"></div>
        <div className="flex flex-row gap-2 items-center">
          <span className="text-xl font-bold mr-2">
            {user?.name}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ProfileAvatar
                name={user?.name}
                src={user?.image}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem key="profile" textValue="My Profile">
                <Link className="flex" href="profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem key="settings">My Settings</DropdownMenuItem>
              <DropdownMenuItem key="team_settings">Team Settings</DropdownMenuItem>
              <DropdownMenuItem key="analytics">Analytics</DropdownMenuItem>
              <DropdownMenuItem key="system">System</DropdownMenuItem>
              <DropdownMenuItem key="configurations">Configurations</DropdownMenuItem>
              <DropdownMenuItem key="help_and_feedback">Help & Feedback</DropdownMenuItem>
              <DropdownMenuItem key="logout" color="danger" onClick={() => logout()}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
