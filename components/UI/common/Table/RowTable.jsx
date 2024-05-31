export const RowTable = ({ children, gridCols, className }) => {
    return (
        <h6
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols ? gridCols : 12}, minmax(0, 1fr))`
            }}
            className={`${className} relative grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40`}>
            {children}
        </h6>
    )
}