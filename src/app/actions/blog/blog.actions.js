"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function getString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseJsonContent(contentRaw) {
  if (!contentRaw) {
    return { time: Date.now(), blocks: [], version: "2.30.8" };
  }

  try {
    const parsed = JSON.parse(contentRaw);
    return typeof parsed === "object" && parsed ? parsed : null;
  } catch {
    return null;
  }
}

async function requireSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: { success: false, msg: "Unauthorized" } };
  }

  return { session };
}

async function getEditablePost(postId) {
  const { session, error } = await requireSession();
  if (error) return { error };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true, status: true },
  });

  if (!post) {
    return { error: { success: false, msg: "Post not found" } };
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && post.authorId !== session.user.id) {
    return { error: { success: false, msg: "Forbidden" } };
  }

  return { session, post, isAdmin };
}

function normalizeCreateStatus(rawStatus, isAdmin) {
  const requested = String(rawStatus || "").toUpperCase();
  const allowed = isAdmin
    ? new Set(["DRAFT", "PENDING", "APPROVED"])
    : new Set(["DRAFT", "PENDING"]);

  if (allowed.has(requested)) {
    return requested;
  }

  return isAdmin ? "APPROVED" : "PENDING";
}

function normalizeUpdateStatus(rawStatus, isAdmin) {
  const requested = String(rawStatus || "").toUpperCase();
  const allowed = isAdmin
    ? new Set(["DRAFT", "PENDING", "APPROVED", "DECLINE"])
    : new Set(["DRAFT", "PENDING"]);

  if (!requested) return undefined;
  if (!allowed.has(requested)) return null;
  return requested;
}

export const postList = async () => {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const isAdmin = session.user.role === "ADMIN";
    const where = isAdmin
      ? {
          OR: [{ status: { not: "DRAFT" } }, { authorId: session.user.id }],
        }
      : {
          authorId: session.user.id,
        };

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        Comment: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            email: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const postsWithContentObj = posts.map((post) => ({
      ...post,
      content:
        typeof post.content === "string"
          ? parseJsonContent(post.content)
          : post.content,
    }));

    return {
      success: true,
      msg: "Posts fetched successfully",
      postsWithContentObj,
    };
  } catch (err) {
    console.error("postList error:", err);
    return { success: false, msg: "Failed to fetch posts" };
  }
};

export const postCreate = async (_prevState, formData) => {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const title = getString(formData.get("title"));
    const postSlug = getString(formData.get("postSlug"));
    const bannerAltText = getString(formData.get("bannerAltText"));
    const metaTitle = getString(formData.get("metaTitle"));
    const metaDescription = getString(formData.get("metaDescription"));
    const canonicalUrl = getString(formData.get("canonicalUrl"));
    const bannerImage = getString(formData.get("bannerImage")) || "/banner.png";
    const contentRaw = getString(formData.get("content"));
    const parsedContent = parseJsonContent(contentRaw);

    if (!title || !postSlug || !parsedContent) {
      return { success: false, msg: "Title, slug and content are required" };
    }

    const duplicateTitle = await prisma.post.findFirst({ where: { title } });
    if (duplicateTitle) {
      return { success: false, msg: "Post with this title already exists" };
    }

    const duplicateSlug = await prisma.post.findUnique({ where: { postSlug } });
    if (duplicateSlug) {
      return {
        success: false,
        msg: "This post slug is already in use. Please choose a different one.",
      };
    }

    const isAdmin = session.user.role === "ADMIN";
    const status = normalizeCreateStatus(formData.get("status"), isAdmin);

    const created = await prisma.post.create({
      data: {
        title,
        postSlug,
        bannerImage,
        bannerAltText: bannerAltText || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        content: parsedContent,
        status,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/blog");

    return {
      success: true,
      msg: "Post created successfully",
      post: created,
    };
  } catch (err) {
    console.error("postCreate error:", err);
    return { success: false, msg: "Failed to create post" };
  }
};

export const postUpdate = async (_prevState, formData) => {
  try {
    const id = getString(formData.get("id"));
    if (!id) return { success: false, msg: "Post id is required" };

    const access = await getEditablePost(id);
    if (access.error) return access.error;

    const title = getString(formData.get("title"));
    const postSlug = getString(formData.get("postSlug"));
    const bannerImage = getString(formData.get("bannerImage"));
    const bannerAltText = getString(formData.get("bannerAltText"));
    const metaTitle = getString(formData.get("metaTitle"));
    const metaDescription = getString(formData.get("metaDescription"));
    const canonicalUrl = getString(formData.get("canonicalUrl"));
    const contentRaw = getString(formData.get("content"));

    const data = {};

    if (title) data.title = title;
    if (bannerImage) data.bannerImage = bannerImage;
    if (formData.has("bannerAltText")) data.bannerAltText = bannerAltText || null;
    if (formData.has("metaTitle")) data.metaTitle = metaTitle || null;
    if (formData.has("metaDescription")) {
      data.metaDescription = metaDescription || null;
    }
    if (formData.has("canonicalUrl")) {
      data.canonicalUrl = canonicalUrl || null;
    }

    if (postSlug) {
      const duplicateSlug = await prisma.post.findUnique({
        where: { postSlug },
        select: { id: true },
      });

      if (duplicateSlug && duplicateSlug.id !== id) {
        return {
          success: false,
          msg: "This post slug is already in use. Please choose a different one.",
        };
      }

      data.postSlug = postSlug;
    }

    if (contentRaw) {
      const parsedContent = parseJsonContent(contentRaw);
      if (!parsedContent) {
        return { success: false, msg: "Content is invalid JSON" };
      }
      data.content = parsedContent;
    }

    const normalizedStatus = normalizeUpdateStatus(
      formData.get("status"),
      access.isAdmin
    );
    if (normalizedStatus === null) {
      return { success: false, msg: "Invalid status value" };
    }
    if (normalizedStatus) {
      data.status = normalizedStatus;
    }

    if (Object.keys(data).length === 0) {
      return { success: false, msg: "Nothing to update" };
    }

    const updated = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/blog");
    revalidatePath(`/dashboard/edit-blog/${id}`);

    return { success: true, msg: "Post updated successfully", post: updated };
  } catch (err) {
    console.error("postUpdate error:", err);
    return { success: false, msg: "Failed to update post" };
  }
};

export const deletePost = async (id) => {
  try {
    const access = await getEditablePost(id);
    if (access.error) return access.error;

    const deleted = await prisma.post.delete({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/blog");

    return {
      success: true,
      msg: "Post deleted successfully",
      post: deleted,
    };
  } catch (err) {
    console.error("deletePost error:", err);
    return { success: false, msg: "Failed to delete post" };
  }
};

export const getPostById = async (id) => {
  try {
    const access = await getEditablePost(id);
    if (access.error) return access.error;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!post) return { success: false, msg: "Post not found" };

    return {
      success: true,
      msg: "Post fetched successfully",
      post: {
        ...post,
        content:
          typeof post.content === "string"
            ? parseJsonContent(post.content)
            : post.content,
      },
    };
  } catch (err) {
    console.error("getPostById error:", err);
    return { success: false, msg: "Failed to fetch post" };
  }
};

export const postUpdateStatus = async (_prevState, formData) => {
  try {
    const postId = getString(formData.get("id"));
    const access = await getEditablePost(postId);
    if (access.error) return access.error;

    const statusRaw = normalizeUpdateStatus(
      formData.get("status"),
      access.isAdmin
    );

    if (!statusRaw) {
      return { success: false, msg: "Invalid status value" };
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: statusRaw },
      select: { id: true, status: true, updatedAt: true },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/blog");

    return {
      success: true,
      msg: "Status updated successfully",
      post: updated,
    };
  } catch (err) {
    console.error("postUpdateStatus error:", err);
    return { success: false, msg: "Failed to update status" };
  }
};
