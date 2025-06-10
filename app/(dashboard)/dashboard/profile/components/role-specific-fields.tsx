import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

type Props = {
  role: "AGENCY" | "ADMIN" | "USER" | "AGENT";
};

const RoleSpecificFields = ({ role }: Props) => {
  const form = useFormContext();

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {role === "AGENCY"
            ? "Agency Information"
            : role === "AGENT"
              ? "Agent Information"
              : "Administrative Settings"}
        </CardTitle>
        <CardDescription>
          {role === "AGENCY"
            ? "Manage your agency details and contact information (all fields are optional)"
            : role === "AGENT"
              ? "Manage your professional details and contact information (all fields are optional)"
              : "Additional settings for administrators"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {role === "AGENCY" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Corp"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agencyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Email (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="info@acme.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agencyLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Area</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nairobi, Kenya"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="showAgencyContact"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Display Contact Information
                    </FormLabel>
                    <FormDescription>
                      Show your contact details publicly on property listings
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
        {role === "AGENT" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Email (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@realestate.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
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
                  <FormLabel>Service Area</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nairobi, Kenya"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin User"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleSpecificFields;
