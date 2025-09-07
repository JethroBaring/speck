'use client'

import { Folder, PlusCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useProjectModalStore } from "@/stores/useProjectModalStore";
import { useProjects } from "@/hooks/useProjects";

export default function Projects() {  
  const { openModal } = useProjectModalStore();
  const { data: projects, isLoading } = useProjects();
  
  const hasProjects = projects?.data && projects.data.length > 0;
  
  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className="flex flex-col flex-1">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasProjects) {
    return (
      <div className="flex h-full">
        <div className="flex flex-col flex-1">
          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Folder className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Welcome to Speck!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Get started by creating your first testing project. Organize your test suites, 
                manage test cases, and track execution results all in one place.
              </p>
              
              <div className="space-y-3">
                <Button 
                  size="md" 
                  className="w-full"
                  onClick={openModal}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Your First Project
                </Button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Or explore our documentation to learn more
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1">
        {/* No Project Selected State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Folder className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              No Project Selected
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              You have {projects.data.length} project{projects.data.length !== 1 ? 's' : ''} available. 
              Select a project from the sidebar to get started, or create a new one.
            </p>
            
            <div className="space-y-3">
              <Button 
                size="md" 
                className="w-full"
                onClick={openModal}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Project
              </Button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use the sidebar to navigate between projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}