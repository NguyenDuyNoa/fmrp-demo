import Link from "next/link";

const LinkWarehouse = ({ warehouse_id, warehouse_name, open, color, colSpan, disbleClick = false }) => {
    const wordsArray = warehouse_name?.split(" ");
    return (
        <h6 style={{ gridColumn: `span ${colSpan || 1}` }} className="font-medium text-[9px] text-zinc-600  text-left">
            {
                disbleClick
                    ?
                    <div
                        className={`${open
                            ? "responsive-text-sm"
                            : "responsive-text-base" || wordsArray?.length > 4
                                ? "responsive-text-sm"
                                : "responsive-text-base"
                            } ${color
                                ? `${color} `
                                : "text-sky-700  transition-all duration-200 ease-linear"
                            } font-semibold `}
                    >
                        {warehouse_name}
                    </div>
                    :
                    <Link
                        href={`/warehouses/warehouse/${warehouse_id}`}
                        className={`${open
                            ? "responsive-text-sm"
                            : "responsive-text-base" || wordsArray?.length > 4
                                ? "responsive-text-sm"
                                : "responsive-text-base"
                            } ${color
                                ? `${color} hover:text-green-500`
                                : "text-sky-700 hover:text-sky-500 transition-all duration-200 ease-linear"
                            } font-semibold `}
                    >
                        {warehouse_name}
                    </Link>
            }
        </h6>
    );
};
export default LinkWarehouse;
