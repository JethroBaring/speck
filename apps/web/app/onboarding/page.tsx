"use client";
import GridShape from "@/components/common/GridShape";
import React, { useEffect, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useCreateOrganization, useUserBelongsToOrganization } from "@/hooks/api/useOrganizations";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/stores/useToastStore";

export default function Onboarding() {
  const [organizationName, setOrganizationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createOrganization } = useCreateOrganization();
  const toast = useToastStore();
  const router = useRouter();

  const { data: userBelongsToOrganizationData } = useUserBelongsToOrganization();

  useEffect(() => {
    if (userBelongsToOrganizationData?.data) {
      router.push("/projects");
    }
  }, [userBelongsToOrganizationData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim()) return;

    setIsSubmitting(true);

    try {
      createOrganization(organizationName, {
        onSuccess: () => {
          toast.addToast({
            title: "Organization created successfully",
            message: "Organization created successfully",
            type: "success",
          });
          router.push("/projects");
        }
      });
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[400px] text-center sm:max-w-[500px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          Welcome to Speck
        </h1>

        {/* <div className="mb-8">
          <Image
            src="/images/error/404.svg"
            alt="Welcome"
            className="dark:hidden mx-auto"
            width={300}
            height={100}
          />
          <Image
            src="/images/error/404-dark.svg"
            alt="Welcome"
            className="hidden dark:block mx-auto"
            width={300}
            height={100}
          />
        </div> */}

        <p className="mb-8 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          Let's get started by setting up your organization
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <Label htmlFor="organization-name">
              Organization Name <span className="text-error-500">*</span>
            </Label>
            <Input
              id="organization-name"
              type="text"
              placeholder="Enter your organization name"
              defaultValue={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            size="xs"
            className="w-full"
            disabled={!organizationName.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Organization"}
          </Button>
        </form>
      </div>
      
      {/* Footer */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - TailAdmin
      </p>
    </div>
  );
}
