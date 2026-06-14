// "use client";

import React from "react";
import Pre from "./page";
import SeeBlog from "@/components/PreviewBlog/PreviewBlog";
import CategoryAdd from "@/components/PreviewBlog/CategoryAdd";
import { auth } from "@/auth";

const PreviewBlogContainer = async () => {
  const session = await auth();
  console.log(session, "session");
  const userId = session?.user?.id;
  return (
    <div className='w-full mx-auto py-8 flex  gap-8 px-10'>
      <div className='w-1/2'>
        <SeeBlog userId={userId} />
      </div>
      <div className='sticky top-9 w-1/2 self-start'>
        <CategoryAdd />
      </div>
    </div>
  );
};

export default PreviewBlogContainer;
