import apiCategoryDetailErrors from "@/Api/apiManufacture/qc/categoryDetailErrors/apiCategoryDetailErrors";
import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import PopupCustom from "@/components/UI/popup";
import { optionsQuery } from "@/configs/optionsQuery";
import useToast from "@/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCategoryDetailErrorsListSelect } from "../hooks/useCategoryDetailErrorsListSelect";

const initilaState = {
    open: false,
    searchCategoryError: ""
};

const PopupCategoryErrors = (props) => {
    const isShow = useToast();

    const [isState, sIsState] = useState(initilaState);

    const [isMounted, setIsMounted] = useState(false);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { data: listCategoryError = [] } = useCategoryDetailErrorsListSelect({ params: { search: isState.searchCategoryError } })

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { register, handleSubmit, watch, control, reset, setValue, clearErrors, formState: { errors }, } = useForm();

    const handingCategoryDetailErrors = useMutation({ mutationFn: (data) => apiCategoryDetailErrors.apiHandingDetailError(data) })

    const onSubmit = async (data) => {
        let formData = new FormData();

        if (props.id) {
            formData.append("id", props.id ?? "");
        }

        formData.append("code", data.code);
        formData.append("name", data.name);
        formData.append("branch_id", data.categoryError?.branchId);
        formData.append("category_error_id", data.categoryError?.value);
        formData.append("note", data.note);

        try {
            handingCategoryDetailErrors.mutate(formData, {
                onSuccess: ({ result, message }) => {
                    if (result == 1) {
                        isShow("success", message);
                        queryState({ open: false });
                        props.onRefresh && props.onRefresh();
                        return;
                    }
                    message?.name && isShow("error", message?.name);
                    message?.code && isShow("error", message?.code);
                    message?.branch_id && isShow("error", message?.branch_id);
                    message?.category_error_id && isShow("error", message?.category_error_id);
                    message?.error && isShow("error", message?.error);
                },
                onError: (error) => {

                }
            })
        } catch (error) { }
    };

    const fetchCategoryError = debounce(async (value) => {
        try {
            queryState({ searchCategoryError: value });
        } catch (error) { }
    }, 500);

    useQuery({
        queryKey: ["api_category_detail_errors_by_id", isState.open, props?.id],
        queryFn: async () => {
            const { data } = await apiCategoryDetailErrors.apiEditDetailError(props.id);
            const findCategory = listCategoryError?.find((e) => e?.value == data?.dtData?.category_error_id);
            setValue("code", data?.dtData?.code);
            setValue("name", data?.dtData?.name);
            setValue("categoryError", findCategory);
            setValue("note", data?.dtData?.note);
            return data
        },
        enabled: isState.open && !!props.id,
        ...optionsQuery
    })

    useEffect(() => {
        if (!isState.open) {
            reset();
            clearErrors();
        }
    }, [isState.open]);

    if (!isMounted) return null;

    return (
        <PopupCustom
            title={props.id ? `${props.dataLang?.detailed_error_edit || "detailed_error_edit"}` : `${props.dataLang?.detailed_error_add || "detailed_error_add"}`}
            button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={props.className}
        >
            <div className="mt-4 w-96">
                <div>
                    <div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#344054] font-normal text-sm">
                                {props.dataLang?.detailed_error_code || "detailed_error_code"}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("code", { required: true })}
                                type="text"
                                placeholder={props?.dataLang?.detailed_error_code || "detailed_error_code"}
                                className={`${errors.code ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-md text-[#52575E] font-normal p-2 border outline-none `}
                            />
                            {errors.code && (
                                <label className="  text-[14px] text-red-500">
                                    {props?.dataLang?.detailed_error_error_code || "detailed_error_error_code"}
                                </label>
                            )}

                            <label className="text-[#344054] font-normal text-sm">
                                {props?.dataLang?.detailed_error_name || "detailed_error_name"}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("name", { required: true })}
                                type="text"
                                placeholder={props?.dataLang?.detailed_error_name || "detailed_error_name"}
                                className={`${errors.name ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-md text-[#52575E] font-normal p-2 border outline-none `}
                            />
                            {errors.name && (
                                <label className="  text-[14px] text-red-500">
                                    {props?.dataLang?.detailed_error_error_name || "detailed_error_error_name"}
                                </label>
                            )}
                            <label className="text-[#344054] font-normal text-sm">
                                {props?.dataLang?.error_category || "dataLang?.error_category"}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="categoryError"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectComponent
                                        {...field}
                                        options={listCategoryError}
                                        onInputChange={(inputValue) => {
                                            fetchCategoryError(inputValue);
                                        }}
                                        isSearchable={true}
                                        placeholder={props?.dataLang?.error_category || "dataLang?.error_category"}
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                                            control: (provided) => ({
                                                ...provided,
                                                border: "1px solid #d0d5dd",
                                                "&:focus": {
                                                    outline: "none",
                                                    border: "none",
                                                },
                                            }),
                                        }}
                                        className={`${errors.categoryError ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                    />
                                )}
                            />
                            {errors.categoryError && (
                                <label className="  text-[14px] text-red-500">
                                    {props.dataLang?.detailed_error_category || "detailed_error_category"}
                                </label>
                            )}

                            <label className="text-[#344054] font-normal text-sm">
                                {props.dataLang?.error_category_note || "error_category_note"}
                            </label>
                            <textarea
                                placeholder={props.dataLang?.error_category_note || "error_category_note"}
                                {...register("note")}
                                className="placeholder:text-slate-300 w-full min-h-[100px] max-h-[120px] bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
                            />
                        </div>
                        <div className="mt-5 space-x-2 text-right">
                            <ButtonCancel
                                type="button"
                                dataLang={props.dataLang}
                                onClick={() => queryState({ open: false })}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
                            />

                            <ButtonSubmit
                                type="button"
                                dataLang={props.dataLang}
                                loading={handingCategoryDetailErrors.isPending || false}
                                onClick={() => handleSubmit((data) => onSubmit(data))()}
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#003DA0]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopupCustom>
    );
};
export default PopupCategoryErrors;
