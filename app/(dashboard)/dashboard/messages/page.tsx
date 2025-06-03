import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageTemplates } from "./message-templates";
import { InactivePropertiesMessages } from "./inactive-property-messages";
import { ActivePropertiesMessages } from "./active-property-messages";
import { EmailStats } from "./email-stats";

export default function DashboardMessages() {
  return (
    <section className="px-4 pt-6">
      <div className="mb-4 col-span-full xl:mb-2">
        <h1 className="text-2xl font-semibold text-gray-800 sm:text-2xl">
          Marketing Messages
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Send marketing emails to clients with active and inactive properties
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full flex flex-wrap md:flex-nowrap">
          <TabsTrigger value="active" className="flex-1 text-sm sm:text-base">
            Active Properties
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex-1 text-sm sm:text-base">
            Inactive Properties
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="flex-1 text-sm sm:text-base"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex-1 text-sm sm:text-base"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <ActivePropertiesMessages />
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <InactivePropertiesMessages />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <MessageTemplates />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <EmailStats />
        </TabsContent>
      </Tabs>
    </section>
  );
}
