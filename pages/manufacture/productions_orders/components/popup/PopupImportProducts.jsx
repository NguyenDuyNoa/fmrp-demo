import { useEffect, useState } from "react";
import PopupEdit from "/components/UI/popup";

import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { Customscrollbar } from "@/components/UI/common/customscrollbar";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/tablePopup";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import NoData from "@/components/UI/noData/nodata";
import useToast from "@/hooks/useToast";
import { isAllowedNumber } from "@/utils/helpers/common";
import { SelectCore, componentsCore } from "@/utils/lib/Select";
import { Trash as IconDelete } from "iconsax-react";
import { v4 as uuid } from "uuid";
const PopupImportProducts = ({ data, id, quantityError, queryStateQlty, ...props }) => {
    const isShow = useToast();

    const initilaState = {
        open: false,

    };

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));



    return (
        <PopupEdit
            title={"Nhập thành phẩm"}
            button={props.children}
            onClickOpen={() => {
                queryState({ open: true });

            }}
            lockScroll={true}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={`${props?.className}`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            <div className="3xl:w-[1100px] 2xl:w-[800px] xl:w-[700px] w-[600px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                <div className="w-full">

                </div>
                {/* <div className="flex justify-end items-center">
                    <ButtonSubmit loading={false} onClick={() => handeSave()} dataLang={props.dataLang} />
                </div> */}
            </div>
        </PopupEdit>
    );
};
export default PopupImportProducts;
