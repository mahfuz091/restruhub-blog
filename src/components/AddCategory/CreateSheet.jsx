"use client";

import { useState } from "react";
import { blogCategoryCreate } from "@/app/actions/blog/blogCategory";
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
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";

export function CreateSheet({ onCategoryCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a category name");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());

      const res = await blogCategoryCreate(null, formData);

      if (res.success) {
        toast.success(res.msg || "Category created successfully!");
        setName("");
        if (onCategoryCreated) onCategoryCreated(); 
      } else {
        toast.error(res.msg || "Failed to create category");
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
        <Button className="flex gap-2">
          <PlusOutlined />
          Create Category
        </Button>
      </SheetTrigger>

      <SheetContent className="!bg-gray-100">
        <SheetHeader>
          <SheetTitle>Create Category</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3 mx-3">
            <Label htmlFor="sheet-demo-name">Category</Label>
            <Input
              id="sheet-demo-name"
              name="name"
              placeholder="Please enter a category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <SheetFooter className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
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
