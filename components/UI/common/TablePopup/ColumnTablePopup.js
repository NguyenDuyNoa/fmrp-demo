export const ColumnTablePopup = ({ textAlign, colSpan, className, children }) => {
    return (
        <h4
            style={{
                gridColumn: `span ${colSpan ? colSpan : 1}`,
                textAlign: textAlign
            }}
            className={`${className} 3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap`}>
            {children}
        </h4>
    )
}
