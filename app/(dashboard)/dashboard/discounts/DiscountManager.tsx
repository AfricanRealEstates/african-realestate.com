"use client";

import { TableHeader } from "@/components/ui/table";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DatePicker } from "./DatePicker";
import { cn } from "@/lib/utils";

import {
  createDiscount,
  editDiscount,
  searchUsers,
  getDiscountSummary,
  getDiscounts,
  revokeDiscount,
  deleteRevokedDiscount,
  getAllAgencyAndAgentUsers,
  getNewSignups,
  type User,
  type DiscountSummary,
  type Discount,
} from "./actions";

const createDiscountSchema = z
  .object({
    userCategory: z.enum(["selected", "all", "new"]),
    userIds: z.array(z.string()).optional(),
    percentage: z
      .number()
      .min(1)
      .max(100)
      .or(
        z
          .string()
          .regex(/^\d+(\.\d)?$/)
          .transform(Number)
      ),
    startDate: z.date(),
    expirationDate: z.date(),
    customCode: z.string().optional(),
    newSignupStartDate: z.date().optional(),
    newSignupEndDate: z.date().optional(),
  })
  .refine((data) => data.expirationDate > data.startDate, {
    message: "Expiration date must be after the start date",
    path: ["expirationDate"],
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
  const [userCategory, setUserCategory] = useState<"selected" | "all" | "new">(
    "selected"
  );
  const [newSignupStartDate, setNewSignupStartDate] = useState<Date>(
    startOfMonth(new Date())
  );
  const [newSignupEndDate, setNewSignupEndDate] = useState<Date>(
    endOfMonth(new Date())
  );
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDiscountFormValues>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      userCategory: "selected",
      userIds: [],
      percentage: undefined,
      startDate: new Date(),
      expirationDate: undefined,
      customCode: "",
      newSignupStartDate: startOfMonth(new Date()),
      newSignupEndDate: endOfMonth(new Date()),
    },
  });

  const fetchDiscountSummary = useCallback(async () => {
    try {
      const summaryData = await getDiscountSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching discount summary:", error);
      toast.error("Failed to fetch discount summary");
    }
  }, []);

  const fetchDiscounts = useCallback(async () => {
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
  }, [currentPage, filter]);

  useEffect(() => {
    fetchDiscountSummary();
    fetchDiscounts();
  }, [fetchDiscountSummary, fetchDiscounts]);

  const fetchAllAgencyAndAgentUsers = async () => {
    try {
      const users = await getAllAgencyAndAgentUsers();
      setSelectedUsers(users);
      form.setValue(
        "userIds",
        users.map((u) => u.id).filter((id): id is string => id !== null)
      );
    } catch (error) {
      console.error("Error fetching agency and agent users:", error);
      toast.error("Failed to fetch agency and agent users");
    }
  };

  const fetchNewSignups = async (startDate: Date, endDate: Date) => {
    try {
      const users = await getNewSignups(startDate, endDate);
      setSelectedUsers(users);
      form.setValue(
        "userIds",
        users.map((u) => u.id).filter((id): id is string => id !== null)
      );
    } catch (error) {
      console.error("Error fetching new signups:", error);
      toast.error("Failed to fetch new signups");
    }
  };

  useEffect(() => {
    if (userCategory === "all") {
      fetchAllAgencyAndAgentUsers();
    } else if (userCategory === "new") {
      const startDate = form.getValues("newSignupStartDate");
      const endDate = form.getValues("newSignupEndDate");
      if (startDate && endDate) {
        fetchNewSignups(startDate, endDate);
      }
    }
  }, [
    userCategory,
    form.getValues,
    fetchAllAgencyAndAgentUsers,
    fetchNewSignups,
  ]); // Added missing dependencies

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

  const handleCreateOrEditDiscount = async (
    values: CreateDiscountFormValues
  ) => {
    setIsSubmitting(true);
    try {
      let userIds: string[] = [];
      if (values.userCategory === "selected") {
        userIds = values.userIds || [];
      } else if (values.userCategory === "all") {
        userIds = selectedUsers
          .map((u) => u.id)
          .filter((id): id is string => id !== null);
      } else if (
        values.userCategory === "new" &&
        values.newSignupStartDate &&
        values.newSignupEndDate
      ) {
        const newUsers = await getNewSignups(
          values.newSignupStartDate,
          values.newSignupEndDate
        );
        userIds = newUsers
          .map((u) => u.id)
          .filter((id): id is string => id !== null);
      }

      const discountData = {
        userIds,
        percentage: values.percentage,
        startDate: values.startDate,
        expirationDate: values.expirationDate,
        customCode: values.customCode,
      };

      let result: any;
      if (editingDiscountId) {
        result = await editDiscount(editingDiscountId, discountData);
      } else {
        result = await createDiscount(discountData);
      }

      if (result.success) {
        toast.success(result.message);
        setSelectedUsers([]);
        form.reset();
        setEditingDiscountId(null);
        await fetchDiscountSummary();
        await fetchDiscounts();
        setCurrentPage(1); // Reset to first page after creating/editing
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating/editing discount:", error);
      toast.error("Failed to create/edit discount code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSelectedUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    const currentUserIds = form.getValues("userIds");
    form.setValue(
      "userIds",
      currentUserIds ? currentUserIds.filter((id) => id !== userId) : []
    );
  };

  const handleRevokeDiscount = async (discountId: string) => {
    try {
      const result = await revokeDiscount(discountId);
      if (result.success) {
        toast.success(result.message);
        await fetchDiscountSummary();
        await fetchDiscounts();
        setCurrentPage(1); // Reset to first page after revoking
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error revoking discount:", error);
      toast.error("Failed to revoke discount code");
    }
  };

  const handleDeleteRevokedDiscount = async (discountId: string) => {
    try {
      const result = await deleteRevokedDiscount(discountId);
      if (result.success) {
        toast.success(result.message);
        await fetchDiscountSummary();
        await fetchDiscounts();
        setCurrentPage(1); // Reset to first page after deleting
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting revoked discount:", error);
      toast.error("Failed to delete revoked discount");
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscountId(discount.id);
    form.reset({
      userCategory: "selected",
      userIds: discount.users
        .map((u) => u.id)
        .filter((id): id is string => id !== null),
      percentage: discount.percentage,
      startDate: new Date(discount.startDate),
      expirationDate: new Date(discount.expirationDate),
      customCode: discount.code,
    });
    setSelectedUsers(discount.users);
    setUserCategory("selected");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingDiscountId
              ? "Edit Discount Code"
              : "Generate Discount Code"}
          </CardTitle>
          <CardDescription>
            {editingDiscountId
              ? "Modify the discount code details"
              : "Search for users and create a discount code"}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateOrEditDiscount)}>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="userCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setUserCategory(value as "selected" | "all" | "new");
                        field.onChange(value);
                      }}
                      value={userCategory}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select user category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="selected">Selected Users</SelectItem>
                        <SelectItem value="all">
                          All Agency/Agent Users
                        </SelectItem>
                        <SelectItem value="new">New Signups</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {userCategory === "selected" && (
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
                                    selectedUsers.some(
                                      (u) => u.id === user.id
                                    ) && "bg-accent text-accent-foreground"
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
                                        .filter(
                                          (id): id is string => id !== null
                                        )
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUsers.some(
                                        (u) => u.id === user.id
                                      )
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
              )}

              {userCategory === "new" && (
                <>
                  <FormField
                    control={form.control}
                    name="newSignupStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              setNewSignupStartDate(date);
                              field.onChange(date);
                            }
                          }}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newSignupEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              setNewSignupEndDate(date);
                              field.onChange(date);
                            }
                          }}
                        />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="customCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Code (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., SUMMER25" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter discount percentage"
                        {...field}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? undefined : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
              <Button
                type="submit"
                className="bg-blue-400 text-white hover:bg-blue-300 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                    {editingDiscountId ? "Updating..." : "Creating..."}
                  </>
                ) : editingDiscountId ? (
                  "Update Discount Code"
                ) : (
                  "Create Discount Code"
                )}
              </Button>
              {editingDiscountId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingDiscountId(null);
                    form.reset();
                    setSelectedUsers([]);
                    setUserCategory("selected");
                  }}
                  className="ml-2"
                >
                  Cancel Edit
                </Button>
              )}
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
                <TableHead className="hidden md:table-cell">Users</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead className="hidden md:table-cell">
                  Start Date
                </TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.code}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {discount.users.map((user) => user.email).join(", ")}
                  </TableCell>
                  <TableCell>{discount.percentage}%</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(discount.startDate), "PPP")}
                  </TableCell>
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
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDiscount(discount)}
                        disabled={
                          new Date(discount.expirationDate) <= new Date()
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeDiscount(discount.id)}
                        disabled={
                          new Date(discount.expirationDate) <= new Date()
                        }
                      >
                        Revoke
                      </Button>
                      {new Date(discount.expirationDate) <= new Date() && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the discount code and remove
                                it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteRevokedDiscount(discount.id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-400 text-white hover:bg-blue-300 transition-all"
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
              className="bg-blue-400 text-white hover:bg-blue-300 transition-all"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
