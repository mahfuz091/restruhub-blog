// "use client";

import React from "react";

import SeeBlog from "@/components/PreviewBlog/PreviewBlog";
import CategoryAdd from "@/components/PreviewBlog/CategoryAdd";
import { auth } from "@/auth";
import EditSeeBlog from "@/components/EditPreviewBlog/EditPreviewBlog";
import EditCategoryAdd from "@/components/EditPreviewBlog/EditCategoryAdd";

const PreviewBlogContainer = async () => {
  const session = await auth();
  // console.log(session, "session");
  const userId = session?.user?.id;
  return (
    <div className='max-w-6xl mx-auto py-8 flex  gap-8'>
      <div className='w-1/2'>
        <EditSeeBlog userId={userId} />
      </div>
      <div className='sticky top-9 w-1/2 self-start'>
        <EditCategoryAdd />
      </div>
    </div>
  );
};

export default PreviewBlogContainer;
