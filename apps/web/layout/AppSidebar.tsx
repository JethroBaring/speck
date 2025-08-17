"use client";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { HorizontaLDots } from "../icons/index";
import Button from "@/components/ui/button/Button";
import { CirclePlus, Search, Folder } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useCreateProject, useProjects } from "@/hooks/useProjects";
import { useToastStore } from "@/stores/useToastStore";
import { useProjectModalStore } from "@/stores/useProjectModalStore";

type Project = {
	name: string;
	id: string;
};

const AppSidebar: React.FC = () => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
	const { isOpen, openModal, closeModal } = useProjectModalStore();
	const { data: projects, isLoading, isError } = useProjects();
	const { mutate: createProject } = useCreateProject();
	const pathname = usePathname();
	const [projectName, setProjectName] = useState("");
	const toast = useToastStore();

	const renderProjects = (projects: Project[]) => (
		<ul className="flex flex-col gap-4">
			{projects.map((project) => (
				<li key={project.id}>
					{project.id && (
						<Link
							href={`/projects/${project.id}`}
							className={`menu-item group ${
								isActive(project.id) ? "menu-item-active" : "menu-item-inactive"
							}`}
						>
							<span
								className={`${
									isActive(project.id)
										? "menu-item-icon-active"
										: "menu-item-icon-inactive"
								}`}
							>
								<Folder />
							</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className={`menu-item-text`}>{project.name}</span>
							)}
						</Link>
					)}
				</li>
			))}
		</ul>
	);

	const isActive = useCallback((projectId: string) => pathname.includes(`/projects/${projectId}`), [pathname]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createProject(projectName, {
			onSuccess: () => {
				closeModal();
				setProjectName("");
				
				toast.addToast({
					title: "Project created successfully",
					message: "Project created successfully",
					type: "success",
				})
			},
		});
	};

	return (
		<div>
			<aside
				className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
					isExpanded || isMobileOpen
						? "w-[290px]"
						: isHovered
							? "w-[290px]"
							: "w-[90px]"
				}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
				onMouseEnter={() => !isExpanded && setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div
					className={`py-8 flex  ${
						!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
					}`}
				>
					<Link href="/">
						{isExpanded || isHovered || isMobileOpen ? (
							<>
								<div className="dark:hidden flex items-center justify-center gap-3">
									<Image
										className="dark:hidden rounded-lg"
										src="/images/speck.png"
										alt="Logo"
										width={28}
										height={28}
									/>
									<p className="text-2xl font-medium dark:text-white">Speck</p>
								</div>
								{/* <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}

								<div className="hidden dark:flex items-center justify-center gap-3">
									<Image
										className="hidden dark:block rounded-lg"
										src="/images/speck.png"
										alt="Logo"
										width={28}
										height={28}
									/>
									<p className="text-2xl font-medium dark:text-white">Speck</p>
								</div>
							</>
						) : (
							<Image
								src="/images/speck.png"
								alt="Logo"
								width={32}
								height={32}
							/>
						)}
					</Link>
				</div>
				<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
					<nav className="mb-6">
						<div className="flex flex-col gap-4">
							<div>
								<div className="flex gap-2 mb-4">
									<Button className="w-full" size="xs" onClick={openModal}>
										<CirclePlus className="h-4 w-4" />
										New Project
									</Button>
									<button type="button" className="px-3 py-2.5 text-sm rounded-lg bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300">
										<Search className=" h-4 w-4" />
									</button>
								</div>

								<h2
									className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
										!isExpanded && !isHovered
											? "lg:justify-center"
											: "justify-start"
									}`}
								>
									{isExpanded || isHovered || isMobileOpen ? (
										"Projects"
									) : (
										<HorizontaLDots />
									)}
								</h2>
								{!isLoading && renderProjects(projects?.data)}
							</div>
						</div>
					</nav>
				</div>
			</aside>
			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<form onSubmit={handleSubmit} className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Create new project
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Create a new project for automated testing with test suites,
							cases, and execution management.
						</p>
					</div>
					<div className="flex flex-col gap-6">
						<div className="px-2 overflow-y-auto custom-scrollbar">
							<div className="flex flex-col gap-4">
								<div>
									<Label>Project Name</Label>
									<Input placeholder="Enter project name" onChange={(e) => setProjectName(e.target.value)}/>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 px-2 lg:justify-end">
							<Button size="sm" variant="outline" onClick={() => {}}>
								Cancel
							</Button>
							<Button size="xs" type="submit">Create</Button>
						</div>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AppSidebar;
