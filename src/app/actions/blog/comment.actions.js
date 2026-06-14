"use server";

import { prisma } from "@/lib/prisma";

export const getAllComments = async (filter = "all") => {
  try {
    let where = {};

    if (filter === "approved") where.approved = true;
    else if (filter === "rejected") where.approved = false;
    else if (filter === "pending") where.approved = null; 
    const comments = await prisma.comment.findMany({
      where,
      include: {
        post: {
          select: {
            title: true,
            author: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, msg: "Comments fetched successfully", comments };
  } catch (err) {
    console.error("getAllComments error:", err);
    return { success: false, msg: "Failed to fetch comments" };
  }
};



export const approveComment = async (id) => {
  try {
    const updated = await prisma.comment.update({
      where: { id },
      data: { approved: true },
    });
    return { success: true, msg: "Comment approved", comment: updated };
  } catch (err) {
    console.error("approveComment error:", err);
    return { success: false, msg: "Failed to approve comment" };
  }
};

export const rejectComment = async (id) => {
  try {
    const updated = await prisma.comment.update({
      where: { id },
      data: { approved: false },
    });

    return { success: true, msg: "Comment rejected successfully", comment: updated };
  } catch (err) {
    console.error("rejectComment error:", err);
    return { success: false, msg: "Failed to reject comment" };
  }
};

export const deleteComment = async (id) => {
  try {
    const deleted = await prisma.comment.delete({ where: { id } });
    return { success: true, msg: "Comment deleted successfully", comment: deleted };
  } catch (err) {
    console.error("deleteComment error:", err);
    return { success: false, msg: "Failed to delete comment" };
  }
};
