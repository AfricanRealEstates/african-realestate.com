"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "./DatePicker";
import { cn } from "@/lib/utils";

import {
  createDiscount,
  searchUsers,
  getDiscountSummary,
  getDiscounts,
  revokeDiscount,
  deleteRevokedDiscount,
  User,
  DiscountSummary,
  Discount,
} from "./actions";

const createDiscountSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one user must be selected"),
  percentage: z.number().min(1).max(100),
  expirationDate: z
    .date()
    .min(new Date(), "Expiration date must be in the future"),
});

type CreateDiscountFormValues = z.infer<typeof createDiscountSchema>;

export default function DiscountsManager() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState<DiscountSummary | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<
    "all" | "active" | "expiring" | "expired" | "revoked"
  >("all");

  const form = useForm<CreateDiscountFormValues>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      userIds: [],
      percentage: 0,
      expirationDate: undefined,
    },
  });

  useEffect(() => {
    fetchDiscountSummary();
    fetchDiscounts();
  }, [currentPage, filter]);

  const fetchDiscountSummary = async () => {
    try {
      const summaryData = await getDiscountSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching discount summary:", error);
      toast.error("Failed to fetch discount summary");
    }
  };

  const fetchDiscounts = async () => {
    try {
      const { discounts, totalPages } = await getDiscounts(
        currentPage,
        10,
        filter
      );
      setDiscounts(discounts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Failed to fetch discounts");
    }
  };

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      try {
        const results = await searchUsers(value);
        setUsers(results);
      } catch (error) {
        console.error("Error searching users:", error);
        toast.error("Failed to search users");
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
  };

  const handleCreateDiscount = async (values: CreateDiscountFormValues) => {
    try {
      const discount = await createDiscount(values);

      if (discount) {
        toast.success(`Discount code created: ${discount.code}`);
        setSelectedUsers([]);
        form.reset();
        fetchDiscountSummary();
        fetchDiscounts();
      }
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("Failed to create discount code");
    }
  };

  const handleRemoveSelectedUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    const currentUserIds = form.getValues("userIds");
    form.setValue(
      "userIds",
      currentUserIds.filter((id) => id !== userId)
    );
  };

  const handleRevokeDiscount = async (discountId: string) => {
    try {
      await revokeDiscount(discountId);
      toast.success("Discount code revoked successfully");
      fetchDiscountSummary();
      fetchDiscounts();
    } catch (error) {
      console.error("Error revoking discount:", error);
      toast.error("Failed to revoke discount code");
    }
  };

  const handleDeleteRevokedDiscount = async (discountId: string) => {
    try {
      await deleteRevokedDiscount(discountId);
      toast.success("Revoked discount deleted successfully");
      fetchDiscountSummary();
      fetchDiscounts();
    } catch (error) {
      console.error("Error deleting revoked discount:", error);
      toast.error("Failed to delete revoked discount");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Discount Code</CardTitle>
          <CardDescription>
            Search for users and create a discount code
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateDiscount)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="userIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Users</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {selectedUsers.length > 0
                              ? `${selectedUsers.length} user(s) selected`
                              : "Select users..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <div className="p-2">
                            <Input
                              placeholder="Search users..."
                              value={searchQuery}
                              onChange={(e) => handleSearch(e.target.value)}
                            />
                          </div>
                          {users.length === 0 && (
                            <div className="p-2 text-sm text-gray-500">
                              No user found.
                            </div>
                          )}
                          <ul className="max-h-60 overflow-auto">
                            {users.map((user) => (
                              <li
                                key={user.id}
                                className={cn(
                                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                  selectedUsers.some((u) => u.id === user.id) &&
                                    "bg-accent text-accent-foreground"
                                )}
                                onClick={() => {
                                  const newSelectedUsers = selectedUsers.some(
                                    (u) => u.id === user.id
                                  )
                                    ? selectedUsers.filter(
                                        (u) => u.id !== user.id
                                      )
                                    : [...selectedUsers, user];
                                  setSelectedUsers(newSelectedUsers);
                                  field.onChange(
                                    newSelectedUsers
                                      .map((u) => u.id)
                                      .filter((id): id is string => id !== null)
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUsers.some((u) => u.id === user.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {user.email}
                              </li>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Users</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center"
                      >
                        <span>{user.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() =>
                            handleRemoveSelectedUser(user.id as string)
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        minDate={new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Create Discount Code</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Discount Codes Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total Created: {summary.totalCreated}</p>
              <p>About to Expire (next 7 days): {summary.aboutToExpire}</p>
              <p>Expired: {summary.expired}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>Manage your discount codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter discounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.code}</TableCell>
                  <TableCell>
                    {discount.users.map((user) => user.email).join(", ")}
                  </TableCell>
                  <TableCell>{discount.percentage}%</TableCell>
                  <TableCell>
                    {format(new Date(discount.expirationDate), "PPP")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        {
                          "bg-green-100 text-green-800":
                            new Date(discount.expirationDate) > new Date(),
                          "bg-yellow-100 text-yellow-800":
                            new Date(discount.expirationDate) > new Date() &&
                            new Date(discount.expirationDate) <=
                              addDays(new Date(), 7),
                          "bg-red-100 text-red-800":
                            new Date(discount.expirationDate) <= new Date(),
                        }
                      )}
                    >
                      {new Date(discount.expirationDate) > new Date()
                        ? new Date(discount.expirationDate) <=
                          addDays(new Date(), 7)
                          ? "Expiring Soon"
                          : "Active"
                        : "Expired"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevokeDiscount(discount.id)}
                      disabled={new Date(discount.expirationDate) <= new Date()}
                    >
                      Revoke
                    </Button>
                    {new Date(discount.expirationDate) <= new Date() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRevokedDiscount(discount.id)}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
