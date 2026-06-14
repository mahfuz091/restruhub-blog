"use client";
import { getPostById } from "@/app/actions/blog/blog.actions";
import EditBlog from "@/components/EditBlog/EditBlog";
import { BlogContext } from "@/context/BlogContext";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const Page =  () => {
  const { id } =  useParams();
  const { blogData, setBlogData } = useContext(BlogContext);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchBlog = async () => {
  //     setLoading(true);
  //     const result = await getPostById(id);
  //     if (result.success) {
  //       setBlogData(result.post);
  //     } else {
  //       alert(result.msg);
  //     }
  //     setLoading(false);
  //   };

  //   fetchBlog();
  // }, [id, setBlogData]);

  useEffect(() => {
  const fetchBlog = async () => {
    setLoading(true);

    const result = await getPostById(id);

    if (result?.success) {
      setBlogData((prev) => ({
        ...(result.post || prev),
        id: String(id), // ✅ ensure blogData.id is set from route param
      }));
    } else {
      alert(result?.msg || "Failed to fetch post");
    }

    setLoading(false);
  };

  if (id) fetchBlog();
}, [id, setBlogData]);
  console.log("blogData rem", blogData);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='flex  gap-4 py-4 md:gap-6 md:py-6 max-w-3xl mx-auto w-full'>
      <div className='w-full'>
        <EditBlog id={id} />
      </div>
    </div>
  );
};

export default Page;
