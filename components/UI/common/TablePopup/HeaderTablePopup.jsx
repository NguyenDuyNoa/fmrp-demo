export const HeaderTablePopup = ({ children, className, gridCols, display }) => {
    return (
        <div
            style={{
                display: display ? display : "grid",
                gridTemplateColumns: `repeat(${gridCols ? gridCols : 12}, minmax(0, 1fr))`
            }}
            className={`${className}  items-center sticky top-0 bg-slate-100 p-2 z-10 rounded-t-xl shadow-sm headerTablePopup`}>
            {children}
        </div>
    )
}
