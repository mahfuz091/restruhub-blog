"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogContext } from "@/context/BlogContext";
import { Button } from "../ui/button";
import { formatToSlug } from "@/lib/utils";
import { postUpdate } from "@/app/actions/blog/blog.actions";

const EditBlogEditor = dynamic(() => import("./EditBlogEditor"), { ssr: false });

const META_TITLE_MAX = 160;
const META_DESC_MAX = 200;

export default function EditBlog({ id }) {
  const router = useRouter();
  const { blogData, setBlogData } = useContext(BlogContext);

  const [title, setTitle] = useState(blogData.title || "");
  const [slug, setSlug] = useState(blogData.postSlug || "");
  const [preview, setPreview] = useState(
    blogData.image || blogData.bannerImage || "/banner.png"
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bannerAlt, setBannerAlt] = useState(blogData.bannerAltText || "");
  const [metaTitle, setMetaTitle] = useState(blogData.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    blogData.metaDescription || ""
  );
  const [canonicalUrl, setCanonicalUrl] = useState(blogData.canonicalUrl || "");
  const fileInputRef = useRef(null);

  // Sync local form state when blogData loads/changes (async fetch in parent).
  useEffect(() => {
    setTitle(blogData.title || "");
    setSlug(blogData.postSlug || "");
    setPreview(blogData.image || blogData.bannerImage || "/banner.png");
    setBannerAlt(blogData.bannerAltText || "");
    setMetaTitle(blogData.metaTitle || "");
    setMetaDescription(blogData.metaDescription || "");
    setCanonicalUrl(blogData.canonicalUrl || "");
  }, [
    blogData.title,
    blogData.postSlug,
    blogData.image,
    blogData.bannerImage,
    blogData.bannerAltText,
    blogData.metaTitle,
    blogData.metaDescription,
    blogData.canonicalUrl,
  ]);

  const handleTitleChange = (event) => {
    const value = event.target.value;
    setTitle(value);
    setBlogData((prev) => ({ ...prev, title: value }));
  };

  const handleTitleResize = (event) => {
    const input = event.target;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tempPreview = URL.createObjectURL(file);
    setPreview(tempPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const finalUrl = data.url || tempPreview;

      setPreview(finalUrl);
      setBlogData((prev) => ({
        ...prev,
        image: finalUrl,
        bannerImage: finalUrl,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSlugChange = (event) => {
    const formatted = formatToSlug(event.target.value);
    setSlug(formatted);
    setBlogData((prev) => ({ ...prev, postSlug: formatted }));
  };

  const handleBannerAltChange = (event) => {
    const value = event.target.value;
    setBannerAlt(value);
    setBlogData((prev) => ({ ...prev, bannerAltText: value }));
  };

  const handleMetaTitleChange = (event) => {
    const value = event.target.value.slice(0, META_TITLE_MAX);
    setMetaTitle(value);
    setBlogData((prev) => ({ ...prev, metaTitle: value }));
  };

  const handleMetaDescriptionChange = (event) => {
    const value = event.target.value.slice(0, META_DESC_MAX);
    setMetaDescription(value);
    setBlogData((prev) => ({ ...prev, metaDescription: value }));
  };

  const handleCanonicalUrlChange = (event) => {
    const formatted = formatToSlug(event.target.value);
    setCanonicalUrl(formatted);
    setBlogData((prev) => ({ ...prev, canonicalUrl: formatted }));
  };

  const submitPost = async (status) => {
    if (uploading || submitting) return;

    const postId = blogData.id || id;
    if (!postId) {
      toast.error("Post id is missing");
      return;
    }

    const finalTitle = title.trim();
    const finalSlug = formatToSlug(slug || finalTitle);
    const finalContent = blogData.content;

    if (!finalTitle) {
      toast.error("Blog title is required");
      return;
    }

    if (!finalSlug) {
      toast.error("Post slug is required");
      return;
    }

    if (!finalContent?.blocks?.length) {
      toast.error("Blog content is required");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("id", String(postId));
      formData.append("title", finalTitle);
      formData.append("postSlug", finalSlug);
      formData.append("bannerAltText", bannerAlt);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("canonicalUrl", canonicalUrl || finalSlug);
      formData.append(
        "bannerImage",
        blogData.image || blogData.bannerImage || preview || "/banner.png"
      );
      formData.append("content", JSON.stringify(finalContent));
      formData.append("status", status);

      const response = await postUpdate(null, formData);

      if (!response?.success) {
        toast.error(response?.msg || "Failed to update blog");
        return;
      }

      toast.success(status === "DRAFT" ? "Draft saved" : "Blog updated");
      router.push("/dashboard/blog");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving the blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='relative rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-md transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
        Edit Blog
      </h1>

      <div
        className='relative mb-6 h-[400px] w-full cursor-pointer overflow-hidden rounded-lg border border-gray-300 transition-all duration-300 hover:ring-2 hover:ring-indigo-500 dark:border-gray-700'
        onClick={() => fileInputRef.current?.click()}
      >
        <img src={preview} alt='Blog Banner' className='h-full w-full object-cover' />
        {uploading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
            <Spin size='large' />
          </div>
        )}
      </div>

      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        onChange={handleFileChange}
      />

      <div>
        <label
          htmlFor='bannerAlt'
          className='mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300'
        >
          Banner Alt Text
        </label>
        <input
          id='bannerAlt'
          type='text'
          placeholder='Enter banner alt text'
          value={bannerAlt}
          onChange={handleBannerAltChange}
          className='mb-3 w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-3 text-sm font-semibold leading-snug text-gray-900 outline-none transition-colors duration-300 placeholder-gray-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        />
      </div>

      <div>
        <label
          htmlFor='blogTitle'
          className='mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300'
        >
          Blog Title
        </label>
        <textarea
          id='blogTitle'
          placeholder='Enter blog title'
          value={title}
          onChange={handleTitleChange}
          onInput={handleTitleResize}
          className='mb-3 w-full resize-none rounded-lg border border-gray-300 bg-transparent p-3 pl-3 text-sm font-semibold leading-snug text-gray-900 outline-none transition-colors duration-300 placeholder-gray-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        />
      </div>

      <div className='mb-4'>
        <label className='mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300'>
          Post Slug
        </label>
        <input
          type='text'
          placeholder='Enter post slug'
          value={slug}
          onChange={handleSlugChange}
          className='w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-3 text-sm font-semibold leading-snug text-gray-900 outline-none transition-colors duration-300 placeholder-gray-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        />
      </div>

      <div className='mb-1'>
        <label className='mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300'>
          Meta Title
        </label>
        <input
          type='text'
          placeholder='Enter meta title'
          value={metaTitle}
          maxLength={META_TITLE_MAX}
          onChange={handleMetaTitleChange}
          className='w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-3 text-sm font-semibold leading-snug text-gray-900 outline-none transition-colors duration-300 placeholder-gray-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        />
        <div className='mt-1 flex justify-end text-xs text-gray-500'>
          {metaTitle.length}/{META_TITLE_MAX}
        </div>
      </div>

      <div className='mb-1'>
        <label className='mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300'>
          Meta Description
        </label>
        <textarea
          placeholder='Enter meta description'
          value={metaDescription}
          maxLength={META_DESC_MAX}
          onChange={handleMetaDescriptionChange}
          rows={3}
          className='w-full resize-none rounded-lg border border-gray-300 bg-transparent p-3 pl-3 text-sm font-semibold leading-snug text-gray-900 outline-none transition-colors duration-300 placeholder-gray-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        />
        <div className='mt-1 flex justify-end text-xs text-gray-500'>
          {metaDescription.length}/{META_DESC_MAX}
        </div>
      </div>

      <div className='mb-4'>
        <label className='mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300'>
          Canonical URL
        </label>
        <input
          type='text'
          placeholder='Enter canonical URL'
          value={canonicalUrl}
          onChange={handleCanonicalUrlChange}
          className='w-full rounded-lg border border-gray-300 bg-transparent p-3 pl-3 text-sm font-semibold leading-snug text-gray-900 outline-none transition-colors duration-300 placeholder-gray-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        />
      </div>

      <EditBlogEditor preview={preview} />

      <div className='sticky bottom-4 z-40 mt-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/90 p-3 backdrop-blur md:flex-row dark:border-gray-700 dark:bg-gray-950/90'>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          disabled={uploading || submitting}
          onClick={() => submitPost("DRAFT")}
        >
          {submitting ? (
            <span className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Saving
            </span>
          ) : (
            "Save Draft"
          )}
        </Button>
        <Button
          type='button'
          className='flex-1 text-white'
          disabled={uploading || submitting}
          onClick={() => submitPost("APPROVED")}
        >
          {submitting ? (
            <span className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Updating
            </span>
          ) : (
            "Update Blog"
          )}
        </Button>
      </div>
    </div>
  );
}
