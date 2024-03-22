import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { _ServerInstance as Axios } from "/services/axios";
import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";

import {
    Calendar as IconCalendar,
    Add as IconAdd,
    SearchNormal1 as IconSearch,
    Image as IconImage,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    ArrowRotateLeft as IconLoad,
} from "iconsax-react";
import DatePicker from "react-datepicker";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { debounce } from "lodash";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
import useToast from "@/hooks/useToast";
import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";

import NoData from "@/components/UI/noData/nodata";
import { Container } from "@/components/UI/common/layout";
import { CreatableSelectCore } from "@/utils/lib/CreatableSelect";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";

import { SelectCore } from "@/utils/lib/Select";
import { isAllowedNumber } from "@/utils/helpers/common";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
const Popup_Product = React.memo((props) => {
    const dataPstWH = useSelector((state) => state.vitrikho_kiemke);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const isShow = useToast()

    const dataSeting = useSetingServer()

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    }

    const [open, sOpen] = useState(false);
    const _TogglePopup = (e) => sOpen(e);
    const _CheckWareHouse = () => {
        if (props.warehouse !== null) {
            sOpen(true);
        } else {
            isShow("error", "Vui lý chọn kho hàng")

            props.sErrWareHouse(true);
        }
    };

    const [onFetching, sOnFetching] = useState(false);
    const [onSendingProduct, sOnSendingProduct] = useState(false);

    const [dataProduct, sDataProduct] = useState([]);
    const [product, sProduct] = useState(null);
    const [listAllProduct, sListAllProduct] = useState([]);

    useEffect(() => {
        open && sDataProduct([]);
        open && sListAllProduct([]);
        open && sProduct(null);
        open && sOnFetching(true);
    }, [open]);

    const _HandleChangeValue = (value) => {
        sProduct(value);
    };
    const _HandleInputChange = debounce((inputValue) => {
        Axios(
            "POST",
            "/api_web/api_product/searchItemsNoneVariant?csrf_protection=true",
            {
                data: {
                    term: inputValue,
                },
            },
            (err, response) => {
                if (!err) {
                    var { data } = response.data;
                    sDataProduct(
                        data.result?.map((e) => ({
                            label: `${e.name + e.code + e.id}`,
                            name: e.name,
                            value: e.id,
                            code: e.code,
                            img: e.images,
                            type: e.text_type,
                        }))
                    );
                }
            }
        );
    }, 500)

    const _ServerFetching = () => {
        Axios(
            "POST",
            "/api_web/api_product/searchItemsNoneVariant?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { data } = response.data;
                    sDataProduct(
                        data.result?.map((e) => ({
                            label: `${e.name + e.code + e.id}`,
                            name: e.name,
                            value: e.id,
                            code: e.code,
                            img: e.images,
                            type: e.text_type,
                        }))
                    );
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerSendingProduct = () => {
        Axios(
            "POST",
            "/api_web/api_inventory/GetVariantInventory?csrf_protection=true",
            {
                data: {
                    id: product?.value,
                    warehouse_id: props.warehouse?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess } = response.data;
                    sListAllProduct(
                        isSuccess?.result
                            ?.map((e) => ({
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
                                }))
                                    : [],
                                child: [],
                                checkChild: e.warehouse?.map((ce) => ({
                                    amount: null,
                                    quantity: Number(ce.quantity),
                                    serial: ce.serial,
                                    lot: ce.lot,
                                    date: moment(ce.expiration_date).format(
                                        "DD/MM/yyyy"
                                    ),
                                    locate: ce.location_id,
                                })),
                            }))
                            .filter(
                                (e) =>
                                    !props.dataChoose.some(
                                        (ce) => e.id === ce.id
                                    )
                            )
                    );
                }
                sOnSendingProduct(false);
            }
        );
    };

    useEffect(() => {
        onSendingProduct && _ServerSendingProduct();
    }, [onSendingProduct]);

    useEffect(() => {
        open && product !== null && sOnSendingProduct(true);
    }, [product]);

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
    }

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
                                _HandleCheckSameLot(
                                    parentId,
                                    id,
                                    ce?.locate,
                                    ce?.lot,
                                    ce?.date
                                );
                            e?.checkSerial == "1" &&
                                ce?.locate !== null &&
                                ce?.serial !== null &&
                                _HandleCheckSameSerial(
                                    parentId,
                                    id,
                                    ce?.locate,
                                    ce?.serial
                                );
                            e?.checkExpiry == "0" &&
                                e?.checkSerial == "0" &&
                                _HandleCheckSameLoca(parentId, id, ce?.locate);
                            return { ...ce };
                        } else if (type === "lot") {
                            ce.lot = value;
                            ce?.locate !== null &&
                                ce?.lot !== null &&
                                ce.date !== null &&
                                _HandleCheckSameLot(
                                    parentId,
                                    id,
                                    ce?.locate,
                                    ce?.lot,
                                    ce?.date
                                );
                            return { ...ce };
                        } else if (type === "date") {
                            ce.date = value;
                            ce?.locate !== null &&
                                ce?.lot !== null &&
                                ce.date !== null &&
                                _HandleCheckSameLot(
                                    parentId,
                                    id,
                                    ce?.locate,
                                    ce?.lot,
                                    ce?.date
                                );
                            return { ...ce };
                        } else if (type === "serial") {
                            ce.serial = value?.target.value;
                            ce?.locate !== null &&
                                ce?.serial !== null &&
                                _HandleCheckSameSerial(
                                    parentId,
                                    id,
                                    ce?.locate,
                                    ce?.serial
                                );
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
                    const checkData = e.child
                        ?.filter((ce) => ce?.id !== id)
                        ?.some(
                            (item) =>
                                item?.locate?.value === locate?.value &&
                                item.lot?.value === lot?.value &&
                                moment(item.date).format("DD/MM/yyyy") ==
                                moment(date).format("DD/MM/yyyy")
                        );
                    const newChild = e.child
                        ?.map((ce) => {
                            if (ce.id == id && checkData) {
                                isShow('error', `Trùng mặt hàng`)
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
                        })
                        .filter((item) => item.locate !== null);
                    return { ...e, child: newChild };
                }
                return e;
            });
            const parent = newData.find((item) => item.id === parentId);
            if (!parent) return null;
            const child = parent.child.find((e) => e.id === id) || null;
            // if(!child) return null;
            const check = parent.checkChild.find(
                (e) =>
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
            const dataChild = listAllProduct
                ?.map((e) => e?.child)
                ?.flatMap((innerList) => innerList);
            const checkData = dataChild?.some(
                (item) => item?.serial === serial && item?.id !== id
            );

            const newData = listAllProduct?.map((e) => {
                if (e.id === parentId && checkData) {
                    isShow('error', `Trùng serial`)
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
                (e) =>
                    e.locate === child?.locate?.value &&
                    e.serial === child?.serial
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
                    const checkData = e.child
                        ?.filter((ce) => ce?.id !== id)
                        ?.some((item) => item?.locate?.value === locate?.value);
                    const newChild = e.child
                        ?.map((ce) => {
                            if (ce.id == id && checkData) {
                                isShow('error', `Trùng mặt hàng`)
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
                        })
                        .filter((item) => item.locate !== null);
                    return { ...e, child: newChild };
                }
                return e;
            });
            // sLoadingData(true)

            const parent = newData.find((item) => item.id === parentId);
            if (!parent) return null;
            const child = parent.child.find((e) => e.id === id) || null;
            const check = parent.checkChild.find(
                (e) => e.locate === child?.locate?.value
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

    const _HandleChooseItem = (e) => {
        e.preventDefault();
        const newData = listAllProduct.filter((e) => e.child.length > 0);
        props.sDataChoose([...props.dataChoose, ...newData]);
        sOpen(false);
        props.sDataErr(false);
    };

    return (
        <PopupEdit
            title={"Thêm mặt hàng để kiểm kê"}
            button={`+   Thêm mặt hàng`}
            onClickOpen={_CheckWareHouse.bind(this)}
            open={open}
            onClose={_TogglePopup.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[1000px] 2xl:space-y-5 space-y-4">
                {onFetching ? (
                    <Loading className="h-60" color="#0f4f9e" />
                ) : (
                    <div className="space-y-1">
                        <label>Mặt hàng</label>
                        <Select
                            options={dataProduct}
                            value={product}
                            onChange={_HandleChangeValue.bind(this)}
                            placeholder="Chọn mặt hàng"
                            noOptionsMessage={() =>
                                `${props.dataLang?.no_data_found}`
                            }
                            onInputChange={_HandleInputChange.bind(this)}
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
                                        <div className="w-14 h-14 bg-gray-200 flex flex-col items-center justify-center rounded">
                                            <IconImage />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium">
                                            {option?.name}
                                        </h3>
                                        <h5 className="text-gray-400 font-[400]">
                                            {option.code}
                                        </h5>
                                        <h5 className="text-gray-400 font-medium text-xs">
                                            {props.dataLang[option.type]}
                                        </h5>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}
                {onSendingProduct ? (
                    <Loading className="h-60" color="#0f4f9e" />
                ) : (
                    <>
                        {listAllProduct?.length > 0 && (
                            <Customscrollbar
                                className="max-h-[400px] min-h-[350px]"
                            >
                                <div className="space-y-1.5">
                                    {listAllProduct?.map((e) => (
                                        <div className="space-y-2" key={e.id}>
                                            <div className="flex justify-between items-center pr-3">
                                                <div className="flex items-center space-x-3 w-full">
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
                                                        <div className="w-14 h-14 bg-gray-200 flex flex-col items-center justify-center rounded">
                                                            <IconImage />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {e.name}
                                                        </h3>
                                                        <h5 className="text-gray-400 font-[400] text-sm">
                                                            {e.code}
                                                            <span className="text-[#0F4F9E] font-medium ml-3">
                                                                {e.variant}
                                                            </span>
                                                        </h5>
                                                        <h5 className="text-gray-400 font-medium text-xs">
                                                            {
                                                                props.dataLang[
                                                                e.type
                                                                ]
                                                            }
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-5">
                                                    {e.child?.length > 0 && (
                                                        <button
                                                            onClick={_HandleActionItem.bind(
                                                                this,
                                                                e.id,
                                                                "show"
                                                            )}
                                                            className={`${e.show
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                                } transition w-6 h-6 rounded-full flex flex-col justify-center items-center bg-blue-200 text-blue-700`}
                                                        >
                                                            <IconDown size="15" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={_HandleActionItem.bind(
                                                            this,
                                                            e.id,
                                                            "add"
                                                        )}
                                                        className="w-10 h-10 rounded bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-center items-center "
                                                    >
                                                        <IconAdd />
                                                    </button>
                                                </div>
                                            </div>
                                            {e.child?.length > 0 && e.show && (
                                                <div className="w-full space-y-1">
                                                    <div
                                                        className={`${e?.checkExpiry ==
                                                            "0" &&
                                                            e?.checkSerial ==
                                                            "0"
                                                            ? "grid-cols-5"
                                                            : e?.checkExpiry ==
                                                                "1"
                                                                ? "grid-cols-7"
                                                                : "grid-cols-6"
                                                            } grid gap-2 items-center`}
                                                    >
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            Vị trí kho
                                                        </h5>
                                                        {e?.checkExpiry ==
                                                            "1" && (
                                                                <h5 className="font-[300] text-sm px-1 text-center">
                                                                    LOT
                                                                </h5>
                                                            )}
                                                        {e?.checkExpiry ==
                                                            "1" && (
                                                                <h5 className="font-[300] text-sm px-1 text-center">
                                                                    Date
                                                                </h5>
                                                            )}
                                                        {e?.checkSerial ==
                                                            "1" && (
                                                                <h5 className="font-[300] text-sm px-1 text-center">
                                                                    Serial
                                                                </h5>
                                                            )}
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            SL phần mềm
                                                        </h5>
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            SL thực
                                                        </h5>
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            Chênh lệch
                                                        </h5>
                                                        <h5 className="font-[300] text-sm px-1 text-center">
                                                            Tác vụ
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className={`${e?.checkExpiry ==
                                                            "0" &&
                                                            e?.checkSerial ==
                                                            "0"
                                                            ? "grid-cols-5"
                                                            : e?.checkExpiry ==
                                                                "1"
                                                                ? "grid-cols-7"
                                                                : "grid-cols-6"
                                                            } grid gap-2 items-center`}
                                                    >
                                                        {e.child.map((ce) => (
                                                            <React.Fragment
                                                                key={ce.id}
                                                            >
                                                                <div className="px-1">
                                                                    <SelectCore
                                                                        options={
                                                                            dataPstWH
                                                                        }
                                                                        value={
                                                                            ce.locate
                                                                        }
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "locate"
                                                                        )}
                                                                        placeholder={
                                                                            "Vị trí kho"
                                                                        }
                                                                        isClearable={
                                                                            true
                                                                        }
                                                                        classNamePrefix="Select"
                                                                        className={`Select__custom border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
                                                                        isSearchable={
                                                                            true
                                                                        }
                                                                        noOptionsMessage={() =>
                                                                            `${props.dataLang?.no_data_found}`
                                                                        }
                                                                        menuPortalTarget={
                                                                            document.body
                                                                        }
                                                                        onMenuOpen={
                                                                            handleMenuOpen
                                                                        }
                                                                        style={{
                                                                            border: "none",
                                                                            boxShadow:
                                                                                "none",
                                                                            outline:
                                                                                "none",
                                                                        }}
                                                                        theme={(
                                                                            theme
                                                                        ) => ({
                                                                            ...theme,
                                                                            colors: {
                                                                                ...theme.colors,
                                                                                primary25:
                                                                                    "#EBF5FF",
                                                                                primary50:
                                                                                    "#92BFF7",
                                                                                primary:
                                                                                    "#0F4F9E",
                                                                            },
                                                                        })}
                                                                        styles={{
                                                                            placeholder:
                                                                                (
                                                                                    base
                                                                                ) => ({
                                                                                    ...base,
                                                                                    color: "#cbd5e1",
                                                                                }),
                                                                            menuPortal:
                                                                                (
                                                                                    base
                                                                                ) => ({
                                                                                    ...base,
                                                                                    zIndex: 9999,
                                                                                    position:
                                                                                        "absolute",
                                                                                }),
                                                                            control:
                                                                                (
                                                                                    base,
                                                                                    state
                                                                                ) => ({
                                                                                    ...base,
                                                                                    boxShadow:
                                                                                        "none",
                                                                                    ...(state.isFocused && {
                                                                                        border: "0 0 0 1px #92BFF7",
                                                                                    }),
                                                                                }),
                                                                        }}
                                                                    />
                                                                </div>
                                                                {e?.checkExpiry ==
                                                                    "1" && (
                                                                        // lot
                                                                        <div className="px-1">
                                                                            <CreatableSelectCore
                                                                                options={
                                                                                    e?.dataLot
                                                                                }
                                                                                placeholder={
                                                                                    "Lot"
                                                                                }
                                                                                onChange={_HandleChangeChild.bind(
                                                                                    this,
                                                                                    e?.id,
                                                                                    ce?.id,
                                                                                    "lot"
                                                                                )}
                                                                                isClearable={
                                                                                    true
                                                                                }
                                                                                classNamePrefix="Select"
                                                                                className={`Select__custom removeDivide border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
                                                                                isSearchable={
                                                                                    true
                                                                                }
                                                                                noOptionsMessage={() =>
                                                                                    `Chưa có gợi ý`
                                                                                }
                                                                                formatCreateLabel={(
                                                                                    value
                                                                                ) =>
                                                                                    `Tạo "${value}"`
                                                                                }
                                                                                menuPortalTarget={
                                                                                    document.body
                                                                                }
                                                                                onMenuOpen={
                                                                                    handleMenuOpen
                                                                                }
                                                                                style={{
                                                                                    border: "none",
                                                                                    boxShadow:
                                                                                        "none",
                                                                                    outline:
                                                                                        "none",
                                                                                }}
                                                                                theme={(
                                                                                    theme
                                                                                ) => ({
                                                                                    ...theme,
                                                                                    colors: {
                                                                                        ...theme.colors,
                                                                                        primary25:
                                                                                            "#EBF5FF",
                                                                                        primary50:
                                                                                            "#92BFF7",
                                                                                        primary:
                                                                                            "#0F4F9E",
                                                                                    },
                                                                                })}
                                                                                styles={{
                                                                                    placeholder:
                                                                                        (
                                                                                            base
                                                                                        ) => ({
                                                                                            ...base,
                                                                                            color: "#cbd5e1",
                                                                                        }),
                                                                                    menuPortal:
                                                                                        (
                                                                                            base
                                                                                        ) => ({
                                                                                            ...base,
                                                                                            zIndex: 9999,
                                                                                            position:
                                                                                                "absolute",
                                                                                        }),
                                                                                    control:
                                                                                        (
                                                                                            base,
                                                                                            state
                                                                                        ) => ({
                                                                                            ...base,
                                                                                            boxShadow:
                                                                                                "none",
                                                                                            ...(state.isFocused && {
                                                                                                border: "0 0 0 1px #92BFF7",
                                                                                            }),
                                                                                        }),
                                                                                    dropdownIndicator:
                                                                                        (
                                                                                            base
                                                                                        ) => ({
                                                                                            ...base,
                                                                                            display:
                                                                                                "none",
                                                                                        }),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                {e?.checkExpiry ==
                                                                    "1" && (
                                                                        // date
                                                                        <div className="relative flex items-center px-1">
                                                                            <DatePicker
                                                                                dateFormat="dd/MM/yyyy"
                                                                                placeholderText="date"
                                                                                selected={
                                                                                    ce?.date
                                                                                }
                                                                                onChange={_HandleChangeChild.bind(
                                                                                    this,
                                                                                    e?.id,
                                                                                    ce?.id,
                                                                                    "date"
                                                                                )}
                                                                                className={`focus:border-[#92BFF7] border-[#d0d5dd] bg-transparent placeholder:text-slate-300 w-full rounded text-[#52575E] p-2 border outline-none text-[13px] relative`}
                                                                            />
                                                                            <IconCalendar
                                                                                size={
                                                                                    22
                                                                                }
                                                                                className="absolute right-3 text-[#cccccc]"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                {e?.checkSerial ==
                                                                    "1" && (
                                                                        // serial
                                                                        <div className="px-1">
                                                                            <input
                                                                                value={
                                                                                    ce?.serial
                                                                                }
                                                                                onChange={_HandleChangeChild.bind(
                                                                                    this,
                                                                                    e?.id,
                                                                                    ce?.id,
                                                                                    "serial"
                                                                                )}
                                                                                className="text-center py-1 px-2 font-medium w-full focus:outline-none border-b-2 border-gray-200"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                <h6 className="px-1 self-center text-center">
                                                                    {
                                                                        formatNumber(ce?.quantity)
                                                                    }
                                                                </h6>
                                                                <div className="px-1 self-center text-center">
                                                                    <InPutNumericFormat
                                                                        value={
                                                                            ce?.amount
                                                                        }
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "amount"
                                                                        )}
                                                                        className="text-center py-1 px-2 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                                                        isAllowed={(
                                                                            values
                                                                        ) => {
                                                                            const {
                                                                                floatValue,
                                                                            } =
                                                                                values;
                                                                            if (
                                                                                e?.checkSerial ==
                                                                                "1"
                                                                            ) {
                                                                                return (
                                                                                    floatValue >=
                                                                                    0 &&
                                                                                    floatValue <
                                                                                    2
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    floatValue >=
                                                                                    0
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                <h6 className="px-1 self-center text-center">
                                                                    {ce?.amount !=
                                                                        null &&
                                                                        formatNumber(
                                                                            ce?.amount -
                                                                            ce?.quantity
                                                                        )}
                                                                </h6>
                                                                <div className="px-1 self-center flex justify-center space-x-3">
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
                        className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                    >
                        {props.dataLang?.branch_popup_exit}
                    </button>
                    <button
                        onClick={_HandleChooseItem.bind(this)}
                        className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition"
                    >
                        Chọn
                    </button>
                </div>
            </div>
        </PopupEdit>
    );
});
export default Popup_Product