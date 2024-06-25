import { Edit as IconEdit } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";

import apiLocationWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouseLocation/apiWarehouseLocation";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import PopupEdit from "@/components/UI/Popup";
import useToast from "@/hooks/useToast";

const Popup_Vitrikho = (props) => {
    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const isShow = useToast();

    const [onSending, sOnSending] = useState(false);

    const [khoOpt, sListkho] = useState([]);

    const [name, sName] = useState("");

    const [code, sCode] = useState("");

    const [errInputCode, sErrInputCode] = useState(false);

    const [errInputName, sErrInputName] = useState(false);

    const [errInputKho, sErrInputKho] = useState(false);

    const [valuekho, sValuekho] = useState(null);

    useEffect(() => {
        sErrInputKho(false);
        sErrInputCode(false);
        sErrInputName(false);
        sName(props.name ? props.name : "");
        sCode(props.code ? props.code : "");
        sListkho(props.isState.listWarehouse || []);
        sValuekho(
            props.id
                ? {
                    label: props.warehouse_name,
                    value: props.warehouse_id,
                }
                : null
        );
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "valuekho") {
            sValuekho(value);
        } else if (type == "code") {
            sCode(value.target?.value);
        }
    };
    const _ServerSending = async () => {
        const id = props.id;
        let data = new FormData();
        data.append("name", name ? name : "");
        data.append("code", code ? code : "");
        data.append("warehouse_id", valuekho?.value ? valuekho?.value : "");
        const url = props.id
            ? `/api_web/api_warehouse/location/${id}?csrf_protection=true`
            : "/api_web/api_warehouse/location/?csrf_protection=true";
        try {
            const { isSuccess, message } = await apiLocationWarehouse.apiHandingLocation(url, data);
            if (isSuccess) {
                isShow("success", `${props.dataLang[message]}`);
                props.onRefresh && props.onRefresh();
                sOpen(false);
                sErrInputCode(false);
                sErrInputName(false);
                sErrInputKho(false);
                sName("");
                sCode("");
                sValuekho(null);
            } else {
                isShow("error", `${props.dataLang[message]}`);
            }
        } catch (error) { }
        sOnSending(false);
    };

    //da up date
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (code.length == 0 || valuekho?.length == 0 || name.length == 0 || valuekho == null) {
            code?.length == 0 && sErrInputCode(true);

            name?.length == 0 && sErrInputName(true);

            valuekho?.length == 0 && sErrInputKho(true);

            valuekho == null && sErrInputKho(true);

            isShow("error", `${props.dataLang?.required_field_null}`);
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrInputCode(false);
    }, [code?.length > 0]);

    useEffect(() => {
        sErrInputName(false);
    }, [name?.length > 0]);

    useEffect(() => {
        sErrInputKho(false);
    }, [valuekho?.length > 0, valuekho != null]);

    return (
        <>
            <PopupEdit
                title={
                    props.id
                        ? `${props.dataLang?.warehouses_localtion_edit}`
                        : `${props.dataLang?.warehouses_localtion_add}`
                }
                button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="mt-4">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        <Customscrollbar className="h-[280px]">
                            <div className="w-[30vw] ">
                                <div className="flex flex-wrap justify-between ">
                                    <div className="w-full">
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.warehouses_localtion_code}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={code}
                                                onChange={_HandleChangeInput.bind(this, "code")}
                                                placeholder={props.dataLang?.warehouses_localtion_code}
                                                name="fname"
                                                type="text"
                                                className={`${errInputCode
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputCode && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.warehouses_localtion_errCode}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.warehouses_localtion_NAME}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={name}
                                                onChange={_HandleChangeInput.bind(this, "name")}
                                                placeholder={props.dataLang?.warehouses_localtion_NAME}
                                                name="fname"
                                                type="text"
                                                className={`${errInputName
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputName && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.warehouses_localtion_errName}
                                                </label>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.warehouses_localtion_ware}{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                placeholder={props.dataLang?.warehouses_localtion_ware}
                                                options={khoOpt}
                                                isSearchable={true}
                                                onChange={_HandleChangeInput.bind(this, "valuekho")}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                value={valuekho}
                                                maxMenuHeight="200px"
                                                isClearable={true}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                styles={{
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: "#cbd5e1",
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                    control: (provided) => ({
                                                        ...provided,
                                                        border: "1px solid #d0d5dd",
                                                        "&:focus": {
                                                            outline: "none",
                                                            border: "none",
                                                        },
                                                    }),
                                                }}
                                                className={`${errInputKho ? "border-red-500" : "border-transparent"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                            />
                                            {errInputKho && (
                                                <label className="mb-2  text-[14px] text-red-500">
                                                    {props.dataLang?.warehouses_localtion_errWare}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </form>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_Vitrikho;
