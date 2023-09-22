import { TiDeleteOutline } from "react-icons/ti";

const BtnClickDeleteItem = ({ dataBe, HandleCheckAll, type, parent, dataEmty, sDataEmty }) => {
    return (
        <>
            {dataBe?.length > 0 && (
                <div className="mx-0.5">
                    <button
                        onClick={() => HandleCheckAll(type, parent, dataEmty, sDataEmty)}
                        class="focus:outline-red-500  outline border-teal-600 outline-1 shadow outline-gray-50 hover:bg-teal-600 hover:text-white
                         border w-full transition-all duration-200 ease-linear p-2 rounded text-sm font-medium hover:border-gray-200 flex items-center justify-center gap-2"
                    >
                        <TiDeleteOutline size={18} /> Bỏ chọn tất cả
                    </button>
                </div>
            )}
        </>
    );
};
export default BtnClickDeleteItem;
