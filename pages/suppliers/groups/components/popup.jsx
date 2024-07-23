import apiGroups from "@/api/apiSuppliers/groups/apiGroups";
import useToast from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import { Edit as IconEdit } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PopupCustom from "/components/UI/popup";


const Popup_groupKh = (props) => {
    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const isShow = useToast()

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const initialData = {
        name: "",
        errInput: false,
        errInputBr: false,
        valueBr: [],
        listBr: [],
        onSending: false,
    }

    const [isState, sIsState] = useState(initialData)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }))

    useEffect(() => {
        if (props?.id) {
            queryState({
                listBr: props?.isState?.listBr || [],
                name: props?.name,
                valueBr: props?.sValueBr?.map((e) => ({
                    label: e.name,
                    value: e.id,
                })),
            })
        } else {
            sIsState(prev => {
                return {
                    ...prev,
                    ...initialData,
                    listBr: props?.isState?.listBr || [],
                }
            });
        }
    }, [open]);


    useEffect(() => {
        isState.name == "" && queryState({ errInput: false });
    }, [isState.name]);

    useEffect(() => {
        isState.valueBr?.length > 0 && queryState({ errInputBr: false });
    }, [isState.valueBr]);


    const handingGroupSuppliers = useMutation({
        mutationFn: (data) => {
            return apiGroups.apiHandingGroup(data, props.id);
        }
    })

    const _ServerSending = () => {
        let data = new FormData();
        data.append("name", isState.name);
        isState.valueBr?.forEach((e) => {
            data.append("branch_id[]", e.value);
        })
        handingGroupSuppliers.mutate(data, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", `${props.dataLang[message]}` || message)
                    sIsState(initialData);
                    props.onRefresh && props.onRefresh();
                    sOpen(false);
                } else {
                    isShow("error", `${props.dataLang[message]}` || message)
                }
            },
            onError: (err) => {
            }
        })
        queryState({ onSending: false });
    };
    //da up date
    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);
    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (isState.name == "" || isState.valueBr?.length == 0) {
            isState.name == "" && queryState({ errInput: true });
            isState.valueBr?.length == 0 && queryState({ errInputBr: true });
            isShow("error", props.dataLang?.required_field_null);
        } else {
            queryState({ onSending: true });
        }
    };
    return (
        <PopupCustom
            title={props.id ? `${props.dataLang?.suppliers_groups_edit}` : `${props.dataLang?.suppliers_groups_add}`}
            button={props.id ? (<IconEdit />) : (`${props.dataLang?.branch_popup_create_new}`)}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="w-96 mt-4">
                <form onSubmit={_HandleSubmit.bind(this)}>
                    <div>
                        <div className="flex flex-wrap justify-between">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props.dataLang?.suppliers_groups_name}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={isState.name}
                                onChange={(e) => queryState({ name: e.target.value })}
                                name="fname"
                                type="text"
                                className={`${isState.errInput
                                    ? "border-red-500"
                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none mb-2`}
                            />
                            {isState.errInput && (
                                <label className="mb-2  text-[14px] text-red-500">
                                    {props.dataLang?.client_group_please_name}
                                </label>
                            )}
                        </div>
                        <div>
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
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        position: "absolute",
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
                        </div>
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
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
        </PopupCustom>
    );
};

export default Popup_groupKh;
