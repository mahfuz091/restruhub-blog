"use client";
import { BlogContext } from "@/context/BlogContext";
import { X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { blogCategoryList } from "@/app/actions/blog/blogCategory";
import { toast } from "sonner";
import { Spin } from "antd";

const CategoryAdd = () => {
  const { blogData, setBlogData } = useContext(BlogContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // loading state

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await blogCategoryList();
      if (res.success) {
        setCategories(res.blogCategory);
      } else {
        toast.error(res.msg || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const handleCategoryToggle = (category) => {
  //   setBlogData((prev) => {
  //     const exists = prev.categories.some((c) => c.id === category.id);
  //     if (exists) {
  //       return {
  //         ...prev,
  //         categories: prev.categories.filter((c) => c.id !== category.id),
  //       };
  //     }
  //     return { ...prev, categories: [...prev.categories, category] };
  //   });
  // };
  const handleCategorySelect = (categoryId) => {
    setBlogData((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? "" : categoryId, // toggle selection
    }));
  };

  const MAX_CHAR = 200;
  const shortDesc = blogData.shortDesc || "";
  const remaining = MAX_CHAR - shortDesc.length;

  const handleDescChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR) {
      setBlogData((prev) => ({ ...prev, shortDesc: value }));
    }
  };

  return (
    <div>
      <div className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors duration-300'>
        <p className='text-gray-800 mb-2 text-lg'>Select Categories</p>

        {loading ? (
          <div className='flex justify-center items-center py-6'>
            <Spin size='large' />
          </div>
        ) : (
          <>
            <div className='flex flex-wrap gap-2'>
              {categories.map((cat) => {
                const isSelected = blogData?.categories?.some(
                  (c) => c.id === cat.id
                );
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3 py-1 rounded-full border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-transparent text-gray-800 border-gray-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* <div className='flex flex-wrap gap-2 mt-5'>
              {blogData.categories.map((cat) => (
                <span
                  key={cat.id}
                  className='flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm'
                >
                  {cat.name}
                  <X
                    size={14}
                    className='cursor-pointer'
                    onClick={() => handleCategoryToggle(cat)}
                  />
                </span>
              ))}
            </div> */}
            <div className='flex flex-wrap gap-2 mt-5'>
              {blogData.categoryId &&
                (() => {
                  const selectedCat = categories.find(
                    (cat) => cat.id === blogData.categoryId
                  );
                  if (!selectedCat) return null;

                  return (
                    <span
                      key={selectedCat.id}
                      className='flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm'
                    >
                      {selectedCat.name}
                      <X
                        size={14}
                        className='cursor-pointer'
                        onClick={() =>
                          setBlogData((prev) => ({ ...prev, categoryId: "" }))
                        }
                      />
                    </span>
                  );
                })()}
            </div>
          </>
        )}

        <div className='mt-5 hidden'>
          <textarea
            placeholder='Short Description'
            rows={4}
            value={shortDesc}
            onChange={handleDescChange}
            className='w-full resize-none mt-4 text-gray-800 placeholder-gray-800 opacity-90 border-b border-gray-400 bg-transparent pb-2 outline-none'
          />
          <div
            className={`text-sm mt-1 flex justify-end ${
              remaining === 0 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {remaining} characters remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;
