import apiCategory from "@/Api/apiMaterial/category/apiCategory";
import PopupCustom from "@/components/UI/popup";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import useToast from "@/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit as IconEdit } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const Popup_NVL = React.memo((props) => {
    const dataOptBranch = useSelector((state) => state.branch);

    const [dataOption, sDataOption] = useState([]);

    const isShow = useToast();

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [branch, sBranch] = useState([]);
    const branch_id = branch?.map((e) => e.value);

    const [code, sCode] = useState("");
    const [name, sName] = useState("");
    const [editorValue, sEditorValue] = useState("");

    const [errBranch, sErrBranch] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errName, sErrName] = useState(false);
    const [idCategory, sIdCategory] = useState(null);

    useEffect(() => {
        open && sCode(props.data?.code ? props.data?.code : "");
        open && sName(props.data?.name ? props.data?.name : "");
        open && sEditorValue(props.data?.note ? props.data?.note : "");
        open && sIdCategory(props.data?.parent_id ? props.data?.parent_id : null);
        open &&
            sBranch(
                props.data?.branch?.length > 0
                    ? props.data?.branch?.map((e) => ({
                        label: e.name,
                        value: e.id,
                    }))
                    : []
            );
        open && sErrCode(false);
        open && sErrName(false);
        open && sErrBranch(false);
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "editor") {
            sEditorValue(value.target?.value);
        } else if (type == "branch") {
            sBranch(value);
        }
    };

    const { } = useQuery({
        queryKey: ['api_detail_category_option', props.data?.id],
        queryFn: async () => {
            const { rResult } = await apiCategory.apiDetailCategoryOptionCategory(props.data?.id);
            sDataOption(
                rResult.map((e) => ({
                    label: e.name + " " + "(" + e.code + ")",
                    value: e.id,
                    level: e.level,
                }))
            );
            return rResult
        },
        enabled: open,
    })


    const handingCategory = useMutation({
        mutationFn: async (data) => {
            return apiCategory.apiHandingCategory(data, props.data?.id)
        }
    })


    const _ServerSending = () => {
        let formData = new FormData();

        formData.append("code", code);
        formData.append("name", name);
        formData.append("note", editorValue);
        formData.append("parent_id", idCategory ? idCategory : null);
        branch_id.forEach((id) => formData.append("branch_id[]", id));

        handingCategory.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", props.dataLang[message]);
                    sName("");
                    sCode("");
                    sEditorValue("");
                    sIdCategory([]);
                    props.onRefresh && props.onRefresh();
                    props.onRefreshOpt && props.onRefreshOpt();
                    sOpen(false);
                } else {
                    isShow("error", props.dataLang[message]);
                }
            },
            onError: (error) => {

            }
        });
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
            isShow("error", props.dataLang?.required_field_null);
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

    const valueIdCategory = (e) => sIdCategory(e?.value);

    return (
        <PopupCustom
            title={
                props.data?.id
                    ? `${props.dataLang?.category_material_group_edit}`
                    : `${props.dataLang?.category_material_group_addnew}`
            }
            button={props.data?.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
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
                        formatOptionLabel={SelectOptionLever}
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
                        options={dataOption}
                        formatOptionLabel={SelectOptionLever}
                        defaultValue={
                            idCategory == "0" || !idCategory
                                ? {
                                    label: `${props.dataLang?.category_material_group_level}`,
                                }
                                : {
                                    label: dataOption.find((x) => x?.parent_id == idCategory)?.label,
                                    code: dataOption.find((x) => x?.parent_id == idCategory)?.code,
                                    value: idCategory,
                                }
                        }
                        value={
                            idCategory == "0" || !idCategory
                                ? { label: "Nhóm cha", code: "nhóm cha" }
                                : {
                                    label: dataOption.find((x) => x?.value == idCategory)?.label,
                                    code: dataOption.find((x) => x?.value == idCategory)?.code,
                                    value: idCategory,
                                }
                        }
                        onChange={valueIdCategory.bind(this)}
                        isClearable={true}
                        placeholder={props.dataLang?.category_material_group_level}
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
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.client_popup_note}</label>
                    <textarea
                        type="text"
                        placeholder={props.dataLang?.client_popup_note}
                        rows={5}
                        value={editorValue}
                        onChange={_HandleChangeInput.bind(this, "editor")}
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
export default Popup_NVL