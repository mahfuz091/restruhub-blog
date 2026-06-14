"use server";

import { prisma } from "@/lib/prisma";

export const blogCategoryList = async (_prevState, formData) => {
  try {
    const blogCategory = await prisma.blogCategory.findMany();
    return {
      success: true,
      msg: "Category fetched successfully",
      blogCategory,
    };
  } catch (err) {
    console.error("blogCategoryList error:", err);
    return { success: false, msg: "Failed to fetch categories" };
  }
};

export const blogCategoryCreate = async (_prevState, formData) => {
  try {
    const name = formData.get("name");

    const existing = await prisma.blogCategory.findFirst({
      where: { name },
    });

    if (existing) {
      return { success: false, msg: "Category already exists" };
    }

    const created = await prisma.blogCategory.create({
      data: { name },
    });

    return {
      success: true,
      msg: "Category created successfully",
      blogCategory: created,
    };
  } catch (err) {
    console.error("blogCategoryCreate error:", err);
    return { success: false, msg: "Failed to create category" };
  }
};

export const deleteBlogCategory = async (id) => {
  try {
    const deleted = await prisma.blogCategory.delete({
      where: { id },
    });
    return {
      success: true,
      msg: "Category deleted successfully",
      blogCategory: deleted,
    };
  } catch (err) {
    console.error("deleteBlogCategory error:", err);
    return { success: false, msg: "Failed to delete category" };
  }
};


// blogCategory.js (server actions)

export const blogCategoryUpdate = async (id, name) => {
  try {
    const existing = await prisma.blogCategory.findFirst({
      where: { name, NOT: { id } },
    });

    if (existing) {
      return { success: false, msg: "Category already exists" };
    }

    const updated = await prisma.blogCategory.update({
      where: { id },
      data: { name },
    });

    return {
      success: true,
      msg: "Category updated successfully",
      blogCategory: updated,
    };
  } catch (err) {
    console.error("blogCategoryUpdate error:", err);
    return { success: false, msg: "Failed to update category" };
  }
};
