import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import { Pencil, Trash } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import moment from "moment";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

export default function UsersTable({ organizationId }: { organizationId: string }) {

  const { data: organizationMembers } = useOrganizationMembers(organizationId);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="w-1/5 px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/5 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Member Since
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/5 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/5 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="w-1/5 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {organizationMembers?.data?.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer">
                  <TableCell className="w-1/5 px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-brand-500 flex items-center justify-center">
                        <p className="text-white text-theme-xl font-medium">{(member as any).user.name.charAt(0)}</p>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {(member as any).user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {(member as any).user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/5 px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {moment((member as any).user.createdAt).fromNow()}
                  </TableCell>
                  <TableCell className="w-1/5 px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {(member as any).role.name}
                  </TableCell>
                  <TableCell className="w-1/5 px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        // true === "Active"
                          "success"
                          // : order.status === "Pending"
                          // ? "warning"
                          // : "error"
                      }
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="w-1/5 px-4 py-3 text-gray-500 text-theme-sm text-center dark:text-gray-400">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 dark:hover:bg-red-800/10 rounded-md">
                        <Trash className="h-4 w-4 text-red-500" />
                      </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
