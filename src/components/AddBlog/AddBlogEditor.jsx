"use client";

import { useEffect, useRef, useContext } from "react";
import editorTools from "@/components/AddBlog/editorTools";
import { BlogContext } from "@/context/BlogContext";

export default function AddBlogEditor({ preview }) {
  const { blogData, setBlogData } = useContext(BlogContext);
  const editorRef = useRef(null);

  useEffect(() => {
    let editorInstance;

    const initEditor = async () => {
      if (typeof window === "undefined") return;

      const EditorJS = (await import("@editorjs/editorjs")).default;

      if (!editorRef.current) {
        editorInstance = new EditorJS({
          holder: "editorjs",
          placeholder: "Write your awesome story here...",
          tools: editorTools,
          data: blogData.content || {},
          onChange: async () => {
            try {
              const savedData = await editorInstance.save();
              setBlogData((prev) => ({
                ...prev,
                content: savedData,
                image: prev.image || preview || "/banner.png",
              }));
            } catch (err) {
              console.error("EditorJS save error:", err);
            }
          },
        });

        editorRef.current = editorInstance;
      }
    };

    initEditor();
  }, [preview, setBlogData, blogData.content]);

  return (
    <div
      id='editorjs'
      className='prose lg:prose-xl mt-6 text-gray-800 border-b border-gray-300 placeholder:text-black !pb-4 '
    />
  );
}
