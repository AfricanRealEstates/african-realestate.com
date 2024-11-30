"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import {
  createDiscount,
  searchUsers,
  getDiscountSummary,
  getDiscounts,
  revokeDiscount,
  User,
  DiscountSummary,
  Discount,
} from "./actions";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DatePicker } from "./DatePicker";

export default function DiscountsManager() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    undefined
  );
  const [summary, setSummary] = useState<DiscountSummary | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<
    "all" | "active" | "expiring" | "expired"
  >("all");

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

  const handleCreateDiscount = async () => {
    if (!selectedUser || !discountPercentage || !expirationDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const discount = await createDiscount({
        userId: selectedUser,
        percentage: parseInt(discountPercentage),
        expirationDate,
      });

      if (discount) {
        toast.success(`Discount code created: ${discount.code}`);
        setSelectedUser(undefined);
        setDiscountPercentage("");
        setExpirationDate(undefined);
        fetchDiscountSummary();
        fetchDiscounts();
      }
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("Failed to create discount code");
    }
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Discount Code</CardTitle>
          <CardDescription>
            Search for a user and create a discount code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select User</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedUser
                    ? users.find((user) => user.id === selectedUser)?.email
                    : "Select user..."}
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
                        selectedUser === user.id &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        setSelectedUser(
                          user.id === selectedUser ? undefined : user.id
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUser === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {user.email}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPercentage">Discount Percentage</Label>
            <Input
              id="discountPercentage"
              type="number"
              min="1"
              max="100"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <DatePicker
              id="expirationDate"
              selected={expirationDate}
              onSelect={(date) => setExpirationDate(date)}
              minDate={new Date()}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateDiscount}>Create Discount Code</Button>
        </CardFooter>
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
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>User</TableHead>
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
                  <TableCell>{discount.user.email}</TableCell>
                  <TableCell>{discount.percentage}%</TableCell>
                  <TableCell>
                    {format(new Date(discount.expirationDate), "PPP")}
                  </TableCell>
                  <TableCell>
                    {new Date(discount.expirationDate) > new Date()
                      ? "Active"
                      : "Expired"}
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
