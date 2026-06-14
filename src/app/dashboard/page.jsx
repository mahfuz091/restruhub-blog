import { BlogSectionCards, SectionCards } from "@/components/section-cards";

import Blog from "@/components/Dashboard/Blog/Blog";
import { postList } from "../actions/blog/blog.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { userList } from "../actions/user/user.actions";
// Force server dynamic rendering to avoid "Dynamic server usage" build error
export const dynamic = "force-dynamic";
export default async function Page() {
  const allPost = await postList();
  const users = await userList();
  console.log("allPost", allPost);
  const session = await auth();


  if (!session) {
    redirect("/");
  }

  const isAdmin = session.user.role === "ADMIN"

  return (
    <div className=''>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <BlogSectionCards allPost={allPost?.postsWithContentObj} users={users} />

            <div className='px-4 lg:px-6'>
              {/* <ChartAreaInteractive /> */}
              <Blog allPost={allPost} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
