import { useState } from "react";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import PopupEdit from "@/components/UI/popup";
import useToast from "@/hooks/useToast";
import Image from "next/image";

const PopupPurchase = (props) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("e", e);
    }
    return (
        <>
            <PopupEdit
                title={'Thêm khách hàng mua hàng'}
                button={
                    <button
                        className=" bg-[#F3F4F6] rounded-lg  outline-none focus:outline-none"
                        onClick={() => {
                            if (+props.dataTable?.countAll == 0) {
                                return isShow('error', 'Vui lòng thêm kế hoạch sản xuất')
                            }
                            _ToggleModal(true)
                        }}
                    >
                        <div className="flex items-center gap-2 py-2 px-3 ">
                            <Image height={16} width={16} src={props.icon} className="object-cover" />
                            <h3 className="text-[#141522] font-medium 3xl:text-base text-xs">
                                {props.title}
                            </h3>
                        </div>
                    </button>
                }
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="mt-4">
                    <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                    <div className="3xl:w-[1300px] 2xl:w-[1150px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                        <Customscrollbar className="h-[420px]">

                        </Customscrollbar>
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e)}
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};

export default PopupPurchase