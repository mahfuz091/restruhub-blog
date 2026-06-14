"use client";

import React, { useMemo, useState } from "react";
import { Table, Space, Dropdown, Popconfirm, Tag } from "antd";
import {
  MessageOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import {
  deletePost,
  postUpdateStatus,
} from "@/app/actions/blog/blog.actions";

const BlogTable = ({ allPost, isAdmin = false }) => {
  const [loadingRowId, setLoadingRowId] = useState(null);

  const [pageSize, setPageSize] = useState(50);
const [current, setCurrent] = useState(1);

  const handleDelete = async (id) => {
    try {
      setLoadingRowId(id);
      const res = await deletePost(id);
      if (res?.success) {
        toast.success(res.msg || "Deleted");
        window.location.reload();
      } else {
        toast.error(res?.msg || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting the post");
    } finally {
      setLoadingRowId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setLoadingRowId(id);

      const fd = new FormData();
      fd.append("id", id);
      fd.append("status", status); // DRAFT | PENDING | APPROVED | DECLINE

      const res = await postUpdateStatus(null, fd);

      if (res?.success) {
        toast.success(res.msg || "Status updated");
        window.location.reload();
      } else {
        toast.error(res?.msg || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating status");
    } finally {
      setLoadingRowId(null);
    }
  };

  const statusTag = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "APPROVED") return <Tag color='green'>APPROVED</Tag>;
    if (s === "PENDING") return <Tag color='gold'>PENDING</Tag>;
    if (s === "DECLINE") return <Tag color='red'>DECLINE</Tag>;
    return <Tag>Draft</Tag>;
  };

  const getMenuItems = (record) => {
    const items = [
      {
        key: "edit",
        label: (
          <Link href={`/dashboard/edit-blog/${record.id}`}>
            <EditOutlined className='mr-2 text-blue-600' />
            Edit
          </Link>
        ),
      },
      {
        key: "status",
        label: "Change Status",
        children: [
          {
            key: "status_draft",
            label: (
              <span onClick={() => handleStatusChange(record.id, "DRAFT")}>
                Set Draft
              </span>
            ),
          },
          {
            key: "status_pending",
            label: (
              <span onClick={() => handleStatusChange(record.id, "PENDING")}>
                Set Pending
              </span>
            ),
          },
          ...(isAdmin
            ? [
                {
                  key: "status_approved",
                  label: (
                    <span
                      onClick={() => handleStatusChange(record.id, "APPROVED")}
                    >
                      Approve
                    </span>
                  ),
                },
                {
                  key: "status_decline",
                  label: (
                    <span
                      onClick={() => handleStatusChange(record.id, "DECLINE")}
                    >
                      Decline
                    </span>
                  ),
                },
              ]
            : []),
        ],
      },
      {
        key: "delete",
        label: (
          <Popconfirm
            title='Are you sure you want to delete this post?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <span>
              <DeleteOutlined className='mr-2 text-red-600' />
              Delete
            </span>
          </Popconfirm>
        ),
      },
    ];

    return items;
  };

  const columns = useMemo(
    () => [
      {
        title: "Author",
        dataIndex: "author",
        key: "author",
        render: (author) => (
          <Space>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={author?.profileImage} alt='' />
            </Avatar>
            <span>{author?.name}</span>
          </Space>
        ),
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (title) => <span className='font-medium'>{title}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => statusTag(status),
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) =>
          new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        title: "Comments",
        key: "comments",
        render: (_, record) => (
          <Space>
            <span>
              <MessageOutlined className='mr-1' />
              {record?.Comment?.length ?? 0}
            </span>
          </Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Dropdown
            menu={{ items: getMenuItems(record) }}
            trigger={["click"]}
            placement='bottomRight'
          >
            <MoreOutlined
              className={`text-xl cursor-pointer ${
                loadingRowId === record.id ? "opacity-50 pointer-events-none" : ""
              }`}
            />
          </Dropdown>
        ),
      },
    ],
    [isAdmin, loadingRowId]
  );

  return (
    <div className='py-6'>
      <Table
        dataSource={allPost?.postsWithContentObj || []}
        columns={columns}
        rowKey='id'
        loading={!!loadingRowId}
        pagination={{
  current,
  pageSize,
  total: allPost?.postsWithContentObj?.length || 0,
  showSizeChanger: true,
  pageSizeOptions: ["50", "100", "150"],
  defaultPageSize: 50,
  onChange: (page, size) => {
    setCurrent(page);
    setPageSize(size);
  },
}}
        bordered={false}
      />
    </div>
  );
};

export default BlogTable;