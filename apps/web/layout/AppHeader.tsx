"use client";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useTestSuites } from "@/hooks/useTestSuites";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const pathname = usePathname();
  const { projectId } = useParams();

  const { data: projects } = useProjects();
  const { data: testSuites } = useTestSuites(projectId as string);
  // Extract project ID from pathname and find project name
  const currentProject = useMemo(() => {
    const projectMatch = pathname.match(/\/projects\/([^\/]+)/);
    if (projectMatch && projects?.data) {
      const projectId = projectMatch[1];
      // Convert projectId to number since the API returns numeric IDs
      const numericProjectId = parseInt(projectId, 10);
      return projects.data.find((project: { id: number; name: string }) => project.id === numericProjectId);
    }
    return null;
  }, [pathname, projects?.data]);

  // Check if we're on a project page (even if data hasn't loaded yet)
  const isOnProjectPage = useMemo(() => {
    return pathname.match(/\/projects\/[^\/]+/);
  }, [pathname]);

  const isOnTestSuitePage = useMemo(() => {
    return pathname.match(/\/projects\/[^\/]+\/test-suites\/[^\/]+/);
  }, [pathname]);

  const currentTestSuite = useMemo(() => {
    const testSuiteMatch = pathname.match(/\/projects\/[^\/]+\/test-suites\/([^\/]+)/);
    if (testSuiteMatch && testSuites?.data) {
      const testSuiteId = testSuiteMatch[1];
      return testSuites.data.find((testSuite: { id: number; name: string }) => testSuite.id === parseInt(testSuiteId, 10));
    }
    return null;
  }, [pathname, testSuites?.data]);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };


  return (
    <header className="flex w-full bg-white border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">


          <Link href="/" className="lg:hidden">
            <div className="dark:hidden flex items-center justify-center gap-3">
              <Image
                className="dark:hidden rounded-lg"
                src="/images/speck.png"
                alt="Logo"
                width={30}
                height={30}
              />
              <p className="text-2xl font-medium dark:text-white">Speck</p>
            </div>
            <div className="hidden dark:flex items-center justify-center gap-3">
              <Image
                className="hidden dark:block rounded-lg"
                src="/images/speck.png"
                alt="Logo"
                width={30}
                height={30}
              />
              <p className="text-2xl font-medium dark:text-white">Speck</p>
            </div>
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="hidden lg:block">
            <nav className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-400">
              <Link href="/projects" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Projects
              </Link>
              {isOnProjectPage && !isOnTestSuitePage && currentProject && (
                <>
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {currentProject.name}
                  </span>
                </>
              )}
              {isOnTestSuitePage && currentProject && currentTestSuite && (
                <>
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                  <Link 
                    href={`/projects/${currentProject.id}`} 
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {currentProject.name}
                  </Link>
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {currentTestSuite.name}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* <!-- Dark Mode Toggler --> */}

          <NotificationDropdown /> 
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown /> 
    
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
