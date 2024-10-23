import { TiDeleteOutline } from "react-icons/ti";

const BtnClickDeleteItem = ({ dataBe, HandleCheckAll, type, parent, dataEmty, sDataEmty }) => {
    return (
        <>
            {dataBe?.length > 0 && (
                <div className="mx-0.5">
                    <button
                        onClick={() => HandleCheckAll(type, parent, dataEmty, sDataEmty)}
                        className="focus:outline-white  outline border-teal-600 outline-1 shadow outline-gray-50 hover:bg-teal-600 hover:text-white
                         border w-full transition-all duration-200 ease-linear p-2 rounded 3xl:text-[14px] xxl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] font-medium hover:border-gray-200 flex items-center justify-center gap-2"
                    >
                        <TiDeleteOutline size={18} /> Bỏ chọn tất cả
                    </button>
                </div>
            )}
        </>
    );
};
export default BtnClickDeleteItem;
