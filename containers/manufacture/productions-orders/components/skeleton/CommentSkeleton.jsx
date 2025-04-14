// components/skeleton/CommentSkeleton.jsx
import React, { forwardRef } from "react";
import Skeleton from "@/components/common/skeleton/Skeleton";

const CommentSkeleton = forwardRef(({ className, ...props }, ref) => {
    return (
        <div ref={ref} className={`${className} flex items-start gap-3 mb-4`}>
            {/* Avatar */}
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />

            {/* Nội dung */}
            <div className="flex-1 space-y-2">
                {/* Tên + thời gian */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                </div>

                {/* Nội dung comment */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-full rounded" />
                    <Skeleton className="h-5 w-2/3 rounded" />
                </div>

                {/* Hình ảnh (3 ảnh giả) */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {[1, 2, 3].map((_, i) => (
                        <Skeleton key={i} className="3xl:h-[200px] h-[180px] rounded" />
                    ))}
                </div>

                {/* Like button + lượt like */}
                <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-3 w-12 rounded" />
                </div>
            </div>
        </div>
    );
});

export default CommentSkeleton;
