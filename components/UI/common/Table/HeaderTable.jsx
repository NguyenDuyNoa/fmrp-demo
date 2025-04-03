export const HeaderTable = ({ ref, children, className, gridCols, display }) => {
    return (
        <div
            ref={ref}
            style={{
                display: display ? display : "grid",
                gridTemplateColumns: `repeat(${gridCols ? gridCols : 12}, minmax(0, 1fr))`,
            }}
            className={`
            ${className} 
             items-center sticky top-0 bg-white p-2 z-[999] shadow-sm  divide-x`}
        >
            {children}
        </div>
    );
};
