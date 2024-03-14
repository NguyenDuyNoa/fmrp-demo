import useToast from "@/hooks/useToast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PopupEdit from "@/components/UI/popup";
import { useToggle } from "@/hooks/useToggle";
import Select from "react-select";
import {
    SearchNormal1 as IconSearch,
    Trash as IconDelete,
    UserEdit as IconUserEdit,
    Grid6 as IconExcel,
    Image as IconImage,
    GalleryEdit as IconEditImg,
    ArrowDown2 as IconDown,
    Add as IconAdd,
    Maximize4 as IconMax,
    CloseCircle as IconClose,
    TickCircle as IconTick,
    AttachCircle,
} from "iconsax-react";
import { NumericFormat } from "react-number-format";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import Loading from "@/components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import { debounce } from "lodash";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
const Popup_Bom = React.memo((props) => {
    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const [isOpen, sIsOpen] = useState(false);

    const isShow = useToast();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit } = useActionRole(auth, 'products');

    const [onFetching, sOnFetching] = useState(false);

    const [loadingData, sLoadingData] = useState(false);

    const [onFetchingCd, sOnFetchingCd] = useState(false);

    const _ToggleModal = (e) => sIsOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [dataVariant, sDataVariant] = useState([]);

    const [valueVariant, sValueVariant] = useState(null);

    const [tab, sTab] = useState(null);

    const [selectedList, sSelectedList] = useState(null);

    const [dataTypeCd, sDataTypeCd] = useState([]);

    const [dataCd, sDataCd] = useState([]);

    const _HandleSelectTab = (e) => sTab(e);

    const [dataSelectedVariant, sDataSelectedVariant] = useState([]);

    const dataRestVariant = dataVariant?.filter(
        (item1) => !dataSelectedVariant?.some((item2) => item1.label === item2?.label && item1.value === item2?.value)
    );
    const [currentData, sCurrentData] = useState([]);

    const [errType, sErrType] = useState(false);

    const [errName, sErrName] = useState(false);

    useEffect(() => {
        isOpen && props.type == "edit" && sOnFetching(true);
        isOpen && props?.id && sOnFetchingCd(true);
        isOpen && sLoadingData(false);
        isOpen && sTab(null);
        isOpen && sErrType(false);
        isOpen && sErrName(false);
    }, [isOpen]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/Api_product/getDesignBOM?csrf_protection=true`,
            {
                params: {
                    id: props.id,
                },
            },
            (err, response) => {
                if (!err) {
                    const { data } = response.data;
                    sDataSelectedVariant(
                        data?.variations?.map((e) => ({
                            label: e.name_variation,
                            value: e.product_variation_option_value_id,
                            child: e.items?.map((ce) => ({
                                id: ce.id,
                                type: {
                                    label: ce.str_type_item,
                                    value: ce.type_item,
                                },
                                name: {
                                    label: ce.item_name,
                                    value: ce.item_id,
                                },
                                unit: {
                                    label: ce.unit_name,
                                    value: ce.unit_id,
                                },
                                norm: Number(ce.quota),
                                loss: Number(ce.loss),
                                stage: {
                                    label: ce.stage_name,
                                    value: ce.stage_id,
                                },
                            })),
                        }))
                    );
                    sCurrentData(
                        data?.variations?.map((e) => ({
                            label: e.name_variation,
                            value: e.product_variation_option_value_id,
                            child: e.items?.map((ce) => ({
                                id: ce.id,
                                type: {
                                    label: ce.str_type_item,
                                    value: ce.type_item,
                                },
                                name: {
                                    label: ce.item_name,
                                    value: ce.item_id,
                                },
                                unit: {
                                    label: ce.unit_name,
                                    value: ce.unit_id,
                                },
                                norm: Number(ce.quota),
                                loss: Number(ce.loss),
                                stage: {
                                    label: ce.stage_name,
                                    value: ce.stage_id,
                                },
                            })),
                        }))
                    );
                }
                sOnFetching(false);
                sLoadingData(true);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerFetchingCd = () => {
        Axios("GET", "/api_web/api_product/getDataDesignBom?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { data } = response.data;
                sDataTypeCd(
                    Object.entries(data.typeDesignBom).map(([key, value]) => ({
                        label: value,
                        value: key,
                    }))
                );
                sDataCd(data.stages.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        Axios(
            "GET",
            `/api_web/api_product/productVariationOption/${props.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    sDataVariant(
                        rResult[0]?.product_variation?.includes("NONE")
                            ? [
                                {
                                    label: "Mặc định",
                                    value: rResult[0]?.id,
                                    child: [],
                                },
                            ]
                            : rResult.map((e) => ({
                                label: e.product_variation,
                                value: e.id,
                                child: [],
                            }))
                    );
                }
            }
        );
        sOnFetchingCd(false);
    };

    useEffect(() => {
        onFetchingCd && _ServerFetchingCd();
    }, [onFetchingCd]);

    const hiddenOptions = valueVariant?.length > 2 ? valueVariant?.slice(0, 2) : [];
    const options = dataRestVariant.filter((x) => !hiddenOptions.includes(x.value));

    const _HandleChangeSelect = (value) => {
        sValueVariant(value);
    };

    const _HandleApplyVariant = () => {
        dataSelectedVariant?.push(...valueVariant);
        sTab(dataSelectedVariant[0]?.value);
        sValueVariant([]);
    };
    const _HandleAddNew = (id) => {
        const index = dataSelectedVariant.findIndex((obj) => obj?.value === id);
        const newData = [...dataSelectedVariant];
        newData[index] = {
            ...newData[index],
            child: [
                ...newData[index]?.child,
                {
                    id: Date.now(),
                    type: null,
                    name: null,
                    dataName: [],
                    unit: null,
                    dataUnit: [],
                    norm: 0,
                    loss: 0,
                    stage: null,
                },
            ],
        };

        sDataSelectedVariant(newData);
    };

    const _HandleDeleteItemBOM = (parentId, id) => {
        const index = dataSelectedVariant.findIndex((obj) => obj?.value === parentId);
        const newData = [...dataSelectedVariant];
        const newChild = newData[index].child.filter((item) => item.id !== id);
        newData[index] = { ...newData[index], child: newChild };
        sDataSelectedVariant(newData);
    };

    const _HandleSeachApi = debounce((value, inputValue, type, id) => {
        Axios(
            "POST",
            `/api_web/api_product/searchItemsVariants?csrf_protection=true`,
            {
                data: {
                    term: type,
                    type: inputValue?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    const data = response?.data?.data.items;
                    const getdata = data?.map((item) => ({
                        label: item.name,
                        value: item.id,
                        product_variation: item?.product_variation,
                    }));
                    console.log("dataSelectedVariant", dataSelectedVariant);
                    const newDb = dataSelectedVariant.map((e) => ({
                        ...e,
                        child: e.child.map((ce, ceIndex) => ({
                            ...ce,
                            dataName: getdata,
                            // dataName: ceIndex === childIndex ? getdata : ce.dataName,
                        })),
                    }));

                    sDataSelectedVariant(newDb);
                }
            }
        );
    }, 500)
    const _HandleChangeItemBOM = (parentId, childId, type, value) => {
        const newData = dataSelectedVariant.map((parent) => {
            if (parent.value === parentId) {
                const newChild = parent.child.map((child) => {
                    if (child.id === childId) {
                        return {
                            ...child,
                            [type]: type === "norm" || type === "loss" ? Number(value.value) : value,
                        };
                    }
                    return child;
                });
                return {
                    ...parent,
                    child: newChild,
                };
            }
            return parent;
        });
        sDataSelectedVariant(newData);
        if (type === "type") {
            const found = newData.find((parent) => parent.value === parentId);
            if (found) {
                const child = found.child.find((child) => child.id === childId);
                if (child) {
                    const type = child.type?.value;
                    Axios(
                        "POST",
                        "/api_web/api_product/searchItemsVariants?csrf_protection=true",
                        {
                            data: {
                                type: type,
                            },
                        },
                        (err, response) => {
                            if (!err) {
                                const { data } = response.data;
                                const updatedData = newData.map((parent) => {
                                    if (parent.value === parentId) {
                                        const newChild = parent.child.map((child) => {
                                            if (child.id === childId) {
                                                return {
                                                    ...child,
                                                    dataName: data?.items
                                                        ? data?.items.map((e) => ({
                                                            label: e.name,
                                                            value: e.id,
                                                            product_variation: e?.product_variation,
                                                        }))
                                                        : [],
                                                };
                                            }
                                            return child;
                                        });
                                        return { ...parent, child: newChild };
                                    }
                                    return parent;
                                });
                                sDataSelectedVariant(updatedData);
                            }
                        }
                    );
                }
            }
        }
        if (type === "name") {
            const found = newData.find((parent) => parent.value === parentId);
            if (found) {
                const child = found.child.find((child) => child.id === childId);
                if (child) {
                    const name = child.name?.value;
                    const type = child.type?.value;
                    Axios(
                        "POST",
                        "/api_web/api_product/rowItem?csrf_protection=true",
                        {
                            data: {
                                item_id: name,
                                type: type,
                            },
                        },
                        (err, response) => {
                            if (!err) {
                                const { data } = response.data;
                                const updatedData = newData.map((parent) => {
                                    if (parent.value === parentId) {
                                        const newChild = parent.child.map((child) => {
                                            if (child.id === childId) {
                                                return {
                                                    ...child,
                                                    dataUnit: data?.units
                                                        ? data?.units.map((e) => ({
                                                            label: e.unit,
                                                            value: e.unitid,
                                                        }))
                                                        : [],
                                                };
                                            }
                                            return child;
                                        });
                                        return { ...parent, child: newChild };
                                    }
                                    return parent;
                                });
                                sDataSelectedVariant(updatedData);
                            }
                        }
                    );
                }
            }
        }
    };

    const _HandleDeleteBOM = (id) => {
        const newData = [...dataSelectedVariant.filter((item) => item?.value !== id)];
        sDataSelectedVariant(newData);
        sTab(newData[0]?.value);
    };

    useEffect(() => {
        isOpen &&
            (tab || dataSelectedVariant) &&
            sSelectedList(dataSelectedVariant?.find((item) => item?.value === tab));
    }, [tab, dataSelectedVariant]);

    const checkEqual = (prevValue, nextValue) =>
        prevValue && nextValue && JSON.stringify(prevValue) === JSON.stringify(nextValue);

    useEffect(() => {
        isOpen && props.type == "edit" && dataSelectedVariant.length == 0 && _ServerFetching();
        if (checkEqual(currentData, dataSelectedVariant)) {
            dataSelectedVariant.forEach((e) => {
                e.child.forEach((ce) => {
                    if (ce.name !== null) {
                        Axios(
                            "POST",
                            "/api_web/api_product/searchItemsVariants?csrf_protection=true",
                            {
                                data: {
                                    type: ce.type.value,
                                },
                            },
                            (err, response) => {
                                if (!err) {
                                    const { data } = response.data;
                                    ce.dataName = data?.items.map((item) => ({
                                        label: item.name,
                                        value: item.id,
                                    }));
                                }
                            }
                        );
                    }
                    if (ce.unit !== null) {
                        Axios(
                            "POST",
                            "/api_web/api_product/rowItem?csrf_protection=true",
                            {
                                data: {
                                    item_id: ce.name.value,
                                    type: ce.type.value,
                                },
                            },
                            (err, response) => {
                                if (!err) {
                                    const { data } = response.data;
                                    ce.dataUnit = data?.units.map((e) => ({
                                        label: e.unit,
                                        value: e.unitid,
                                    }));
                                }
                            }
                        );
                    }
                });
            });
        }
    }, [dataSelectedVariant]);

    const _ServerSending = () => {
        var formData = new FormData();

        formData.append("product_id", props?.id);

        dataSelectedVariant.forEach((item, i) => {
            formData.append(`items[${i}][product_variation_option_value_id]`, item?.value);

            item?.child.forEach((child, j) => {
                formData.append(`items[${i}][child][${j}][type_item]`, child.type?.value);
                formData.append(`items[${i}][child][${j}][item_id]`, child.name?.value);
                formData.append(`items[${i}][child][${j}][unit_id]`, child.unit?.value);
                formData.append(`items[${i}][child][${j}][quota]`, child.norm);
                formData.append(`items[${i}][child][${j}][loss]`, child.loss);
                formData.append(`items[${i}][child][${j}][stage_id]`, child.stage?.value || null);
            });
        });

        Axios("POST", "/api_web/api_product/designBOM?csrf_protection=true",
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        sIsOpen(false);
                        props.onRefresh && props.onRefresh();
                    } else {
                        isShow("error", props.dataLang[message]);
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const errNullType = dataSelectedVariant.map((item) => item.child.some((itemChild) => itemChild.type === null));
        const errNullName = dataSelectedVariant.map((item) => item.child.some((itemChild) => itemChild.name === null));
        if (errType || errName) {
            errNullType && sErrType(true);
            errNullName && sErrName(true);
            isShow("error", props.dataLang?.required_field_null);
        } else {
            sErrType(false);
            sErrName(false);
            sOnSending(true);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            sLoadingData(false);
        }, 2000);
    }, [loadingData]);

    return (
        <PopupEdit
            title={`${props.dataLang?.bom_design_finishedProduct || "bom_design_finishedProduct"} (${props.code} - ${props.name
                })`}

            button={
                <div
                    onClick={() => {
                        if (role || checkEdit || checkAdd) {
                            sIsOpen(true)
                        } else {
                            isShow("warning", WARNING_STATUS_ROLE)
                        }
                    }}
                    className={props.type == 'add' && "group outline-none transition-all ease-in-out flex items-center justify-start gap-1 hover:bg-slate-50 text-left cursor-pointer roundedw-full"}>
                    {props.type == "add" && <AttachCircle size={20} className="group-hover:text-green-500 group-hover:scale-110" />}
                    <button type="button" className="group-hover:text-green-500" >
                        {props.type == "add"
                            ? `${props.dataLang?.bom_design_finishedProduct || "bom_design_finishedProduct"}`
                            : `${props.dataLang?.edit || "edit"}`}
                    </button>
                </div>
            }
            open={isOpen}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[1100px]    space-y-2">
                {onFetching ? (
                    <Loading className="h-96" color="#0f4f9e" />
                ) : (
                    <>
                        <div className="flex justify-between items-end pb-2">
                            <div className="w-2/3">
                                <label className="text-[#344054] font-normal text-sm mb-1 ">
                                    {props.dataLang?.category_material_list_variant}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    closeMenuOnSelect={false}
                                    placeholder={props.dataLang?.category_material_list_variant}
                                    options={options}
                                    isSearchable={true}
                                    onChange={_HandleChangeSelect.bind(this)}
                                    noOptionsMessage={() => "Không có dữ liệu"}
                                    value={valueVariant}
                                    maxMenuHeight="200px"
                                    isClearable={true}
                                    isMulti
                                    menuPortalTarget={document.body}
                                    onMenuOpen={handleMenuOpen}
                                    components={{ MultiValue }}
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
                                />
                            </div>
                            <button
                                onClick={_HandleApplyVariant.bind(this)}
                                disabled={valueVariant?.length > 0 ? false : true}
                                className="disabled:grayscale outline-none px-4 py-2 rounded-lg bg-[#E2F0FE] text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition"
                            >
                                {props.dataLang?.apply || "apply"}
                            </button>
                        </div>
                        {dataSelectedVariant?.length > 0 && (
                            <div className="pb-2 flex space-x-3 items-center justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {dataSelectedVariant.map((e) => (
                                    <button
                                        key={e?.value}
                                        onClick={_HandleSelectTab.bind(this, e?.value)}
                                        className={`${tab == e?.value
                                            ? "text-[#0F4F9E] bg-[#0F4F9E10]"
                                            : "hover:text-[#0F4F9E] bg-slate-50/50"
                                            } outline-none min-w-fit pl-3 pr-10 py-1.5 rounded relative flex items-center`}
                                    >
                                        <span>{e?.label?.includes("NONE") ? "Mặc định" : e?.label}</span>
                                        <button
                                            type="button"
                                            onClick={_HandleDeleteBOM.bind(this, e?.value)}
                                            className="text-red-500 absolute right-0 px-2"
                                        >
                                            <IconDelete />
                                        </button>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="space-y-1 -pt-5">
                            <div className="grid grid-cols-13 w-full items-center bg-slate-100 p-2 z-10">
                                {/* <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-1 font-[400] text-center">
                  {props.dataLang?.no || "no"}
                </h4> */}
                                <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-4 font-[400]">
                                    {props.dataLang?.bom_name_finishedProduct}
                                </h4>
                                <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-2 font-[400] text-center">
                                    {props.dataLang?.unit}
                                </h4>
                                <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-2 font-[400] text-left">
                                    {props.dataLang?.norm_finishedProduct || "norm_finishedProduct"}
                                </h4>
                                <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-2 font-[400] text-left">
                                    %{props.dataLang?.loss_finishedProduct || "loss_finishedProduct"}
                                </h4>
                                <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-2 font-[400] text-left">
                                    {props.dataLang?.stage_usage_finishedProduct || "stage_usage_finishedProduct"}
                                </h4>
                                <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                    {props.dataLang?.branch_popup_properties || "branch_popup_properties"}
                                </h4>
                            </div>
                            <Customscrollbar
                                className="max-h-[250px]"
                            >
                                <div className="divide-y divide-slate-100 min:h-[170px]  max:h-[170px]">
                                    {loadingData ? (
                                        <Loading className="h-40" color="#0f4f9e" />
                                    ) : (
                                        <>
                                            {selectedList?.child?.map((e, index) => (
                                                <div
                                                    key={e.id}
                                                    className="py-1 px-2 grid grid-cols-13 w-full hover:bg-slate-100 items-center"
                                                >
                                                    <div className="col-span-2 ">
                                                        <Select
                                                            options={dataTypeCd}
                                                            value={e.type}
                                                            onChange={_HandleChangeItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id,
                                                                "type"
                                                            )}
                                                            placeholder={
                                                                props.dataLang?.warehouses_detail_type ||
                                                                "warehouses_detail_type"
                                                            }
                                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                            menuPortalTarget={document.body}
                                                            onMenuOpen={handleMenuOpen}
                                                            classNamePrefix="Select"
                                                            className={`${errType && e.type == null
                                                                ? "border-red-500"
                                                                : "border-transparent"
                                                                } Select__custom placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `}
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
                                                        />{" "}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Select
                                                            options={e.dataName}
                                                            value={e.name}
                                                            onChange={_HandleChangeItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id,
                                                                "name"
                                                            )}
                                                            onInputChange={_HandleSeachApi.bind(this, e.id, e?.type)}
                                                            formatOptionLabel={(option) => (
                                                                <div className="">
                                                                    <div className="flex gap-1">
                                                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-normal">
                                                                            {"Tên"}:
                                                                        </h2>
                                                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-normal">
                                                                            {option?.label}
                                                                        </h2>
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-normal">
                                                                            {"Biến thể"}:
                                                                        </h2>
                                                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-normal">
                                                                            {option?.product_variation}
                                                                        </h2>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            // formatOptionLabel={(option) => {
                                                            //   console.log("option", option);
                                                            // }}
                                                            placeholder={props.dataLang?.name || "name"}
                                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                            menuPortalTarget={document.body}
                                                            onMenuOpen={handleMenuOpen}
                                                            classNamePrefix="Select "
                                                            className={`${errName && e.name == null
                                                                ? "border-red-500"
                                                                : "border-transparent"
                                                                } Select__custom placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `}
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
                                                                menu: (provided, state) => ({
                                                                    ...provided,
                                                                    width: "180%",
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Select
                                                            options={e.dataUnit}
                                                            value={e.unit}
                                                            onChange={_HandleChangeItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id,
                                                                "unit"
                                                            )}
                                                            placeholder={props.dataLang?.unit}
                                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                            menuPortalTarget={document.body}
                                                            onMenuOpen={handleMenuOpen}
                                                            classNamePrefix="Select"
                                                            className={`${errName && e.name == null
                                                                ? "border-red-500"
                                                                : "border-transparent"
                                                                } Select__custom placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `}
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
                                                        />
                                                    </div>
                                                    <div className="col-span-2 px-1">
                                                        <InPutNumericFormat
                                                            value={e?.norm}
                                                            onValueChange={_HandleChangeItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id,
                                                                "norm"
                                                            )}
                                                            placeholder={
                                                                props.dataLang?.norm_finishedProduct ||
                                                                "norm_finishedProduct"
                                                            }
                                                            className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`}
                                                        />
                                                    </div>
                                                    <div className="col-span-2 px-1">
                                                        <InPutNumericFormat
                                                            isAllowed={(values) => {
                                                                const { floatValue } = values;
                                                                if (floatValue > 100) {
                                                                    isShow("error", "Vui lòng nhập nhỏ hơn hoặc bằng 100%");
                                                                    return false
                                                                }
                                                                return true
                                                            }}
                                                            value={e?.loss}
                                                            onValueChange={_HandleChangeItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id,
                                                                "loss"
                                                            )}
                                                            placeholder={`%${props.dataLang?.loss_finishedProduct ||
                                                                "loss_finishedProduct"
                                                                }`}
                                                            className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`}
                                                        />
                                                    </div>
                                                    <div className="col-span-2 px-1">
                                                        <Select
                                                            options={dataCd}
                                                            value={e.stage}
                                                            onChange={_HandleChangeItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id,
                                                                "stage"
                                                            )}
                                                            placeholder={
                                                                props.dataLang?.stage_usage_finishedProduct ||
                                                                "stage_usage_finishedProduct"
                                                            }
                                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                            menuPortalTarget={document.body}
                                                            onMenuOpen={handleMenuOpen}
                                                            className={`border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
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
                                                        />
                                                    </div>
                                                    <div className="col-span-1 px-1 text-center">
                                                        <button
                                                            onClick={_HandleDeleteItemBOM.bind(
                                                                this,
                                                                selectedList?.value,
                                                                e.id
                                                            )}
                                                            type="button"
                                                            className="text-red-500"
                                                        >
                                                            <IconDelete />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </Customscrollbar>
                            {dataSelectedVariant?.length > 0 && (
                                <button
                                    onClick={_HandleAddNew.bind(this, selectedList?.value)}
                                    type="button"
                                    title="Thêm"
                                    className={`hover:text-[#0F4F9E] hover:bg-[#e2f0fe] transition mt-5 w-full min-h-[100px] h-35 rounded-[5.5px] bg-slate-100 flex flex-col justify-center items-center`}
                                >
                                    <IconAdd />
                                    {props.dataLang?.bom_design_add_finishedProduct || "bom_design_add_finishedProduct"}
                                </button>
                            )}
                        </div>
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054]  font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                onClick={_HandleSubmit.bind(this)}
                                className="button text-[#FFFFFF] font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PopupEdit>
    );
});
export default Popup_Bom