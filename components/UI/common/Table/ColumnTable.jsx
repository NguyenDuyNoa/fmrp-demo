export const ColumnTable = ({ textAlign, colSpan, className, children }) => {
  return (
    <h4
      style={{
        gridColumn: `span ${colSpan ? colSpan : 1}`,
        textAlign: textAlign,
      }}
      className={`${className} 3xl:text-base 2xl:text-[14px] xl:text-[13.5px]  text-[11.5px] px-2 text-gray-600 capitalize  font-[600]`}
    >
      {children}
    </h4>
  );
};
