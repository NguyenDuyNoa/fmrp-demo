export const ColumnTable = ({ textAlign, colSpan, className, children }) => {
    return (
        <h4
            style={{
                gridColumn: `span ${colSpan ? colSpan : 1}`,
                textAlign: textAlign
            }}
            className={`${className} 2xl:text-[13px] xl:text-[12.5px]  text-[11.5px] px-2 text-gray-600 capitalize  font-[600]`}>
            {children}
        </h4>
    )
}
