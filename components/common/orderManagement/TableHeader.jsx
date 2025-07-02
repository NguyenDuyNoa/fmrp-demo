const TableHeader = ({ className, children }) => {
  return (
    <h4
      className={`3xl:text-sm 3xl:font-semibold 2xl:text-xs xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize truncate font-normal whitespace-nowrap ${className}`}
    >
      {children}
    </h4>
  )
}

export default TableHeader
