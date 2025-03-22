import React, { useState } from 'react'
import PopupCustom from "@/components/UI/popup";
import { IoMdUndo } from 'react-icons/io';

const initialState = {
    open: false,

}

const PopupRecallRawMaterials = ({ dataLang, dataRight, refetch: refetchMainTable }) => {
    const [isState, setState] = useState(initialState);

    const queryState = (data) => setState((prev) => ({ ...prev, ...data }));


    return (
        <PopupCustom
            title={<p>Thu Hồi Nguyên Vật Liệu <span className="text-blue-500">(Số lệnh sản xuất: {dataRight?.listDataRight?.title})</span></p>}
            button={
                <div className="flex items-center gap-2 px-3 py-2 ">
                    <IoMdUndo className="text-base text-white" />
                    <h3 className="text-xs font-medium text-white 3xl:text-base">
                        Thu hồi NVL
                    </h3>
                </div>
            }
            onClickOpen={() => {
                queryState({ open: true });
            }}
            lockScroll={true}
            open={isState.open}
            onClose={() => {
                queryState({ open: false });
            }}
            classNameBtn={`rounded-lg bg-[#FF8F0D]`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            <div className={`w-[70vw] xl:h-[80vh] h-[575px] overflow-hidden `}>
            </div>
        </PopupCustom>
    )
}

export default PopupRecallRawMaterials