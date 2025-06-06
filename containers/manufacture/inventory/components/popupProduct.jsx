import apiInventory from "@/Api/apiManufacture/warehouse/inventory/apiInventory";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import PopupCustom from "@/components/UI/popup";
import { optionsQuery } from "@/configs/optionsQuery";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { CreatableSelectCore } from "@/utils/lib/CreatableSelect";
import { SelectCore } from "@/utils/lib/Select";
import { useQuery } from "@tanstack/react-query";
import { Add as IconAdd, Calendar as IconCalendar, Trash as IconDelete, ArrowDown2 as IconDown, Image as IconImage, } from "iconsax-react";
import { debounce } from "lodash";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useInventoryItems } from "../hooks/useInventoryItems";
const PopupProduct = React.memo((props) => {
    const isShow = useToast();
    const scrollAreaRef = useRef(null);
    const dataSeting = useSetingServer();
    const [open, sOpen] = useState(false);
    const [product, sProduct] = useState(null);
    const [searchItems, setSearchItems] = useState("");
    const [listAllProduct, sListAllProduct] = useState([]);
    const dataPstWH = useSelector((state) => state.location_inventory);
    const { data: dataProduct, isFetching } = useInventoryItems(searchItems);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const _TogglePopup = (e) => sOpen(e);

    const _CheckWareHouse = () => {
        if (props.warehouse !== null) {
            sOpen(true);
        } else {
            isShow("error", "Vui lòng chọn kho hàng");
            props.sErrWareHouse(true);
        }
    };

    useEffect(() => {
        open && sListAllProduct([]);
        open && sProduct(null);
    }, [open]);

    const _HandleChangeValue = (value) => {
        sProduct(value);
    };
    const _HandleInputChange = debounce(async (inputValue) => {
        try {
            setSearchItems(inputValue);
        } catch (error) { }
    }, 500);

    const { isFetching: isFetchingProduct } = useQuery({
        queryKey: ["api_inventory_by_id", product?.value, props.warehouse?.value],
        queryFn: async () => {
            const { isSuccess } = await apiInventory.apiGetVariantInventory({
                data: {
                    id: product?.value,
                    warehouse_id: props.warehouse?.value,
                },
            });
            sListAllProduct(isSuccess?.result?.map((e) => ({
                id: e.id,
                code: e.code,
                name: e.name,
                img: e.images,
                variant: e.product_variation,
                type: e.text_type,
                checkExpiry: e.expiry,
                checkSerial: e.serial,
                show: false,
                dataLot: e.lot_array?.map((e) => ({
                    label: e,
                    value: e,
                })),
                dataSerial: e.serial_array?.length > 0 ? e.serial_array?.map((e) => ({
                    label: e,
                    value: e,
                })) : [],
                child: [],
                checkChild: e?.warehouse?.map((ce) => ({
                    amount: null,
                    quantity: Number(ce.quantity),
                    serial: ce.serial,
                    lot: ce.lot,
                    date: moment(ce.expiration_date).format("DD/MM/yyyy"),
                    locate: ce.location_id,
                })) || [],
            })).filter((e) => !props.dataChoose.some((ce) => e.id === ce.id)));
        },
        enabled: open && !!product,
        ...optionsQuery
    })

    const _HandleActionItem = (id, type) => {
        if (type === "add") {
            const newData = listAllProduct.map((e) => {
                if (e.id === id) {
                    e.child.push({
                        id: Date.now(),
                        locate: null,
                        amount: null,
                        lot: null,
                        date: null,
                        serial: null,
                        quantity: null,
                        price: null,
                    });
                    return { ...e, show: true };
                }
                return e;
            });
            sListAllProduct([...newData]);
        } else if (type === "show") {
            const newData = listAllProduct.map((e) => {
                if (e.id === id) {
                    return { ...e, show: !e.show };
                } else {
                    return e;
                }
            });
            sListAllProduct([...newData]);
        }
    };

    const _HandleDeleteChild = (parentId, id) => {
        const newData = listAllProduct.map((e) => {
            if (e.id === parentId) {
                const newChild = e.child?.filter((ce) => ce.id !== id);
                return { ...e, child: newChild };
            }
            return e;
        });
        sListAllProduct([...newData]);
    };

    const _HandleChangeChild = (parentId, id, type, value) => {
        const newData = listAllProduct.map((e) => {
            if (e.id === parentId) {
                const newChild = e.child?.map((ce) => {
                    if (ce.id === id) {
                        if (type === "amount") {
                            return { ...ce, amount: Number(value?.value) };
                        } else if (type === "locate") {
                            ce.locate = value;
                            e?.checkExpiry == "1" &&
                                ce?.locate !== null &&
                                ce?.lot !== null &&
                                ce.date !== null &&
                                _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            e?.checkSerial == "1" &&
                                ce?.locate !== null &&
                                ce?.serial !== null &&
                                _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            e?.checkExpiry == "0" &&
                                e?.checkSerial == "0" &&
                                _HandleCheckSameLoca(parentId, id, ce?.locate);
                            return { ...ce };
                        } else if (type === "lot") {
                            ce.lot = value;
                            ce?.locate !== null &&
                                ce?.lot !== null &&
                                ce.date !== null &&
                                _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            return { ...ce };
                        } else if (type === "date") {
                            ce.date = value;
                            ce?.locate !== null &&
                                ce?.lot !== null &&
                                ce.date !== null &&
                                _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            return { ...ce };
                        } else if (type === "serial") {
                            ce.serial = value?.target.value;
                            ce?.locate !== null &&
                                ce?.serial !== null &&
                                _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            setTimeout(() => {
                                return { ...ce };
                            }, 3000);
                        } else if (type === "price") {
                            return { ...ce, price: Number(value?.value) };
                        }
                    }
                    return ce;
                });
                return { ...e, child: newChild };
            }
            return e;
        });
        sListAllProduct([...newData]);
    };

    const _HandleCheckSameLot = (parentId, id, locate, lot, date) => {
        setTimeout(() => {
            const newData = listAllProduct.map((e) => {
                if (e.id === parentId) {
                    const checkData = e.child?.filter((ce) => ce?.id !== id)?.some((item) =>
                        item?.locate?.value === locate?.value &&
                        item.lot?.value === lot?.value &&
                        moment(item.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy")
                    );
                    const newChild = e.child?.map((ce) => {
                        if (ce.id == id && checkData) {
                            isShow("error", `Trùng mặt hàng`);
                            return {
                                ...ce,
                                locate: null,
                                amount: null,
                                lot: null,
                                date: null,
                                serial: null,
                                quantity: null,
                                price: null,
                            };
                        }
                        return ce;
                    }).filter((item) => item.locate !== null);
                    return { ...e, child: newChild };
                }
                return e;
            });
            const parent = newData.find((item) => item.id === parentId);
            if (!parent) return null;
            const child = parent.child.find((e) => e.id === id) || null;
            // if(!child) return null;
            const check = parent.checkChild.find((e) =>
                e.locate === child?.locate?.value &&
                e.lot === child.lot?.value &&
                e.date === moment(child.date).format("DD/MM/yyyy")
            );
            const newData1 = newData.map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child?.map((ce) => {
                        if (ce.id === id) {
                            return { ...ce, quantity: check?.quantity || 0 };
                        }
                        return ce;
                    });
                    return { ...e, child: newChild };
                }
                return e;
            });
            sListAllProduct([...newData1]);
        }, 500);
    };

    const _HandleCheckSameSerial = (parentId, id, locate, serial) => {
        setTimeout(() => {
            const dataChild = listAllProduct?.map((e) => e?.child)?.flatMap((innerList) => innerList);
            const checkData = dataChild?.some((item) => item?.serial === serial && item?.id !== id);

            const newData = listAllProduct?.map((e) => {
                if (e.id === parentId && checkData) {
                    isShow("error", `Trùng serial`);
                    return {
                        ...e,
                        child: e?.child?.filter((ce) => ce?.id !== id),
                    };
                }
                return e;
            });
            // sLoadingData(true)
            const parent = newData.find((item) => item.id === parentId);
            if (!parent) return null;
            const child = parent.child.find((e) => e.id === id) || null;
            const check = parent.checkChild.find(
                (e) => e.locate === child?.locate?.value && e.serial === child?.serial
            );
            const newData1 = newData.map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child?.map((ce) => {
                        if (ce.id === id) {
                            return { ...ce, quantity: check?.quantity || 0 };
                        }
                        return ce;
                    });
                    return { ...e, child: newChild };
                }
                return e;
            });

            sListAllProduct([...newData1]);
        }, 1000);
    };

    const _HandleCheckSameLoca = (parentId, id, locate) => {
        setTimeout(() => {
            const newData = listAllProduct.map((e) => {
                if (e.id === parentId) {
                    const checkData = e.child?.filter((ce) => ce?.id !== id)?.some((item) => item?.locate?.value === locate?.value);
                    const newChild = e.child?.map((ce) => {
                        if (ce.id == id && checkData) {
                            isShow("error", `Trùng mặt hàng`);
                            return {
                                ...ce,
                                locate: null,
                                amount: null,
                                lot: null,
                                date: null,
                                serial: null,
                                quantity: null,
                                price: null,
                            };
                        }
                        return ce;
                    }).filter((item) => item.locate !== null);
                    return { ...e, child: newChild };
                }
                return e;
            });
            // sLoadingData(true)

            const parent = newData.find((item) => item.id === parentId);
            if (!parent) return null;
            const child = parent.child.find((e) => e.id === id) || null;
            const check = parent.checkChild.find((e) => e.locate === child?.locate?.value);
            const newData1 = newData.map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child?.map((ce) => {
                        if (ce.id === id) {
                            return { ...ce, quantity: check?.quantity || 0 };
                        }
                        return ce;
                    });
                    return { ...e, child: newChild };
                }
                return e;
            });

            sListAllProduct([...newData1]);
        }, 1000);
    };

    const _HandleChooseItem = (e) => {
        e.preventDefault();
        const newData = listAllProduct.filter((e) => e.child.length > 0);
        props.sDataChoose([...props.dataChoose, ...newData]);
        sOpen(false);
        props.sDataErr(false);
    };

    return (
        <PopupCustom
            title={"Thêm mặt hàng để kiểm kê"}
            button={`+   Thêm mặt hàng`}
            onClickOpen={_CheckWareHouse.bind(this)}
            open={open}
            onClose={_TogglePopup.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[1000px] 2xl:space-y-5 space-y-4">
                {/* {isFetching ? (
                    <Loading className="h-60" color="#0f4f9e" />
                ) : ( */}
                    <div className="space-y-1">
                        <label>Mặt hàng</label>
                        <Select
                            options={dataProduct}
                            value={product}
                            onChange={_HandleChangeValue.bind(this)}
                            placeholder="Chọn mặt hàng"
                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                            onInputChange={(e) => {
                                _HandleInputChange(e);
                            }}
                            className={`border-transparent placeholder:text-slate-300 w-full z-[99999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                            style={{
                                border: "none",
                                boxShadow: "none",
                                outline: "none",
                            }}
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
                                control: (base, state) => ({
                                    ...base,
                                    boxShadow: "none",
                                    ...(state.isFocused && {
                                        border: "0 0 0 1px #92BFF7",
                                    }),
                                }),
                            }}
                            formatOptionLabel={(option) => (
                                <div className="flex items-center space-x-5 cursor-pointer">
                                    {option.img != null ? (
                                        <img
                                            src={option.img}
                                            alt="Product Image"
                                            className="object-cover rounded w-14 h-14"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center bg-gray-200 rounded w-14 h-14">
                                            <IconImage />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium">{option?.name}</h3>
                                        <h5 className="text-gray-400 font-[400]">{option.code}</h5>
                                        <h5 className="text-xs font-medium text-gray-400">
                                            {props.dataLang[option.type]}
                                        </h5>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                {/* )} */}
                {isFetchingProduct ? (
                    <Loading className="h-60" color="#0f4f9e" />
                ) : (
                    <>
                        {listAllProduct?.length > 0 && (
                            <Customscrollbar className="max-h-[400px] h-[400px]  min-h-[350px]">
                                <div className="space-y-1.5">
                                    {listAllProduct?.map((e) => (
                                        <div className="space-y-2" key={e.id}>
                                            <div className="flex items-center justify-between pr-3">
                                                <div className="flex items-center w-full space-x-3">
                                                    {e.img != null ? (
                                                        <Image
                                                            src={e.img}
                                                            alt="Product Image"
                                                            height={52}
                                                            width={52}
                                                            quality={100}
                                                            className="object-cover rounded w-[56px] h-[56px]"
                                                            loading="lazy"
                                                            crossOrigin="anonymous"
                                                            placeholder="blur"
                                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center bg-gray-200 rounded w-14 h-14">
                                                            <IconImage />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium">{e.name}</h3>
                                                        <h5 className="text-gray-400 font-[400] text-sm">
                                                            {e.code}
                                                            <span className="text-[#0F4F9E] font-medium ml-3">
                                                                {e.variant}
                                                            </span>
                                                        </h5>
                                                        <h5 className="text-xs font-medium text-gray-400">
                                                            {props.dataLang[e.type]}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-5">
                                                    {e.child?.length > 0 && (
                                                        <button
                                                            onClick={_HandleActionItem.bind(this, e.id, "show")}
                                                            className={`${e.show ? "rotate-180" : "rotate-0"
                                                                } transition w-6 h-6 rounded-full flex flex-col justify-center items-center bg-blue-200 text-blue-700`}
                                                        >
                                                            <IconDown size="15" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={_HandleActionItem.bind(this, e.id, "add")}
                                                        className="flex flex-col items-center justify-center w-10 h-10 transition rounded bg-slate-50 hover:bg-slate-100 "
                                                    >
                                                        <IconAdd />
                                                    </button>
                                                </div>
                                            </div>
                                            {e.child?.length > 0 && e.show && (
                                                <div className="w-full space-y-1">
                                                    <div
                                                        className={`${e?.checkExpiry == "0" && e?.checkSerial == "0"
                                                            ? "grid-cols-5"
                                                            : e?.checkExpiry == "1"
                                                                ? "grid-cols-7"
                                                                : "grid-cols-6"
                                                            } grid gap-2 items-center`}
                                                    >
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            Vị trí kho
                                                        </h5>
                                                        {e?.checkExpiry == "1" && (
                                                            <h5 className="font-[300] text-sm px-1 text-center">LOT</h5>
                                                        )}
                                                        {e?.checkExpiry == "1" && (
                                                            <h5 className="font-[300] text-sm px-1 text-center">
                                                                Date
                                                            </h5>
                                                        )}
                                                        {e?.checkSerial == "1" && (
                                                            <h5 className="font-[300] text-sm px-1 text-center">
                                                                Serial
                                                            </h5>
                                                        )}
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            SL phần mềm
                                                        </h5>
                                                        <h5 className="font-[300] text-sm px-1 text-center">SL thực</h5>
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            Chênh lệch
                                                        </h5>
                                                        <h5 className="font-[300] text-sm px-1 text-center">Tác vụ</h5>
                                                    </div>
                                                    <div
                                                        className={`${e?.checkExpiry == "0" && e?.checkSerial == "0"
                                                            ? "grid-cols-5"
                                                            : e?.checkExpiry == "1"
                                                                ? "grid-cols-7"
                                                                : "grid-cols-6"
                                                            } grid gap-2 items-center`}
                                                    >
                                                        {e.child.map((ce) => (
                                                            <React.Fragment key={ce.id}>
                                                                <div className="px-1">
                                                                    <SelectCore
                                                                        options={dataPstWH}
                                                                        value={ce.locate}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "locate"
                                                                        )}
                                                                        placeholder={"Vị trí kho"}
                                                                        isClearable={true}
                                                                        classNamePrefix="Select"
                                                                        className={`Select__custom border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
                                                                        isSearchable={true}
                                                                        noOptionsMessage={() =>
                                                                            `${props.dataLang?.no_data_found}`
                                                                        }
                                                                        menuPortalTarget={document.body}
                                                                        onMenuOpen={handleMenuOpen}
                                                                        style={{
                                                                            border: "none",
                                                                            boxShadow: "none",
                                                                            outline: "none",
                                                                        }}
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
                                                                            control: (base, state) => ({
                                                                                ...base,
                                                                                boxShadow: "none",
                                                                                ...(state.isFocused && {
                                                                                    border: "0 0 0 1px #92BFF7",
                                                                                }),
                                                                            }),
                                                                        }}
                                                                    />
                                                                </div>
                                                                {e?.checkExpiry == "1" && (
                                                                    // lot
                                                                    <div className="px-1">
                                                                        <CreatableSelectCore
                                                                            options={e?.dataLot}
                                                                            placeholder={"Lot"}
                                                                            onChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "lot"
                                                                            )}
                                                                            isClearable={true}
                                                                            classNamePrefix="Select"
                                                                            className={`Select__custom removeDivide border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
                                                                            isSearchable={true}
                                                                            noOptionsMessage={() => `Chưa có gợi ý`}
                                                                            formatCreateLabel={(value) =>
                                                                                `Tạo "${value}"`
                                                                            }
                                                                            menuPortalTarget={document.body}
                                                                            onMenuOpen={handleMenuOpen}
                                                                            style={{
                                                                                border: "none",
                                                                                boxShadow: "none",
                                                                                outline: "none",
                                                                            }}
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
                                                                                control: (base, state) => ({
                                                                                    ...base,
                                                                                    boxShadow: "none",
                                                                                    ...(state.isFocused && {
                                                                                        border: "0 0 0 1px #92BFF7",
                                                                                    }),
                                                                                }),
                                                                                dropdownIndicator: (base) => ({
                                                                                    ...base,
                                                                                    display: "none",
                                                                                }),
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {e?.checkExpiry == "1" && (
                                                                    // date
                                                                    <div className="relative flex items-center px-1">
                                                                        <DatePicker
                                                                            dateFormat="dd/MM/yyyy"
                                                                            placeholderText="date"
                                                                            selected={ce?.date}
                                                                            onChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "date"
                                                                            )}
                                                                            className={`focus:border-[#92BFF7] border-[#d0d5dd] bg-transparent placeholder:text-slate-300 w-full rounded text-[#52575E] p-2 border outline-none text-[13px] relative`}
                                                                        />
                                                                        <IconCalendar
                                                                            size={22}
                                                                            className="absolute right-3 text-[#cccccc]"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {e?.checkSerial == "1" && (
                                                                    // serial
                                                                    <div className="px-1">
                                                                        <input
                                                                            value={ce?.serial}
                                                                            onChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "serial"
                                                                            )}
                                                                            className="w-full px-2 py-1 font-medium text-center border-b-2 border-gray-200 focus:outline-none"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <h6 className="self-center px-1 text-center">
                                                                    {formatNumber(ce?.quantity)}
                                                                </h6>
                                                                <div className="self-center px-1 text-center">
                                                                    <InPutNumericFormat
                                                                        value={ce?.amount}
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "amount"
                                                                        )}
                                                                        className="w-20 px-2 py-1 font-medium text-center border-b-2 border-gray-200 focus:outline-none"
                                                                        isAllowed={(values) => {
                                                                            const { floatValue } = values;
                                                                            if (e?.checkSerial == "1") {
                                                                                return (
                                                                                    floatValue >= 0 && floatValue < 2
                                                                                );
                                                                            } else {
                                                                                return floatValue >= 0;
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                <h6 className="self-center px-1 text-center">
                                                                    {ce?.amount != null &&
                                                                        formatNumber(ce?.amount - ce?.quantity)}
                                                                </h6>
                                                                <div className="flex self-center justify-center px-1 space-x-3">
                                                                    <button
                                                                        title="Xóa"
                                                                        onClick={_HandleDeleteChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id
                                                                        )}
                                                                        className="text-red-500 hover:text-red-600"
                                                                    >
                                                                        <IconDelete />
                                                                    </button>
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Customscrollbar>
                        )}
                    </>
                )}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={_TogglePopup.bind(this, false)}
                        className="px-4 py-2 text-base transition rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105"
                    >
                        {props.dataLang?.branch_popup_exit}
                    </button>
                    <button
                        onClick={_HandleChooseItem.bind(this)}
                        className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#003DA0] hover:opacity-90 hover:scale-105 transition"
                    >
                        Chọn
                    </button>
                </div>
            </div>
        </PopupCustom>
    );
});
export default PopupProduct;
