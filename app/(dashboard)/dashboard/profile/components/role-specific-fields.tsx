"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { UserRole } from "@prisma/client";

export default function RoleSpecificFields({
  form,
  role,
}: {
  form: UseFormReturn<any>;
  role: UserRole;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {role === "AGENCY" ? "Agency Information" : "Administrative Settings"}
        </CardTitle>
        <CardDescription>
          {role === "AGENCY"
            ? "Manage your agency details and contact information (all fields are optional)"
            : "Additional settings for administrators"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {role === "AGENCY" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency/Agent Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Real Estate Agency"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {/* <FormDescription>Optional</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Email (option)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="contact@agency.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {/* <FormDescription>Optional</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agentLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nairobi, Kenya"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  {/* <FormDescription>Optional</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="officeLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Phone (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+25400000000"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {/* <FormDescription>Optional</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+25400000000"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {/* <FormDescription>Optional</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="showAgentContact"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Display Contact Information
                    </FormLabel>
                    <FormDescription>
                      Show your contact details publicly on property listings
                      (optional)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {role === "ADMIN" && (
          <div className="text-sm text-muted-foreground">
            As an administrator, you have access to all system features and user
            management capabilities.
          </div>
        )}

        {role === "SUPPORT" && (
          <div className="text-sm text-muted-foreground">
            As a support team member, you have access to help users with their
            issues and manage support tickets.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
