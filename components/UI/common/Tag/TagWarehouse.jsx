import { TickCircle } from "iconsax-react"

export const TagWarehouse = ({ data, className }) => {
    return (
        <>
            {(data?.warehouseman_id === "0" && (
                <div className={`${className} font-medium text-[#3b82f6]  rounded-2xl py-1 px-2 w-fit  bg-[#bfdbfe] text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px]`}>
                    {"Chưa duyệt kho"}
                </div>
            )) ||
                (data?.warehouseman_id != "0" && (
                    <div className={`${className} font-medium gap-1  text-lime-500   rounded-2xl py-1 px-2 w-fit  bg-lime-200 text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] flex items-center justify-center`}>
                        <TickCircle
                            className="bg-lime-500 rounded-full animate-pulse "
                            color="white"
                            size={15}
                        />
                        <span>
                            Đã duyệt kho
                        </span>
                    </div>
                ))}
        </>
    )
}