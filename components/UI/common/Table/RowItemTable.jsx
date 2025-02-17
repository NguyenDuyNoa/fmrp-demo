export const RowItemTable = ({ children, className, colSpan, textColor, textAlign, textSize, backgroundColor }) => {
    return (
        <h6
            style={{
                gridColumn: `span ${colSpan ? colSpan : 1}`,
                textAlign: textAlign,
                color: `${textColor ? textColor : "#52525b"}`,
                backgroundColor: backgroundColor || '',
            }}
            className={`${className} 
            ${textSize ? textSize : "3xl:text-base 2xl:text-[13px] xl:text-[13px]  text-[11px]  font-medium"} px-2`}>
            {children}
        </h6>
    )
}