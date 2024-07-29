import apiProducts from "@/Api/apiProducts/products/apiProducts";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import PopupCustom from "@/components/UI/popup";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useActionRole from "@/hooks/useRole";
import useToast from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { AttachCircle, Add as IconAdd, Trash as IconDelete } from "iconsax-react";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const Popup_Bom = React.memo((props) => {
    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [isOpen, sIsOpen] = useState(false);

    const isShow = useToast();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit } = useActionRole(auth, "products");

    const [loadingData, sLoadingData] = useState(false);

    const [onFetchingCd, sOnFetchingCd] = useState(false);

    const _ToggleModal = (e) => {
        sIsOpen(e);
        if (!e) {
            sTab(null);
        }
    };

    const [onSending, sOnSending] = useState(false);

    const [dataVariant, sDataVariant] = useState([]);

    const [valueVariant, sValueVariant] = useState(null);

    const [tab, sTab] = useState(null);

    const [selectedList, sSelectedList] = useState(null);

    const [dataTypeCd, sDataTypeCd] = useState([]);

    const [dataCd, sDataCd] = useState([]);

    const [dataSelectedVariant, sDataSelectedVariant] = useState([]);

    const _HandleSelectTab = (e) => {
        if (e == tab) return;
        sTab(e);
        const checkNull = dataSelectedVariant?.map((e) => {
            return {
                ...e,
                child: e?.child.filter((x) => x.name != null),
            };
        });
        sDataSelectedVariant(checkNull);
        sLoadingData(true);
        setTimeout(() => {
            sLoadingData(false);
        }, 1000);
        return () => clearTimeout();
    };

    const dataRestVariant = dataVariant?.filter(
        (item1) => !dataSelectedVariant?.some((item2) => item1?.label === item2?.label && item1?.value === item2?.value)
    );
    const [currentData, sCurrentData] = useState([]);

    const [errValue, sErrValue] = useState(false);

    useEffect(() => {
        isOpen && props?.id && sOnFetchingCd(true);
        isOpen && sLoadingData(false);
        isOpen && sErrValue(false);
        sDataSelectedVariant([]);
        sSelectedList({});
    }, [isOpen]);

    const { isFetching, isLoading, refetch } = useQuery({
        queryKey: ["detail_bom_product", props.id],
        queryFn: async () => {
            const { data } = await apiProducts.apiDetailBomProducts({ params: { id: props.id } })

            const newData = data?.variations?.map((e) => ({
                label: e?.name_variation,
                value: e?.product_variation_option_value_id,
                child: e?.items?.map((ce) => ({
                    id: ce?.id,
                    type: {
                        label: ce?.str_type_item,
                        value: ce?.type_item,
                    },
                    name: {
                        label: ce?.item_name,
                        value: ce?.item_id,
                        product_variation: ce?.variation_name,
                    },
                    unit: {
                        label: ce?.unit_name,
                        value: ce?.unit_id,
                    },
                    norm: Number(ce?.quota),
                    loss: Number(ce?.loss),
                    stage: {
                        label: ce?.stage_name,
                        value: ce?.stage_id,
                    },
                })),
            }));

            sDataSelectedVariant(newData);

            sCurrentData(newData);

            return data
        },
        enabled: isOpen && props.type == "edit"
    })

    const _ServerFetchingCd = async () => {
        try {
            const { data } = await apiProducts.apiDataDesignBomProducts()
            sDataTypeCd(Object.entries(data.typeDesignBom).map(([key, value]) => ({
                label: value,
                value: key,
            })));

            sDataCd(data.stages.map((e) => ({ label: e?.name, value: e?.id })));

            const { rResult } = await apiProducts.apiProductVariationOption(props.id)

            const newData = rResult[0]?.product_variation?.includes("NONE")
                ? [
                    {
                        label: "Mặc định",
                        value: rResult[0]?.id,
                        child: [],
                    },
                ]
                : rResult.map((e) => ({
                    label: e?.product_variation,
                    value: e?.id,
                    child: [],
                }));

            const convertArr = newData?.map((e) => {
                if (e?.label == "(NONE)") {
                    return {
                        ...e,
                        label: "Mặc định",
                    };
                }
                return e;
            });

            sDataVariant(convertArr);

        } catch (error) {

        } finally {
            sOnFetchingCd(false);
        }
    };

    useEffect(() => {
        onFetchingCd && _ServerFetchingCd();
    }, [onFetchingCd]);

    const hiddenOptions = valueVariant?.length > 2 ? valueVariant?.slice(0, 2) : [];

    const options = dataRestVariant.filter((x) => !hiddenOptions.includes(x?.value));

    const _HandleChangeSelect = (value) => {
        const newValue = value?.map((e) => {
            const checkValue = currentData.find((x) => x?.value == e?.value);
            if (checkValue) {
                return {
                    ...checkValue,
                    label: checkValue.label == "NONE" ? "Mặc định" : checkValue.label,
                };
            }
            return e;
        });
        sValueVariant(newValue);
    };

    useEffect(() => {
        if (isOpen && dataSelectedVariant?.length == 0 && dataVariant?.length > 0) {
            const newValue = dataVariant?.map((e) => {
                const checkValue = currentData.find((x) => x?.value == e?.value);
                if (checkValue?.value == e?.value) {
                    return checkValue;
                }
                return e;
            }).filter((x) => x?.label == "(NONE)");
            if (props.type == "edit") {
                dataSelectedVariant.push({ ...newValue[0] });
                _HandleAddNew(newValue[0]?.value);
            } else {
                const newData = {
                    ...dataVariant[0],
                    label: "NONE",
                };
                dataSelectedVariant.push({ ...newData });
                sTab(newData?.value);
                _HandleAddNew(newData?.value);
            }
        }
    }, [dataSelectedVariant, isOpen, dataVariant]);

    useEffect(() => {
        if (selectedList?.child?.length == 0) {
            _HandleAddNew(tab);
        }
    }, [selectedList, isOpen]);

    const _HandleApplyVariant = () => {
        const newData = valueVariant?.filter((x) => dataSelectedVariant.some((e) => e?.value != x?.value));
        if (valueVariant.some((x) => dataSelectedVariant.some((e) => e?.value == x?.value))) {
            return isShow("error", "Biến thể đã được chọn vui lòng bỏ chọn");
        }
        if (newData.length > 0) {
            dataSelectedVariant?.push(...newData);
        } else {
            dataSelectedVariant?.push(...valueVariant);
        }
        sValueVariant([]);
    };

    const _HandleAddNew = (id) => {
        let itemFound = false;
        const newData = dataSelectedVariant.map((item) => {
            if (item?.value == id) {
                itemFound = true;
                const childArray = Array.isArray(item.child) ? item.child : [];
                return {
                    ...item,
                    child: [
                        ...childArray,
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
            }
            return item;
        });

        if (itemFound) {
            sDataSelectedVariant(newData);
        } else {
            isShow("error", "Vui lòng chọn biến thể");
        }
    };

    const _HandleDeleteItemBOM = (parentId, id) => {
        const index = dataSelectedVariant.findIndex((obj) => obj?.value === parentId);
        const newData = [...dataSelectedVariant];
        const newChild = newData[index].child.filter((item) => item.id !== id);
        newData[index] = { ...newData[index], child: newChild };
        if (selectedList?.child?.length == 1) {
            return isShow("error", "Phải có ít nhất 1 thành phần BOM");
        }
        sDataSelectedVariant(newData);
    };

    const _HandleSeachApi = debounce(async (value, Idparent, type, id, name) => {
        try {
            const { data } = await apiProducts.apiSearchItemsVariants({ data: { term: value, type: type?.value } })

            const getdata = data?.items?.map((item) => ({
                label: item?.name,
                value: item?.id,
                product_variation: item?.product_variation,
            }));

            if (value) {
                const newDb = dataSelectedVariant.map((e) => {
                    if (e?.value == Idparent) {
                        return {
                            ...e,
                            child: e?.child?.map((x) => {
                                if (x.id == id) {
                                    return {
                                        ...x,
                                        dataName: getdata,
                                    };
                                }
                                return x;
                            }),
                        };
                    }
                    return e;
                });
                sDataSelectedVariant([...newDb]);
            }
        } catch (error) {
        }
    }, 500);

    const _HandleChangeItemBOM = async (parentId, childId, type, value) => {
        const newData = dataSelectedVariant.map((parent) => {
            if (parent?.value === parentId) {
                const newChild = parent?.child.map((child) => {
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
            const found = newData.find((parent) => parent?.value === parentId);
            if (found) {
                const child = found.child.find((child) => child?.id === childId);
                if (child) {
                    const type = child.type?.value;
                    try {
                        const { data } = await apiProducts.apiSearchItemsVariants({ data: { type: type } })
                        const updatedData = newData.map((parent) => {
                            if (parent?.value === parentId) {
                                const newChild = parent?.child.map((child) => {
                                    if (child?.id === childId) {
                                        return {
                                            ...child,
                                            name: null,
                                            unit: null,
                                            norm: 0,
                                            loss: 0,
                                            stage: null,
                                            dataName: data?.items ? data?.items.map((e) => ({
                                                label: e.name,
                                                value: e.id,
                                                product_variation: e?.product_variation,
                                            })) : [],
                                        };
                                    }
                                    return child;
                                });
                                return { ...parent, child: newChild };
                            }
                            return parent;
                        });
                        sDataSelectedVariant(updatedData);
                    } catch (error) {

                    }
                }
            }
        }
        if (type === "name") {
            const found = newData.find((parent) => parent?.value === parentId);
            if (found) {
                const child = found.child.find((child) => child?.id === childId);
                if (child) {
                    const name = child.name?.value;
                    const type = child.type?.value;
                    try {
                        const { data } = await apiProducts.apiRowItem({
                            data: {
                                item_id: name,
                                type: type,
                            },
                        })
                        const updatedData = newData.map((parent) => {
                            if (parent?.value === parentId) {
                                const newChild = parent.child.map((child) => {
                                    if (child?.id === childId) {
                                        return {
                                            ...child,
                                            name: value,
                                            unit: null,
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
                    } catch (error) {

                    }
                }
            }
        }
    };

    const _HandleDeleteBOM = (id) => {
        const newData = dataSelectedVariant.filter((item) => item?.value !== id);
        if (newData?.length == 0) {
            return isShow("error", "Thiết kế BOM phải có ít nhất 1 biến thể");
        }
        setTimeout(() => {
            sLoadingData(false);
            sTab(newData[newData?.length - 1]?.value);
        }, 100);
        sDataSelectedVariant(newData);
        return () => clearTimeout();
    };

    useEffect(() => {
        if (isOpen && (tab || dataSelectedVariant)) {
            const newData = dataSelectedVariant?.find((item) => item?.value == tab);
            sSelectedList(newData);
        }
    }, [tab, dataSelectedVariant, isOpen]);

    const checkEqual = (prevValue, nextValue) => {
        return prevValue && nextValue && JSON.stringify(prevValue) == JSON.stringify(nextValue);
    };

    useEffect(() => {
        if (checkEqual(currentData, dataSelectedVariant)) {
            dataSelectedVariant.forEach((e) => {
                e?.child.forEach(async (ce) => {
                    if (ce.name != null) {
                        try {
                            const { data } = await apiProducts.apiSearchItemsVariants({
                                data: {
                                    type: type,
                                }
                            })
                            ce.dataName = data?.items.map((item) => ({
                                label: item?.name,
                                value: item?.id,
                                product_variation: item?.product_variation,
                            }));
                        } catch (error) {
                        }
                    }
                    if (ce.unit != null) {
                        try {
                            const { data } = await apiProducts.apiRowItem({
                                data: {
                                    item_id: ce?.unit?.value,
                                    type: ce?.type?.value,
                                },
                            })
                            ce.dataUnit = data?.units.map((e) => ({
                                label: e?.unit,
                                value: e?.unitid,
                            }));
                        } catch (error) {
                        }
                    }
                });
            });
        }
        const checkTab = dataSelectedVariant.some((x) => x.value == tab);
        if (checkTab) {
            return;
        }
        if (props.type == "edit") {
            sTab(dataSelectedVariant[0]?.value ?? selectedList?.value);
        } else {
            sTab(dataSelectedVariant[0]?.value);
        }
    }, [dataSelectedVariant]);


    const _ServerSending = async () => {
        let formData = new FormData();
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

        try {
            const { isSuccess, message } = await apiProducts.apiHandingBom(formData)
            if (isSuccess) {
                isShow("success", props.dataLang[message] || message);
                props.onRefresh && props.onRefresh();
                props.onRefreshBom && props.onRefreshBom();
                sIsOpen(false);
                return;
            }
            isShow("error", props.dataLang[message] || message);
        } catch (error) {
        } finally {
            sOnSending(false);
        }

    };

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const checkValue = dataSelectedVariant.some((item) =>
            item.child.some((itemChild) => !itemChild.type || !itemChild.name || !itemChild.stage)
        );
        if (checkValue) {
            checkValue && sErrValue(true);
            isShow("error", props.dataLang?.required_field_null);
        } else {
            sErrValue(false);
            sOnSending(true);
        }
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    return (
        <PopupCustom
            title={`${props.dataLang?.bom_design_finishedProduct || "bom_design_finishedProduct"} (${props.code} - ${props.name
                })`}
            button={
                <div
                    onClick={() => {
                        if (props.bom) {
                            isShow("error", props.dataLang?.bom_had || "bom_had");
                            return;
                        } else if ((role || checkEdit || checkAdd) && !props.bom) {
                            sIsOpen(true);
                        } else {
                            isShow("warning", WARNING_STATUS_ROLE);
                        }
                    }}
                    className={
                        props.type == "add"
                            ? "group outline-none transition-all ease-in-out flex items-center justify-start gap-1 hover:bg-slate-50 text-left cursor-pointer roundedw-full "
                            : "text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                    }
                >
                    {props.type == "add" && (
                        <AttachCircle size={20} className="group-hover:text-green-500 group-hover:scale-110" />
                    )}
                    <button type="button" className="group-hover:text-green-500">
                        {props.type == "add"
                            ? `${props.dataLang?.bom_design_finishedProduct || "bom_design_finishedProduct"}`
                            : `${props.dataLang?.edit_bom || "edit_bom"}`}
                    </button>
                </div>
            }
            open={isOpen}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[1100px]    space-y-2">
                <>
                    <div className="flex justify-between items-end pb-2">
                        <div className="w-2/3">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props.dataLang?.category_material_list_variant} <span className="text-red-500">*</span>
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
                        <div className="flex items-center justify-end gap-2">
                            <OnResetData sOnFetching={() => { }} onClick={() => refetch()} />
                            <button
                                onClick={_HandleApplyVariant.bind(this)}
                                disabled={valueVariant?.length > 0 ? false : true}
                                className="disabled:grayscale outline-none px-4 py-2 rounded-lg bg-[#E2F0FE] text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition"
                            >
                                {props.dataLang?.apply || "apply"}
                            </button>
                        </div>
                    </div>
                    {dataSelectedVariant?.length > 0 && (
                        <div className="pb-2 flex space-x-3 items-center justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {dataSelectedVariant.map((e) => (
                                <div className="flex">
                                    <button
                                        key={e?.value}
                                        onClick={_HandleSelectTab.bind(this, e?.value)}
                                        className={`${tab == e?.value
                                            ? "text-[#0F4F9E] bg-[#0F4F9E10]"
                                            : "hover:text-[#0F4F9E] bg-slate-50/50"
                                            } outline-none min-w-fit pl-3 pr-10 py-1.5 rounded relative flex items-center whitespace-nowrap`}
                                    >
                                        <span>{e?.label?.includes("NONE") ? "Mặc định" : e?.label}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={_HandleDeleteBOM.bind(this, e?.value)}
                                        className="text-red-500"
                                    >
                                        <IconDelete />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="space-y-1 -pt-5">
                        <HeaderTablePopup gridCols={14}>
                            <ColumnTablePopup colSpan={5}>{props.dataLang?.bom_name_finishedProduct}</ColumnTablePopup>
                            <ColumnTablePopup colSpan={2}>{props.dataLang?.unit}</ColumnTablePopup>
                            <ColumnTablePopup colSpan={2} textAlign={"left"}>
                                {props.dataLang?.norm_finishedProduct || "norm_finishedProduct"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={2} textAlign={"left"}>
                                %{props.dataLang?.loss_finishedProduct || "loss_finishedProduct"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={2} textAlign={"left"}>
                                {props.dataLang?.stage_usage_finishedProduct || "stage_usage_finishedProduct"}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {props.dataLang?.branch_popup_properties || "branch_popup_properties"}
                            </ColumnTablePopup>
                        </HeaderTablePopup>
                        <Customscrollbar className="max-h-[250px]">
                            <div className="divide-y divide-slate-100 min:h-[170px]  max:h-[170px]">
                                {isLoading || isFetching || loadingData ? (
                                    <Loading className="h-40" color="#0f4f9e" />
                                ) : (
                                    <>
                                        {selectedList?.child?.map((e, index) => (
                                            <div
                                                key={e.id}
                                                className="py-1 px-2 grid grid-cols-14 w-full hover:bg-slate-100 items-center"
                                            >
                                                <div className="col-span-3">
                                                    <Select
                                                        options={dataTypeCd}
                                                        value={e.type}
                                                        onChange={_HandleChangeItemBOM.bind(
                                                            this,
                                                            selectedList?.value,
                                                            e.id,
                                                            "type"
                                                        )}
                                                        placeholder={props.dataLang?.warehouses_detail_type || "warehouses_detail_type"}
                                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={handleMenuOpen}
                                                        classNamePrefix="Select"
                                                        className={`${errValue && e.type == null ? "border-red-500" : "border-transparent"} 
                                                        [&>div>div_div]:!whitespace-nowrap placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `}
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
                                                                width: "150%",
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
                                                        onInputChange={(x) => {
                                                            _HandleSeachApi(
                                                                x,
                                                                selectedList?.value,
                                                                e?.type,
                                                                e.id,
                                                                e.name
                                                            )
                                                        }

                                                        }
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
                                                        placeholder={props.dataLang?.name || "name"}
                                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={handleMenuOpen}
                                                        classNamePrefix="Select "
                                                        className={`${errValue && e.name == null
                                                            ? "border-red-500"
                                                            : "border-transparent"
                                                            } Select__custom white placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `}
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
                                                        className={`${errValue && e.unit == null
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
                                                            menu: (provided, state) => ({
                                                                ...provided,
                                                                width: "150%",
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
                                                        placeholder={props.dataLang?.norm_finishedProduct || "norm_finishedProduct"}
                                                        className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`}
                                                    />
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <InPutNumericFormat
                                                        isAllowed={(values) => {
                                                            const { floatValue } = values;
                                                            if (floatValue > 100) {
                                                                isShow("error", "Vui lòng nhập nhỏ hơn hoặc bằng 100%");
                                                                return false;
                                                            }
                                                            return true;
                                                        }}
                                                        value={e?.loss}
                                                        onValueChange={_HandleChangeItemBOM.bind(
                                                            this,
                                                            selectedList?.value,
                                                            e.id,
                                                            "loss"
                                                        )}
                                                        placeholder={`%${props.dataLang?.loss_finishedProduct || "loss_finishedProduct"}`}
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
                                                        placeholder={props.dataLang?.stage_usage_finishedProduct || "stage_usage_finishedProduct"}
                                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={handleMenuOpen}
                                                        className={`${errValue && e.stage == null
                                                            ? "border-red-500"
                                                            : "border-transparent"
                                                            } [&>div>div_div]:!whitespace-nowrap placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `}
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
                                                                width: "150%",
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
            </div>
        </PopupCustom>
    );
});
export default Popup_Bom;
