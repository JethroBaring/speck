"use client";

import UsersTable from "@/components/settings/users/UsersTable";
import Button from "@/components/ui/button/Button";
import { PlusCircle, Search, Users, Users2 } from "lucide-react";
import Input from "@/components/form/input/InputField";
import React, { useState } from "react";
import { useOrganization } from "@/hooks/useOrganizations";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: organization } = useOrganization();
  
  return <div>
    <div className="border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-l">
      <div className="flex items-start justify-between p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text">
            <Users className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Users</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Manage your users</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="xs">
            <PlusCircle className="h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

    </div>
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 z-9 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="!pl-10 !pr-4"
            />
          </div>
        </div>
      </div>
      <UsersTable organizationId={organization?.data?.id!} />
    </div>

  </div>;

}
