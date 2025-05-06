import { twMerge } from "tailwind-merge";
export const ColumnTable = ({ textAlign, colSpan, className, children }) => {
  // Điều chỉnh colSpan cho hệ thống lưới mới
  // Với lưới mới, mỗi cột đầy đủ chiếm 2 cột nhỏ, cột 0.5 chiếm 1 cột nhỏ
  const adjustedColSpan = colSpan === 0.5 ? 1 : (colSpan ? colSpan * 2 : 2);
  
  return (
    <h4
      style={{
        gridColumn: `span ${adjustedColSpan}`,
        textAlign: textAlign,
      }}
      className={twMerge(
        ` 3xl:text-base 2xl:text-sm xl:text-xs text-[11.5px] px-2 text-neutral-02 font-semibold `,
        className
      )}
    >
      {children}
    </h4>
  );
};
