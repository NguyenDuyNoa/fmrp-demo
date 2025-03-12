import apiCategoryErrors from "@/Api/apiManufacture/qc/categoryErrors/apiCategoryErrors";
import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import PopupCustom from "@/components/UI/popup";
import { optionsQuery } from "@/configs/optionsQuery";
import { useBranchList } from "@/hooks/common/useBranch";
import useToast from "@/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit as IconEdit } from "iconsax-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const initilaState = {
    open: false,
};

const PopupCategoryErrors = (props) => {
    const isShow = useToast();

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { data: dataBranch = [] } = useBranchList()

    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm();

    const handingCategoryErrors = useMutation({ mutationFn: (data) => { return apiCategoryErrors.apiHandingCategoryErrors(data) } })

    const onSubmit = async (data) => {
        let formData = new FormData();

        if (props.id) {
            formData.append("id", props.id ?? "");
        }

        formData.append("code", data?.code ?? "");
        formData.append("name", data?.name ?? "");
        formData.append("branch_id", data?.branch?.value ?? "");

        try {
            handingCategoryErrors.mutate(formData, {
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
                    message?.error && isShow("error", message?.error);
                }
            })
        } catch (error) { }
    };

    useQuery({
        queryKey: ["api_category_errors_by_id", isState.open, props.id],
        queryFn: async () => {
            const { data } = await apiCategoryErrors.apiGetDetailCategoryErrors(props.id);
            const findBranch = dataBranch?.find((e) => e?.value == data?.dtData?.branch_id);
            setValue("code", data?.dtData?.code);
            setValue("name", data?.dtData?.name);
            setValue("branch", findBranch);
            setValue("note", data?.dtData?.note);
            return data
        },
        ...optionsQuery,
        enabled: isState.open && !!props.id
    })

    useEffect(() => {
        if (!isState.open) {
            reset();
            clearErrors();
        }
    }, [isState.open]);

    return (
        <PopupCustom
            title={props.id ? `${props.dataLang?.error_category_edit || "error_category_edit"}` : `${props.dataLang?.error_category_add || "error_category_add"}`}
            button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={props.className}
        >
            <div className="mt-4 w-96">
                <div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#344054] font-normal text-sm">
                            {props.dataLang?.error_category_code || "error_category_code"}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder={props.dataLang?.error_category_code || "error_category_code"}
                            {...register("code", { required: true })}
                            type="text"
                            className={`${errors.code ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-md text-[#52575E] font-normal p-2 border outline-none `}
                        />
                        {errors.code && (
                            <label className="  text-[14px] text-red-500">
                                {props.dataLang?.error_category_error_code || "error_category_error_code"}
                            </label>
                        )}
                        <label className="text-[#344054] font-normal text-sm">
                            {props.dataLang?.error_category_name || "error_category_name"}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder={props.dataLang?.error_category_name || "error_category_name"}
                            {...register("name", { required: true })}
                            type="text"
                            className={`${errors.name ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-md text-[#52575E] font-normal p-2 border outline-none `}
                        />
                        {errors.name && (
                            <label className="  text-[14px] text-red-500">
                                {props.dataLang?.error_category_error_name || "error_category_error_name"}
                            </label>
                        )}

                        <label className="text-[#344054] font-normal text-sm">
                            {props.dataLang?.import_branch || "import_branch"} <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="branch"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <SelectComponent
                                    {...field}
                                    options={dataBranch}
                                    isSearchable={true}
                                    placeholder={props.dataLang?.import_branch || "import_branch"}
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
                                    className={`${errors.branch ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                />
                            )}
                        />
                        {errors.branch && (
                            <label className="  text-[14px] text-red-500">
                                {props.dataLang?.error_category_error_branch || "error_category_error_branch"}
                            </label>
                        )}
                        <div className="flex flex-wrap justify-between mt-2">
                            <label className="text-[#344054] font-normal text-sm">
                                {props.dataLang?.error_category_note || "error_category_note"}
                            </label>
                            <textarea
                                placeholder={props.dataLang?.error_category_note || "error_category_note"}
                                {...register("note")}
                                className="placeholder:text-slate-300 w-full min-h-[100px] max-h-[120px] bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
                            />
                        </div>
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
                            loading={handingCategoryErrors.isPending || false}
                            dataLang={props.dataLang}
                            onClick={() => handleSubmit((data) => onSubmit(data))()}
                            className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#003DA0]"
                        />
                    </div>
                </div>
            </div>
        </PopupCustom>
    );
};
export default PopupCategoryErrors;
