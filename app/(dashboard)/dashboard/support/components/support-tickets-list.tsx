"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getSupportTickets } from "../actions";

export function SupportTicketsList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  // Fetch support tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const supportTickets = await getSupportTickets();
        setTickets(supportTickets);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load support tickets",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [toast]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // For demo purposes, we'll use mock data if no tickets are returned
  const mockTickets = isLoading
    ? []
    : filteredTickets.length > 0
      ? filteredTickets
      : [
          {
            id: "query_1",
            subject: "Payment issue with property listing",
            email: "john.doe@example.com",
            status: "OPEN",
            priority: "HIGH",
            createdAt: new Date().toISOString(),
          },
          {
            id: "query_2",
            subject: "Cannot upload property images",
            email: "jane.smith@example.com",
            status: "IN_PROGRESS",
            priority: "MEDIUM",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "query_3",
            subject: "Question about subscription plan",
            email: "robert.johnson@example.com",
            status: "CLOSED",
            priority: "LOW",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge variant="destructive">Open</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="default">In Progress</Badge>;
      case "CLOSED":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="destructive">High</Badge>;
      case "MEDIUM":
        return <Badge variant="default">Medium</Badge>;
      case "LOW":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Support Tickets</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading support tickets...
                </TableCell>
              </TableRow>
            ) : (
              mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/support/tickets/${ticket.id}`
                            )
                          }
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Respond
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/support/tickets/escalate/${ticket.id}`
                            )
                          }
                        >
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Escalate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
