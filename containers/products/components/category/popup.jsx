import apiCategory from "@/Api/apiProducts/category/apiCategory";
import PopupCustom from "@/components/UI/popup";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import useToast from "@/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit as IconEdit } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useProductCategoryDetailOptions } from "../../hooks/category/useProductCategoryDetailOptions";

const Popup_Products = React.memo((props) => {
    const isShow = useToast()

    const dataOptBranch = useSelector((state) => state.branch);

    const dataOptGroup = useSelector((state) => state.categoty_finishedProduct);

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState("");

    const [code, sCode] = useState("");

    const [note, sNote] = useState("");

    const [branch, sBranch] = useState([]);

    const [group, sGroup] = useState(null);

    const [errBranch, sErrBranch] = useState(false);

    const [errName, sErrName] = useState(false);

    const [errCode, sErrCode] = useState(false);

    const params = {
        "filter[branch_id][]": branch?.length > 0 ? branch.map((e) => e.value) : 0,
    }

    const { data: dataOption = [] } = useProductCategoryDetailOptions(open, params, props?.id)


    useEffect(() => {
        open && sErrBranch(false);
        open && sErrName(false);
        open && sErrCode(false);
        open && sName("");
        open && sCode("");
        open && sNote("");
        open && sBranch([]);
        open && sGroup(null);

    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value?.target.value);
        } else if (type == "code") {
            sCode(value?.target.value);
        } else if (type == "note") {
            sNote(value?.target.value);
        } else if (type == "branch") {
            sBranch(value);
        } else if (type == "group") {
            sGroup(value?.value);
        }
    };

    const handingCategory = useMutation({
        mutationFn: async (data) => {
            return apiCategory.apiHandingCategory(props?.id, data);
        }
    })

    const _ServerSending = () => {
        let formData = new FormData();

        formData.append("code", code);
        formData.append("name", name);
        formData.append("note", note);
        formData.append("parent_id", group);
        branch.forEach((id) => formData.append("branch_id[]", id.value));

        handingCategory.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", props.dataLang[message] || message);
                    sOpen(false);
                    sName("");
                    sCode("");
                    sNote("");
                    sGroup(null);
                    sBranch([]);
                    props.onRefresh && props.onRefresh();
                    props.onRefreshSub && props.onRefreshSub();
                } else {
                    isShow("error", props.dataLang[message] || message);
                }
            },
            onError: (error) => {

            }
        })
        sOnSending(false);
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (name?.length == 0 || code?.length == 0 || branch?.length == 0) {
            name?.length == 0 && sErrName(true);
            code?.length == 0 && sErrCode(true);
            branch?.length == 0 && sErrBranch(true);
            isShow("error", props.dataLang?.required_field_null || "required_field_null");
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrName(false);
    }, [name?.length > 0]);

    useEffect(() => {
        sErrCode(false);
    }, [code?.length > 0]);

    useEffect(() => {
        sErrBranch(false);
    }, [branch?.length > 0]);

    useQuery({
        queryKey: ["api_detail_category"],
        queryFn: async () => {
            const list = await apiCategory.apiDetailCategory(props?.id);
            sName(list?.name);
            sCode(list?.code);
            sNote(list?.note);
            sGroup(list?.parent_id);
            sBranch(
                list?.branch.map((e) => ({
                    label: e.name,
                    value: e.id,
                }))
            );
            return list
        },
        enabled: open && !!props?.id
    })




    return (
        <PopupCustom
            title={props?.id
                ? `${props.dataLang?.catagory_finishedProduct_group_edit || "catagory_finishedProduct_group_edit"}`
                : `${props.dataLang?.catagory_finishedProduct_group_addnew || "catagory_finishedProduct_group_addnew"}`
            }
            button={props?.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[600px] space-y-5">
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.client_list_brand || "client_list_brand"}{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <Select
                        options={dataOptBranch}
                        value={branch}
                        onChange={_HandleChangeInput.bind(this, "branch")}
                        isClearable={true}
                        placeholder={props.dataLang?.client_list_brand || "client_list_brand"}
                        isMulti
                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                        closeMenuOnSelect={false}
                        className={`${errBranch ? "border-red-500" : "border-transparent"
                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: "#EBF5FF",
                                primary50: "#92BFF7",
                                primary: "#0F4F9E",
                            },
                        })}
                        styles={{
                            placeholder: (base) => ({
                                ...base,
                                color: "#cbd5e1",
                            }),
                        }}
                    />
                    {errBranch && (
                        <label className="text-sm text-red-500">
                            {props.dataLang?.client_list_bran || "client_list_bran"}
                        </label>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.category_material_group_code} <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={code}
                        onChange={_HandleChangeInput.bind(this, "code")}
                        type="text"
                        placeholder={props.dataLang?.category_material_group_code}
                        className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                    />
                    {errCode && (
                        <label className="text-sm text-red-500">
                            {props.dataLang?.category_material_group_err_code}
                        </label>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.category_material_group_name} <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={name}
                        onChange={_HandleChangeInput.bind(this, "name")}
                        type="text"
                        placeholder={props.dataLang?.category_material_group_name}
                        className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                    />
                    {errName && (
                        <label className="text-sm text-red-500">
                            {props.dataLang?.category_material_group_err_name}
                        </label>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.category_material_group_level}
                    </label>
                    <Select
                        options={branch?.length != 0 ? dataOption : dataOptGroup}
                        formatOptionLabel={SelectOptionLever}
                        value={
                            group == "0" || !group
                                ? null
                                : {
                                    label: dataOptGroup.find((x) => x?.value == group)?.label,
                                    code: dataOptGroup.find((x) => x?.value == group)?.code,
                                    value: group,
                                }
                        }
                        onChange={_HandleChangeInput.bind(this, "group")}
                        isClearable={true}
                        placeholder={props.dataLang?.category_material_group_level}
                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none"
                        isSearchable={true}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: "#EBF5FF",
                                primary50: "#92BFF7",
                                primary: "#0F4F9E",
                            },
                        })}
                        styles={{
                            placeholder: (base) => ({
                                ...base,
                                color: "#cbd5e1",
                            }),
                        }}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.client_popup_note}</label>
                    <textarea
                        type="text"
                        placeholder={props.dataLang?.client_popup_note}
                        rows={5}
                        value={note}
                        onChange={_HandleChangeInput.bind(this, "note")}
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none resize-none"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={_ToggleModal.bind(this, false)}
                        className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                    >
                        {props.dataLang?.branch_popup_exit}
                    </button>
                    <button
                        onClick={_HandleSubmit.bind(this)}
                        className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition"
                    >
                        {props.dataLang?.branch_popup_save}
                    </button>
                </div>
            </div>
        </PopupCustom>
    );
});
export default Popup_Products