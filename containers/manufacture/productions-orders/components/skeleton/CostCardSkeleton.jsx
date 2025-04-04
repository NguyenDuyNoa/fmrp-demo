import Skeleton from "@/components/common/skeleton/Skeleton";

const CostCardSkeleton = ({ className }) => {
    return (
        <div className={`${className} flex flex-col justify-between border-[0.5px] border-[#D0D5DD] rounded-lg px-4 py-3 w-full space-y-2`}>
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-7 w-12 rounded px-1 py-1" />
            </div>
            <div className="flex items-center space-x-2">
                <Skeleton className="xl:h-8 h-7 w-52" />
            </div>
        </div>
    );
};

export default CostCardSkeleton;
