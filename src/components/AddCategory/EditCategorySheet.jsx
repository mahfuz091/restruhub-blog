"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";
import { blogCategoryUpdate } from "@/app/actions/blog/blogCategory";

export function EditCategorySheet({ category, onCategoryUpdated }) {
  const [name, setName] = useState(category?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a category name");

    setLoading(true);

    try {
      const res = await blogCategoryUpdate(category.id, name.trim());

      if (res.success) {
        toast.success(res.msg || "Category updated successfully!");
        if (onCategoryUpdated) onCategoryUpdated();
      } else {
        toast.error(res.msg || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Edit2 className="w-4 h-4 mr-4 cursor-pointer" />
      </SheetTrigger>

      <SheetContent className="!bg-gray-100">
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="grid flex-1 auto-rows-min gap-6 px-4"
        >
          <div className="grid gap-3 mx-3">
            <Label htmlFor="sheet-edit-name">Category</Label>
            <Input
              id="sheet-edit-name"
              name="name"
              placeholder="Please enter a category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <SheetFooter className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>

            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
