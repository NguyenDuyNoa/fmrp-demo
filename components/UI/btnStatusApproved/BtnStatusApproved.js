import { TickCircle } from "iconsax-react"

const BtnStatusApproved = ({ onClick, title, type, className }) => {
    const STATUS_APPROVED = "Đã Duyệt"
    const STATUS_UNAPPROVED = "Chưa Duyệt"
    return <div
        className={`${className} cursor-pointer 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 
        3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] 
        lg:h-5
        ${type == "0" && "border-red-500 text-red-500 hover:bg-red-500"}
        ${type == "1" && "border-[#00aa59] text-[#00aa59] hover:bg-[#00aa59]"}
        ${type == "2" && "border-sky-500 text-sky-500 hover:bg-sky-500"}
        ${type == "3" && " border-orange-400 text-white bg-orange-500 hover:bg-orange-600 !h-10"}
        transition-all duration-300 ease-in-out  hover:text-white border 3xl:px-0.5 py-1 rounded-md  font-normal flex justify-center items-center gap-1`}
        onClick={onClick}
    >   {
            title ? title : type == "1" ? STATUS_APPROVED : STATUS_UNAPPROVED
        }
        <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3" />
    </div>
}
export default BtnStatusApproved