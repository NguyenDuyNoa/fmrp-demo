import { TiInputChecked } from "react-icons/ti";

const BtnClickAddItem = ({ dataBe, HandleCheckAll, type, parent, dataEmty, sDataEmty }) => {
    return (
        <>
            {dataBe?.length > 0 && (
                <div className="mx-0.5">
                    <button
                        onClick={() => HandleCheckAll(type, parent, dataEmty, sDataEmty)}
                        class="focus:outline-red-500 outline outline-1 shadow outline-gray-50 hover:bg-red-600 flex items-center justify-center gap-2
                        hover:text-white border-red-400 border hover:border-red-600 w-full transition-all duration-200 ease-linear p-2 rounded text-sm font-medium "
                    >
                        <TiInputChecked size={18} /> Chọn tất cả
                    </button>
                </div>
            )}
        </>
    );
};
export default BtnClickAddItem;
