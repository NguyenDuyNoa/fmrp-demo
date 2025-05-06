import { twMerge } from "tailwind-merge";

export const HeaderTable = ({ ref, children, className, gridCols, display }) => {
    // Điều chỉnh gridTemplateColumns để hỗ trợ các cột có kích thước 0.5
    const gridTemplateColumnsValue = gridCols 
        ? `repeat(${gridCols * 2}, minmax(0, 0.5fr))` 
        : `repeat(24, minmax(0, 0.5fr))`;
        
    return (
        <div
            ref={ref}
            style={{
                display: display ? display : "grid",
                gridTemplateColumns: gridTemplateColumnsValue,
            }}
            // className={`
            // ${className} 
            //  items-center sticky top-0 bg-white p-2 z-[999] shadow-sm  divide-x`}
            className={twMerge("items-center sticky top-0 bg-white p-2 z-[999] border-b border-[#F3F3F4]", className)}
        >
            {children}
        </div>
    );
};
