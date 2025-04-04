import Skeleton from "@/components/common/skeleton/Skeleton";

const ProductInfoSkeleton = ({ className }) => {
    return (
        <div className={`${className} flex items-center size-full gap-2`}>
            <div className='flex items-start gap-2'>
                {/* Ảnh sản phẩm */}
                <Skeleton className="3xl:size-10 3xl:min-w-10 size-8 min-w-8 rounded-md shrink-0" />

                {/* Thông tin chi tiết */}
                <div className="flex flex-col 3xl:gap-1.5 gap-1">
                    <Skeleton className="h-4 w-32 rounded" /> {/* item_name */}
                    <Skeleton className="h-3 w-28 rounded" /> {/* product_variation */}
                    <Skeleton className="h-3 w-20 rounded" /> {/* item_code */}
                </div>
            </div>
        </div>
    );
};

export default ProductInfoSkeleton;
