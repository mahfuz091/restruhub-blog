"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BlogSectionCards({allPost, users}) {
  const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const postsThisMonth = allPost.filter((post) => {
  const created = new Date(post.createdAt);
  return (
    created.getMonth() === currentMonth &&
    created.getFullYear() === currentYear
  );
}).length;
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2'>
      {/* Total Blog Posts */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Blog Posts</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {allPost.length}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />
              +{postsThisMonth} this month
            </Badge>
          </CardAction>
        </CardHeader>
        
      </Card>

      {/* Total Users */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {users?.length || 0}
          </CardTitle>
          <CardAction>
            
          </CardAction>
        </CardHeader>
        
      </Card>

    </div>
  );
}
