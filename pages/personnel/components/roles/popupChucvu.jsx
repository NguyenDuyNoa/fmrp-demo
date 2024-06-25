import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
    Minus as IconMinus,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    Edit as IconEdit,
    Grid6 as IconExcel,
    SearchNormal1,
} from "iconsax-react";

import { _ServerInstance as Axios } from "/services/axios";
import useToast from "@/hooks/useToast";

import PopupEdit from "@/components/UI/Popup";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import Loading from "@/components/UI/loading";
const Popup_ChucVu = React.memo((props) => {
    const dataOptBranch = useSelector((state) => state.branch);

    const dataOptDepartment = useSelector((state) => state.department_staff);

    const dataOptPosition = useSelector((state) => state.position_staff);

    const isShow = useToast();

    const initalState = {
        open: false,
        dataOption: [],
        onSending: false,
        onFetching: false,
        name: "",
        position: "",
        department: "",
        valueBranch: [],
        errBranch: false,
        errName: false,
        errDepartment: false,
        tab: 0,
        dataPower: [],
        valueSearch: ""
    }

    const [isState, setIsState] = useState(initalState)

    const queryState = (key) => setIsState((prev) => ({ ...prev, ...key }))

    useEffect(() => {
        isState.open && fetchDataPower()
        isState.open && props?.id && queryState({ onFetching: true, open: true });
    }, [isState.open]);

    const transformData = (data) => {
        const transformedData = {};
        data.forEach(item => {
            const { key, is_check, name, child } = item;
            const transformedChild = {};

            if (child) {
                child.forEach(childItem => {
                    const { key: childKey, name: childName, permissions } = childItem;
                    const transformedPermissions = {};
                    if (permissions) {
                        permissions.forEach(permission => {
                            transformedPermissions[permission.key] = {
                                name: permission.name,
                                is_check: permission.is_check
                            };
                        });
                    }

                    transformedChild[childKey] = {
                        name: childName,
                        permissions: transformedPermissions
                    };
                });
            }
            transformedData[key] = {
                is_check,
                name,
                child: transformedChild
            };
        });

        return transformedData;
    }


    const fetchDataPower = () => {
        Axios("GET", props?.id ? `/api_web/api_staff/getPermissions/${props?.id}?csrf_protection=true` : `/api_web/api_staff/getPermissions?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { data, isSuccess, message } = response?.data;
                if (isSuccess == 1) {
                    const permissionsArray = Object.entries(data.permissions)?.map(([key, value]) => ({
                        key,
                        ...value,
                        child: Object.entries(value?.child)?.map(([childKey, childValue]) => ({
                            key: childKey,
                            ...childValue,
                            permissions: Object.entries(childValue?.permissions)?.map(([permissionsKey, permissionsValue]) => ({
                                key: permissionsKey,
                                ...permissionsValue,
                            }))
                        }))
                    }));
                    queryState({ dataPower: permissionsArray })
                }
            } else {
                {
                    console.log("err", err);
                }
            }
        });
    }

    const _ServerSending = () => {
        let formData = new FormData();
        const transformedResult = transformData(isState.dataPower);
        formData.append("name", isState.name ? isState.name : "");
        formData.append("position_parent_id", isState.position?.value ? isState.position?.value : "");
        formData.append("department_id", isState.department?.value ? isState.department?.value : "");
        isState.valueBranch.forEach((e) => formData.append("branch_id[]", e?.value));
        const utf8Bytes = JSON.stringify(transformedResult)
        formData.append("permissions", utf8Bytes);
        // Object.keys(transformedResult).forEach((key) => {
        //     formData.append(key, transformedResult[key]);
        // });
        Axios(
            "POST",
            `${props?.id
                ? `/api_web/api_staff/position/${props?.id}?csrf_protection=true`
                : "/api_web/api_staff/position?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message] || message);
                        setIsState(initalState)
                        props.onRefresh && props.onRefresh();
                        props.onRefreshSub && props.onRefreshSub();
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                    queryState({ onSending: false });
                }
                else {
                    console.log("err", err);
                }
            }
        );
    };

    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (isState.name == "" || isState.department == "" || isState.valueBranch?.length == 0) {
            isState.name == "" && queryState({ errName: true });
            isState.department == "" && queryState({ errDepartment: true });
            isState.valueBranch?.length == 0 && queryState({ errBranch: true })
            isShow("error", props.dataLang?.required_field_null);
        } else {
            queryState({ onSending: true });
        }
    };

    useEffect(() => {
        queryState({ errName: false });
    }, [isState.name != ""])

    useEffect(() => {
        queryState({ errDepartment: false });
    }, [isState.department != ""])

    useEffect(() => {
        queryState({ errBranch: false });
    }, [isState.valueBranch?.length > 0])

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_staff/position/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const list = response.data;
                queryState({
                    name: list?.name,
                    department: { value: list?.department_id, label: list?.department_name },
                    position: list?.position_parent_id == 0 ? null : { value: list?.position_parent_id, label: list?.position_parent_name },
                    valueBranch: list?.branch.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                })
            }
        });
        Axios("GET", `/api_web/api_staff/positionOption/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({
                    dataOption: rResult.map((x) => ({
                        label: x.name,
                        value: x.id,
                        level: x.level,
                    }))
                })
            }
        });
        queryState({ onFetching: false });
    };

    useEffect(() => {
        setTimeout(() => {
            isState.onFetching && _ServerFetching();
        }, 500);
    }, [isState.onFetching]);

    const handleChange = (parent, child = null, permissions = null) => {
        const newData = isState.dataPower?.map((e) => {
            if (child == null && e?.key == parent?.key) {
                return {
                    ...e,
                    child: e?.child?.map((x) => {
                        return {
                            ...x,
                            permissions: x?.permissions?.map((y) => {
                                return {
                                    ...y,
                                    is_check: parent.is_check == 0 ? 1 : 0
                                };
                            })
                        };
                    }),
                    is_check: parent.is_check == 0 ? 1 : 0
                };
            } else if (child != null && e?.key == parent && e?.is_check == 1) {
                return {
                    ...e,
                    child: e?.child?.map((x) => {
                        if (x?.key == child) {
                            return {
                                ...x,
                                permissions: x?.permissions?.map((y) => {
                                    if (y?.key == permissions?.key) {
                                        return {
                                            ...y,
                                            is_check: y.is_check === 0 ? 1 : 0
                                        };
                                    }
                                    return y;
                                })
                            };
                        }
                        return x;
                    })
                };
            }
            return e;
        });

        queryState({ dataPower: newData });
    };


    useEffect(() => {
        const filteredData = isState.dataPower.filter(item => item.name.toLowerCase().includes(isState.valueSearch.toLowerCase()));
        const newdb = isState.dataPower.map((item) => {
            const itemChecked = filteredData.find((x) => item.key == x.key);
            if (itemChecked) {
                return {
                    ...item,
                    ...itemChecked,
                    hidden: false
                }
            }
            return {
                ...item,
                hidden: true
            }

        })
        queryState({ dataPower: newdb });

    }, [isState.valueSearch])

    const styleSelect = {
        theme: (theme) => ({
            ...theme,
            colors: {
                ...theme.colors,
                primary25: "#EBF5FF",
                primary50: "#92BFF7",
                primary: "#0F4F9E",
            },
        }),
        styles: {
            placeholder: (base) => ({
                ...base,
                color: "#cbd5e1",
            }),
        }
    }

    return (
        <PopupEdit
            title={
                props?.id
                    ? `${props.dataLang?.category_personnel_position_edit || "category_personnel_position_edit"}`
                    : `${props.dataLang?.category_personnel_position_addnew || "category_personnel_position_addnew"}`
            }
            button={props?.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={props.className}
        >
            <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                <button
                    onClick={() => queryState({ tab: 0 })}
                    className={`${isState.tab === 0 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-semibold`}
                >
                    {props.dataLang?.personnels_staff_popup_info}
                </button>
                <button
                    onClick={() => queryState({ tab: 1 })}
                    className={`${isState.tab === 1 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-semibold`}
                >
                    {props.dataLang?.personnels_staff_popup_power}
                </button>
            </div>
            <div className="py-4 w-[600px]  space-y-4">
                {isState.onFetching ? (
                    <Loading className="h-80" color="#0f4f9e" />
                ) : (

                    <React.Fragment>
                        {isState.tab == 0 && (
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.client_list_brand || "client_list_brand"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        classParent={"m-0"}
                                        options={dataOptBranch}
                                        value={isState.valueBranch}
                                        onChange={(value) => queryState({ valueBranch: value })}
                                        isClearable={true}
                                        placeholder={props.dataLang?.client_list_brand || "client_list_brand"}
                                        isMulti
                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                        closeMenuOnSelect={false}
                                        className={`${isState.errBranch ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border p-0`}
                                        {...styleSelect}
                                    />
                                    {isState.errBranch && (
                                        <label className="text-sm text-red-500">
                                            {props.dataLang?.client_list_bran || "client_list_bran"}
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.category_personnel_position_department ||
                                            "category_personnel_position_department"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        classParent={"m-0"}
                                        options={dataOptDepartment}
                                        value={isState.department}
                                        onChange={(value) => queryState({ department: value })}
                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                        isClearable={true}
                                        placeholder={
                                            props.dataLang?.category_personnel_position_department ||
                                            "category_personnel_position_department"
                                        }
                                        className={`${isState.errDepartment ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border p-0`}
                                        isSearchable={true}
                                        {...styleSelect}
                                    />
                                    {isState.errDepartment && (
                                        <label className="text-sm text-red-500">
                                            {props.dataLang?.category_personnel_position_err_department ||
                                                "category_personnel_position_err_department"}
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.category_personnel_position_name || "category_personnel_position_name"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={isState.name}
                                        onChange={(e) => queryState({ name: e.target.value })}
                                        type="text"
                                        placeholder={props.dataLang?.category_material_group_name}
                                        className={`${isState.errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-1.5 border outline-none `}
                                    />
                                    {isState.errName && (
                                        <label className="text-sm text-red-500">
                                            {props.dataLang?.category_personnel_position_err_name ||
                                                "category_personnel_position_err_name"}
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.category_personnel_position_manage_position ||
                                            "category_personnel_position_manage_position"}
                                    </label>
                                    <SelectComponent
                                        classParent={"m-0"}
                                        options={props?.id ? isState.dataOption : dataOptPosition}
                                        formatOptionLabel={SelectOptionLever}
                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                        defaultValue={isState.position}
                                        value={isState.position}
                                        onChange={(value) => queryState({ position: value })}
                                        isClearable={true}
                                        placeholder={
                                            props.dataLang?.category_personnel_position_manage_position ||
                                            "category_personnel_position_manage_position"
                                        }
                                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none p-0"
                                        isSearchable={true}
                                        {...styleSelect}
                                    />

                                </div>
                            </div>
                        )}
                        {isState.tab == 1 && (
                            <>
                                <div className="w-full">
                                    <label>Tìm kiếm</label>
                                    <div className="relative flex items-center">
                                        <SearchNormal1 size={20} className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]" />
                                        <input
                                            onChange={(e) => queryState({ valueSearch: e?.target?.value })}
                                            dataLang={props.dataLang}
                                            value={isState.valueSearch}
                                            className={"border py-1.5 rounded border-gray-300 2xl:text-left 2xl:pl-10 xl:!text-left xl:pl-16 relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-base text-xs  text-center 2xl:w-full xl:w-full w-[100%]"} />
                                        {
                                            isState.valueSearch != "" && <MdClear size={32} onClick={() => queryState({ valueSearch: "" })} className="absolute cursor-pointer hover:bg-gray-300 p-2 right-5 bottom-0.5 rounded-full transition-all duration-200 ease-linear" />
                                        }
                                    </div>

                                </div>
                                <div className="space-y-2 max-h-[500px] h-auto overflow-y-auo scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">

                                    <div className={`grid grid-cols-1`}>
                                        {isState.dataPower?.map((e) => {
                                            return (
                                                <div className={e?.hidden ? "hidden" : ""} key={e?.key}>
                                                    <div className="flex w-max items-center">
                                                        <div className="inline-flex items-center">
                                                            <label
                                                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                                                htmlFor={e?.key}
                                                                data-ripple-dark="true"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                    id={e?.key}
                                                                    value={e?.name}
                                                                    checked={e?.is_check == 1 ? true : false}
                                                                    onChange={(value) => handleChange(e)}
                                                                />
                                                                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-3.5 w-3.5"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                        stroke="currentColor"
                                                                        stroke-width="1"
                                                                    >
                                                                        <path
                                                                            fill-rule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clip-rule="evenodd"
                                                                        ></path>
                                                                    </svg>
                                                                </div>
                                                            </label>
                                                        </div>
                                                        <label
                                                            htmlFor={e?.key}
                                                            className="text-[#344054] font-medium text-base cursor-pointer"
                                                        >
                                                            {e?.name}
                                                        </label>
                                                    </div>
                                                    {e?.is_check == 1 && (
                                                        <div className="">
                                                            {e?.child?.map((i, index) => {
                                                                return (
                                                                    <div key={i?.key} className={`${e?.child?.length - 1 == index && "border-b"} ml-10 border-t border-x`}>
                                                                        <div className="border-b p-2 text-sm">{i?.name}</div>
                                                                        <div className="grid grid-cols-3 gap-1 ">
                                                                            {i?.permissions?.map((s) => {
                                                                                return (
                                                                                    <div key={s?.key} className="flex w-full items-center">
                                                                                        <div className="inline-flex items-center">
                                                                                            <label
                                                                                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                                                                                htmlFor={s?.key + "" + i?.key}
                                                                                                data-ripple-dark="true"
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                                                    id={s?.key + "" + i?.key}
                                                                                                    value={s?.name}
                                                                                                    checked={s?.is_check == 1 ? true : false}
                                                                                                    onChange={(value) => {
                                                                                                        handleChange(e?.key, i?.key, s)
                                                                                                    }}
                                                                                                />
                                                                                                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                                                    <svg
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        className="h-3.5 w-3.5"
                                                                                                        viewBox="0 0 20 20"
                                                                                                        fill="currentColor"
                                                                                                        stroke="currentColor"
                                                                                                        stroke-width="1"
                                                                                                    >
                                                                                                        <path
                                                                                                            fill-rule="evenodd"
                                                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                            clip-rule="evenodd"
                                                                                                        ></path>
                                                                                                    </svg>
                                                                                                </div>
                                                                                            </label>
                                                                                        </div>
                                                                                        <label
                                                                                            htmlFor={s?.key + "" + i?.key}
                                                                                            className="text-[#344054] font-medium text-sm cursor-pointer"
                                                                                        >
                                                                                            {s?.name}
                                                                                        </label>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </>
                        )}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => queryState({ open: false, })}
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
                    </React.Fragment>
                )}
            </div>
        </PopupEdit>
    );
});
export default Popup_ChucVu