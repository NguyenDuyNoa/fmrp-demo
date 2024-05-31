export const ColumnTable = ({ textAlign, colSpan, className, children }) => {
    return (
        <h4
            style={{
                gridColumn: `span ${colSpan ? colSpan : 1}`,
                textAlign: textAlign
            }}
            className={`${className} 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]`}>
            {children}
        </h4>
    )
}
