import Skeleton from "@/components/common/skeleton/Skeleton";

const ProductionStepsSkeleton = ({ count = 3 }) => {
    return (
        <div className="3xl:pl-4 pl-2 3xl:py-4 py-2">
            {
                Array.from({ length: count }).map((_, index) => (
                    <div key={`skeleton-step-${index}`} className={`grid 3xl:grid-cols-8 grid-cols-14 relative`}>
                        {/* Cột thời gian */}
                        <div className='3xl:col-span-1 col-span-2 w-full relative'>
                            <div className="absolute -top-2 left-0 w-full h-full">
                                <div className="flex flex-col gap-0.5 mt-2">
                                    <Skeleton className="xl:h-3 h-2.5 xxl:w-10 xl:w-7 w-5" />
                                    <Skeleton className="xl:h-2 h-1.5 xxl:w-8 xl:w-5 w-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* Dot + line */}
                        <div className="col-span-1 flex flex-col items-center mr-2 relative h-full">
                            <div className="3xl:size-4 size-3.5 rounded-full border-2 border-[#D0D5DD] bg-white" />
                            {
                                Array.from({ length: count }).length - 1 !== index &&
                                <div className="w-[2px] flex-1 bg-[#D0D5DD]" />
                            }
                        </div>

                        {/* Nội dung công đoạn */}
                        <div className='3xl:col-span-6 col-span-11 min-h-[40px] pb-2'>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <div className="flex flex-wrap gap-2 mt-1">
                                <Skeleton className="xxl:h-6 h-5 w-40 rounded-md" />
                                <Skeleton className="xxl:h-6 h-5 w-36 rounded-md" />
                                <Skeleton className="xxl:h-6 h-5 w-16 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default ProductionStepsSkeleton;
