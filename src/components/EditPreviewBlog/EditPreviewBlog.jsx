"use client";

import { startTransition, useContext } from "react";
import { BlogContext } from "@/context/BlogContext";
import { ArrowLeft, ArrowUpRight, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { postCreate, postUpdate } from "@/app/actions/blog/blog.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EditSeeBlog = ({ userId }) => {
  const router = useRouter();
  const { blogData, setBlogData } = useContext(BlogContext);
  console.log("blogData:", blogData);

  if (!blogData) return <p>No blog data available</p>;

  const renderItem = (item) => {
    if (typeof item === "string") return item;

    if (typeof item === "object") {
      if ("content" in item) return item.content;
      if ("text" in item) return item.text;
      return JSON.stringify(item);
    }

    return String(item);
  };

  const renderBlock = (block, index) => {
    if (!block?.type || !block?.data) return null;

    switch (block.type) {
      case "header": {
        const HeaderTag = `h${block.data.level || 2}`;
        return (
          <HeaderTag key={index} className='my-4 font-bold text-black'>
            {block.data.text}
          </HeaderTag>
        );
      }

      case "paragraph":
        return (
          <p key={index} className='my-2 text-gray-800 leading-relaxed'>
            {block.data.text}
          </p>
        );

      case "list": {
        const items = block.data?.items || [];

        if (block.data.style === "ordered") {
          return (
            <ol key={index} className='list-decimal my-2'>
              {items.map((item, i) => (
                <li key={i}>{renderItem(item)}</li>
              ))}
            </ol>
          );
        } else if (block.data.style === "checklist") {
          return (
            <ul key={index} className='my-2'>
              {items.map((item, i) => (
                <li key={i} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={item?.meta?.checked ?? false}
                    readOnly
                    className='w-4 h-4'
                  />
                  <span>{renderItem(item)}</span>
                </li>
              ))}
            </ul>
          );
        } else {
          return (
            <ul key={index} className='my-2'>
              {items.map((item, i) => (
                <li key={i} className='flex mt-4 gap-2'>
                  <CircleCheckBig /> {renderItem(item)}
                </li>
              ))}
            </ul>
          );
        }
      }

      case "image":
        return block.data?.file?.url ? (
          <div key={index} className='my-4'>
            <img
              src={block.data.file.url}
              alt={block.data.caption || "Blog Image"}
              className='w-full rounded-md object-cover'
            />
            {block.data.caption && (
              <p className='text-sm text-white mt-2'>{block.data.caption}</p>
            )}
          </div>
        ) : null;

      case "quote":
        return (
          <blockquote
            key={index}
            className='border-l-4 border-gray-300 pl-4 italic my-4'
          >
            {block.data.text}
            {block.data.caption && (
              <cite className='block mt-1'>— {block.data.caption}</cite>
            )}
          </blockquote>
        );

      case "code":
        return (
          <pre
            key={index}
            className='bg-gray-100 rounded p-3 overflow-x-auto my-4 font-mono text-sm'
          >
            {block.data.code}
          </pre>
        );

      case "table":
        return (
          <div key={index} className='overflow-x-auto my-4'>
            <table className='table-auto border-collapse border border-gray-300 w-full'>
              <tbody>
                {block.data?.content?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className='border border-gray-300 p-2'>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  // const handlePublish = (e) => {
  //   e.preventDefault();

  //   const formData = {
  //     title: blogData.title,
  //     shortDesc: blogData.shortDesc,
  //     image: blogData.image,
  //     content: JSON.stringify(blogData.content),
  //     blogCategoryId: blogData.categoryId,
  //     authorId: userId,
  //   };

  //   console.log("Publishing blog data:", formData);

  //   setBlogData({
  //     title: "",
  //     shortDesc: "",
  //     content: null,
  //     image: "/banner.png",
  //     categories: [],
  //   });
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", blogData.id);
    formData.append("title", blogData.title);
    formData.append("shortDesc", blogData.shortDesc);
    formData.append("bannerImage", blogData.image);
    formData.append("authorId", userId);
    formData.append("blogCategoryId", blogData.categoryId || blogData.blogCategoryId);
formData.append("blogCategoryId", blogData.categoryId);
    // Append content blocks as JSON string
    formData.append("content", JSON.stringify(blogData.content));
    // ✅ NEW: SEO + Slug fields
  formData.append("postSlug", blogData.postSlug);
  formData.append("metaTitle", blogData.metaTitle);
  formData.append("metaDescription", blogData.metaDescription);
  formData.append("canonicalUrl", blogData.canonicalUrl);
  formData.append("bannerAltText", blogData.bannerAltText); 

    startTransition(async () => {
      try {
        const response = await postUpdate(null, formData);
        console.log("response:", response);

        if (response?.success) {
          toast.success(response.msg);
          router.push("/dashboard");
          setBlogData({
           title: "",
          shortDesc: "",
          content: null,
          image: "/banner.png",
          categories: [],
          postSlug: "",
          metaTitle: "",
          metaDescription: "",
          canonicalUrl: "",
          bannerAltText: "",
          });
        } else {
          toast.error(response?.msg || "Failed to publish blog");
        }
      } catch (err) {
        console.error("publish error:", err);
        toast.error("Server error while publishing blog");
      }
    });
  };

  console.log("blogData for preview:", blogData);
  return (
    <form
      onSubmit={handleUpdate}
      className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors duration-300'
    >
      <input type='hidden' name='title' value={blogData.title} />
      <input type='hidden' name='shortDesc' value={blogData?.shortDesc || ""} />
      <input type='hidden' name='image' value={blogData.image} />
      <input type='hidden' name='blogCategoryId' value={blogData.categoryId || blogData.blogCategoryId} />
      <input
        type='hidden'
        name='content'
        value={JSON.stringify(blogData.content)}
      />
      <input type="hidden" name="postSlug" value={blogData.postSlug || ""} />
<input type="hidden" name="metaTitle" value={blogData.metaTitle || ""} />
<input type="hidden" name="metaDescription" value={blogData.metaDescription || ""} />
<input type="hidden" name="canonicalUrl" value={blogData.canonicalUrl || ""} />
<input type="hidden" name="bannerAltText" value={blogData.bannerAltText || ""} />
      {blogData.categories?.map((cat, i) => (
        <input key={i} type='hidden' name='categories' value={cat?.id} />
      ))}

      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-xl font-bold'>Preview</h3>
        {/* <Link href={`/dashboard/edit-blog/${blogData.id}`}>
          <Button type='button' className='w-full'>
            <ArrowLeft /> Back to Edit
          </Button>
        </Link> */}
      </div>

      {blogData.bannerImage && (
        <img
          src={blogData.bannerImage}
          alt={blogData.title}
          className='w-full h-[400px] object-cover mb-6 border border-white/10 rounded-lg'
        />
      )}

      {blogData.categories?.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {blogData.categories.map((cat, i) => (
            <span key={i} className='blog-card-category'>
              {cat.name}
            </span>
          ))}
        </div>
      )}

      <h1 className='text-3xl font-bold mb-6'>{blogData.title}</h1>

      {blogData.shortDesc && (
        <p className='text-gray-800 mb-4'>{blogData.shortDesc}</p>
      )}

      {blogData.content?.blocks?.map((block, index) =>
        renderBlock(block, index)
      )}
<div  className="fixed bottom-6 right-20 -translate-x-1/2 z-50 w-[min(420px,calc(100%-24px))]">
      <div className='mt-6 flex justify-end'>
        <Button type='submit' className='w-full'>
          Publish Now
          <ArrowUpRight />
        </Button>
      </div>
      </div>
    </form>
  );
};

export default EditSeeBlog;
