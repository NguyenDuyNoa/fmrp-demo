import React, { useState, useEffect, useRef } from "react";
import PopupEdit from "/components/UI/popup";
import Select, { components } from "react-select";
import { _ServerInstance as Axios } from "/services/axios";
import {
    Edit as IconEdit,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Grid6 as IconExcel,
} from "iconsax-react";

import useToast from "@/hooks/useToast"
const Popup_groupKh = (props) => {
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const isShow = useToast()

    const initilaState = {
        open: false,
        onSending: false,
        listBr: [],
        valueBr: [],
        name: "",
        color: "",
        errInput: false,
        errInputBr: false,
        errInputName: false,
    }

    const [isState, sIsState] = useState(initilaState)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }))

    useEffect(() => {
        queryState({
            listBr: props.listBr || [],
            name: props.name ? props.name : "",
            color: props.color ? props.color : "",
            valueBr: props.sValueBr ? props.sValueBr?.map((e) => {
                return {
                    label: e.name,
                    value: e.id
                };
            }) : []
        });
    }, [isState.open]);

    const _ServerSending = async () => {
        const id = props.id;
        var data = new FormData();
        data.append("name", isState.name);
        data.append("color", isState.color);
        isState.valueBr.forEach((e) => {
            data.append("branch_id[]", e?.value);
        })
        await Axios("POST", `${props.id ? `/api_web/Api_client/group/${id}?csrf_protection=true` : "/api_web/Api_client/group?csrf_protection=true"}`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message] || message);
                        sIsState(initilaState);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                }
                queryState({ onSending: false });
            }
        );
    };
    //da up date
    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);

    useEffect(() => {
        isState.name != "" && queryState({ errInputName: false });
    }, [isState.name])
    useEffect(() => {
        isState.valueBr?.length > 0 && queryState({ errInputBr: false });
    }, [isState.valueBr])

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (isState.name == "" || isState.valueBr?.length == 0) {
            isState.name?.length == "" && queryState({ errInputName: true });
            isState.valueBr?.length == 0 && queryState({ errInputBr: true });
            isShow("error", props.dataLang?.required_field_null);
        } else {
            queryState({ onSending: true });
        }
    };
    return (
        <PopupEdit
            title={props.id ? `${props.dataLang?.client_group_edit}` : `${props.dataLang?.client_group_add}`}
            button={props.id ? (<IconEdit />) : (`${props.dataLang?.branch_popup_create_new}`)}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={props.className}
        >
            <div className="w-96 mt-4">
                <form onSubmit={_HandleSubmit.bind(this)}>
                    <div>
                        <div className="flex flex-wrap justify-between">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props.dataLang?.client_group_name}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={isState.name}
                                onChange={(e) => queryState({ name: e.target.value })}
                                name="fname"
                                type="text"
                                className={`${isState.errInputName
                                    ? "border-red-500"
                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-md text-[#52575E] font-normal p-2 border outline-none mb-2`}
                            />
                            {isState.errInputName && (
                                <label className="mb-2  text-[14px] text-red-500">
                                    {props.dataLang?.client_group_please_name}
                                </label>
                            )}
                        </div>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_list_brand}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Select
                            closeMenuOnSelect={false}
                            placeholder={props.dataLang?.client_list_brand}
                            options={isState.listBr}
                            isSearchable={true}
                            onChange={(e) => queryState({ valueBr: e })}
                            LoadingIndicator
                            isMulti
                            noOptionsMessage={() => "Không có dữ liệu"}
                            value={isState.valueBr}
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
                            className={`${isState.errInputBr
                                ? "border-red-500"
                                : "border-transparent"
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                        />
                        {isState.errInputBr && (
                            <label className="mb-2  text-[14px] text-red-500">
                                {props.dataLang?.client_list_bran}
                            </label>
                        )}
                        <div className="flex flex-wrap justify-between mt-2">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props.dataLang?.client_group_color}
                            </label>
                            <input
                                value={isState.color}
                                onChange={(e) => queryState({ color: e.target.value })}
                                name="color"
                                type="color"
                                className="placeholder-[color:#667085] w-full min-h-[50px] bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
                            />
                        </div>
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={() => queryState({ open: false })}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </PopupEdit>
    );
};
export default Popup_groupKh;
