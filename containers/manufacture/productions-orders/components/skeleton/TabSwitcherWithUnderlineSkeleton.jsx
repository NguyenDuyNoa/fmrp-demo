import Skeleton from "@/components/common/skeleton/Skeleton";

const TabSwitcherWithUnderlineSkeleton = ({ className, tabCount = 3 }) => {
    return (
        <div className={`${className} relative flex border-b border-[#D0D5DD] w-full items-end gap-2`}>
            {
                Array.from({ length: tabCount }).map((_, index) => (
                    <div key={`skeleton-tab-${index}`} className="relative min-w-fit pb-2">
                        <Skeleton className="xl:h-9 h-8 w-20 rounded" />
                    </div>
                ))
            }
        </div>
    );
};

export default TabSwitcherWithUnderlineSkeleton;
