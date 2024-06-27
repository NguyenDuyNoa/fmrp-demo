import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import Select from "react-select";

import {
    Edit as IconEdit
} from "iconsax-react";


import apiComons from "@/Api/apiComon/apiComon";
import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import PopupCustom from "@/components/UI/popup";
import useToast from "@/hooks/useToast";

const Popup_kho = (props) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [brandpOpt, sListBrand] = useState([]);

    const [name, sName] = useState("");

    const [code, sCode] = useState("");

    const [address, sAddress] = useState("");

    const [note, sNote] = useState("");

    const [errInputCode, sErrInputCode] = useState(false);

    const [errInputName, sErrInputName] = useState(false);

    const [errInputAddress, sErrInputAddress] = useState(false);

    const [errInputBr, sErrInputBr] = useState(false);

    const [valueBr, sValueBr] = useState([]);

    useEffect(() => {
        sErrInputBr(false);
        sErrInputCode(false);
        sErrInputName(false);
        sErrInputAddress(false);
        sName(props.name ? props.name : "");
        sCode(props.code ? props.code : "");
        sAddress(props.address ? props.address : "");
        sNote(props.note ? props.note : "");
        sValueBr(
            props.branch
                ? [
                    ...props.branch?.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                ]
                : []
        );
    }, [open]);

    const checkId =
        props?.id &&
        props.branch?.reduce((obj, e) => {
            obj.value = Number(e.id);
            return obj;
        }, {});
    const branch_id = valueBr?.value || checkId?.value;

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "valueBr") {
            sValueBr(value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "address") {
            sAddress(value.target?.value);
        } else if (type == "note") {
            sNote(value.target?.value);
        }
    };

    useEffect(() => {
        const fetchListBranchWarehouse = async () => {
            try {
                const { result } = await apiComons.apiBranchCombobox();
                sListBrand(result?.map((e) => ({ label: e.name, value: e.id })));
            } catch (error) { }
        };
        if (open) {
            fetchListBranchWarehouse();
        }
    }, [open]);

    const _ServerSending = async () => {
        const id = props.id;
        let data = new FormData();
        data.append("name", name);
        data.append("code", code);
        data.append("address", address);
        data.append("note", note);
        data.append("branch_id[]", branch_id);
        const url = props.id
            ? `/api_web/api_warehouse/warehouse/${id}?csrf_protection=true`
            : "/api_web/api_warehouse/warehouse/?csrf_protection=true";
        try {
            const { isSuccess, message } = await apiWarehouse.apiHandingWarehouse(url, data);
            if (isSuccess) {
                isShow("success", `${props.dataLang[message]}` || message);
                sErrInputCode(false);
                sErrInputName(false);
                sErrInputAddress(false);
                sName("");
                sCode("");
                sAddress("");
                sNote("");
                sErrInputBr(false);
                sValueBr([]);
                props.onRefresh && props.onRefresh();
                props.onRefreshGroup && props.onRefreshGroup();
                sOpen(false);
            } else {
                isShow("error", `${props.dataLang[message]}` || message);
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
        if (code.length == 0 || branch_id == null || name.length == 0 || address.length == 0) {
            code?.length == 0 && sErrInputCode(true);
            name?.length == 0 && sErrInputName(true);
            address?.length == 0 && sErrInputAddress(true);
            branch_id == null && sErrInputBr(true);
            isShow("error", `${props.dataLang?.required_field_null}`);
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrInputCode(false);
    }, [code.length > 0]);

    useEffect(() => {
        sErrInputName(false);
    }, [name.length > 0]);

    useEffect(() => {
        sErrInputAddress(false);
    }, [address.length > 0]);

    useEffect(() => {
        sErrInputBr(false);
    }, [branch_id != null]);

    return (
        <>
            <PopupCustom
                title={
                    props.id ? `${props.dataLang?.Warehouse_poppup_edit}` : `${props.dataLang?.Warehouse_poppup_add}`
                }
                button={
                    props.id ? (
                        <IconEdit size={21} className="hover:scale-110 transition-all ease-linear" />
                    ) : (
                        props.dataLang?.branch_popup_create_new || "branch_popup_create_new"
                    )
                }
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="mt-4">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        <Customscrollbar className="h-[420px]">
                            <div className="w-[30vw] ">
                                <div className="flex flex-wrap justify-between ">
                                    <div className="w-full">
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.Warehouse_poppup_code}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={code}
                                                onChange={_HandleChangeInput.bind(this, "code")}
                                                placeholder={props.dataLang?.Warehouse_poppup_code}
                                                name="fname"
                                                type="text"
                                                className={`${errInputCode
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputCode && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.Warehouse_poppup_errcode}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.Warehouse_poppup_name}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={name}
                                                onChange={_HandleChangeInput.bind(this, "name")}
                                                placeholder={props.dataLang?.Warehouse_poppup_name}
                                                name="fname"
                                                type="text"
                                                className={`${errInputName
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputName && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.Warehouse_poppup_errname}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.Warehouse_poppup_address}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={address}
                                                onChange={_HandleChangeInput.bind(this, "address")}
                                                placeholder={props.dataLang?.Warehouse_poppup_address}
                                                name="fname"
                                                type="text"
                                                className={`${errInputAddress
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputAddress && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.Warehouse_poppup_erraddress}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.client_list_brand}{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                //  closeMenuOnSelect={false}
                                                placeholder={props.dataLang?.client_list_brand}
                                                options={brandpOpt}
                                                isSearchable={true}
                                                onChange={_HandleChangeInput.bind(this, "valueBr")}
                                                // isMulti

                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                value={valueBr}
                                                maxMenuHeight="200px"
                                                isClearable={true}
                                                menuPortalTarget={document.body}
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
                                                    // control: base => ({
                                                    //   ...base,
                                                    //   border: '1px solid #d0d5dd',
                                                    //   boxShadow: 'none',

                                                    // })  ,
                                                    control: (provided) => ({
                                                        ...provided,
                                                        border: "1px solid #d0d5dd",
                                                        "&:focus": {
                                                            outline: "none",
                                                            border: "none",
                                                        },
                                                    }),
                                                }}
                                                className={`${errInputBr ? "border-red-500" : "border-transparent"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                            />
                                            {errInputBr && (
                                                <label className="mb-2  text-[14px] text-red-500">
                                                    {props.dataLang?.client_list_bran}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.client_popup_note}
                                    </label>
                                    <textarea
                                        value={note}
                                        placeholder={props.dataLang?.client_popup_note}
                                        onChange={_HandleChangeInput.bind(this, "note")}
                                        name="fname"
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[80px] max-h-[150px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                                    />
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
            </PopupCustom>
        </>
    );
};

export default Popup_kho;
