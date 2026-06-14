"use client";

import React, { useEffect, useState } from "react";
import { Table, Space } from "antd";
import { Edit2, Trash2 } from "lucide-react";
import { CreateSheet } from "./CreateSheet";
import {
  blogCategoryList,
  deleteBlogCategory,
} from "@/app/actions/blog/blogCategory";
import { toast } from "sonner";
import { EditCategorySheet } from "./EditCategorySheet";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await blogCategoryList();
    if (res.success) {
      setCategories(res.blogCategory);
    } else {
      toast.error(res.msg || "Failed to fetch categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const res = await deleteBlogCategory(id);
    if (res.success) {
      toast.success(res.msg || "Category deleted!");
      fetchCategories();
    } else {
      toast.error(res.msg || "Failed to delete category");
    }
  };

  const columns = [
    {
      title: "SL No",
      key: "serial",
      render: (_, __, index) => index + 1, 
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "N/A", 
    },
    {
  title: "Actions",
  key: "actions",
  render: (_, record) => (
    <Space>
      <EditCategorySheet
        category={record}
        onCategoryUpdated={fetchCategories}
      />
      <Trash2
        className="w-4 h-4 text-red-500 cursor-pointer"
        onClick={() => handleDelete(record.id)}
      />
    </Space>
  ),
}

  ];

  return (
    <div className="mx-5 mt-10 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Categories{" "}
          <span className="">
            ({categories.length})
          </span>
        </h2>
        <CreateSheet onCategoryCreated={fetchCategories} />
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        bordered={false}
      />
    </div>
  );
};

export default AddCategory;
