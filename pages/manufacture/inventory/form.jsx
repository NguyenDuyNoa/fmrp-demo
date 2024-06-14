import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import Loading from "@/components/UI/loading";
import PopupEdit from "@/components/UI/popup";

import { Add as IconAdd, Calendar as IconCalendar, Trash as IconDelete, Image as IconImage } from "iconsax-react";
import moment from "moment";
import DatePicker from "react-datepicker";

import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";

import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import NoData from "@/components/UI/noData/nodata";
import { CreatableSelectCore } from "@/utils/lib/CreatableSelect";

import apiComons from "@/Api/apiComon/apiComon";
import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import apiInventory from "@/Api/apiManufacture/warehouse/inventory/apiInventory";
import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { isAllowedNumber } from "@/utils/helpers/common";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import Popup_Product from "./components/popupProduct";
const Form = (props) => {
    const dataLang = props.dataLang;
    const dispatch = useDispatch();
    const router = useRouter();

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const isShow = useToast();

    const dataSeting = useSetingServer();

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingPstWH, sOnFetchingPstWH] = useState(false);
    const [onFetchingWH, sOnFetchingWH] = useState(false);
    const [onSending, sOnSending] = useState(false);

    const [dataChoose, sDataChoose] = useState([]);
    const [dataBranch, sDataBranch] = useState([]);
    const [dataWareHouse, sDataWareHouse] = useState([]);
    const [dataPstWH, sDataPstWH] = useState([]);

    const voucherdate = new Date();
    const [code, sCode] = useState("");
    const [warehouse, sWarehouse] = useState(null);
    const [branch, sBranch] = useState(null);
    const [note, sNote] = useState("");

    const [errWareHouse, sErrWareHouse] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [errProduct, sErrProduct] = useState(false);
    const [errNullLocate, sErrNullLocate] = useState(false);
    const [errNullLot, sErrNullLot] = useState(false);
    const [errNullDate, sErrNullDate] = useState(false);
    const [errNullSerial, sErrNullSerial] = useState(false);
    const [errNullQty, sErrNullQty] = useState(false);
    const [errData, sErrData] = useState([]);

    const [isSubmitted, sIsSubmitted] = useState(false);
    const [dataErr, sDataErr] = useState(false);

    const statusExprired = useStatusExprired();

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});

    const [dataProductExpiry, sDataProductExpiry] = useState({});

    const [dataProductSerial, sDataProductSerial] = useState({});

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const _ServerFetching = async () => {
        try {
            const { result } = await apiComons.apiBranchCombobox();

            const data = await apiDashboard.apiFeature();

            sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));

            sDataProductExpiry(data.find((x) => x.code == "product_expiry"));

            sDataProductSerial(data.find((x) => x.code == "product_serial"));

            sDataBranch(result.map((e) => ({ label: e.name, value: e.id })));
        } catch (error) {}
        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true);
    }, []);

    const _HandleChangeValue = (type, value) => {
        if (type === "code") {
            sCode(value?.target.value);
        } else if (type === "warehouse") {
            sWarehouse(value);
        } else if (type === "branch") {
            sBranch(value);
            sWarehouse(null);
        } else if (type === "note") {
            sNote(value?.target.value);
        }
    };

    const _ServerFetchingWH = async () => {
        try {
            const { rResult } = await apiInventory.apiWarehouseInventory(branch?.value);

            sDataWareHouse(rResult.map((e) => ({ label: e.name, value: e.id })));
        } catch (error) {}

        sOnFetchingWH(false);
        // Axios(
        //     "GET",
        //     `api_web/api_warehouse/warehouse?csrf_protection=true&filter[is_system]=2&filter[branch_id]=${branch?.value}`,
        //     {},
        //     (err, response) => {
        //         if (!err) {
        //             var { rResult } = response.data;
        //             sDataWareHouse(rResult.map((e) => ({ label: e.name, value: e.id })));
        //         }
        //         sOnFetchingWH(false);
        //     }
        // );
    };

    useEffect(() => {
        onFetchingWH && _ServerFetchingWH();
    }, [onFetchingWH]);

    useEffect(() => {
        branch !== null && sOnFetchingWH(true); //chọn chi nhánh để Get data Kho hàng
    }, [branch]);

    const _ServerFetchingPstWH = async () => {
        try {
            const data = await apiInventory.apiLocationInWarehouseInventory(warehouse?.value);

            dispatch({
                type: "location_inventory/update",
                payload: data.map((e) => ({
                    label: e.name,
                    value: e.id,
                })),
            });

            sDataPstWH(data.map((e) => ({ label: e.name, value: e.id })));
        } catch (error) {}
        sOnFetchingPstWH(false);
    };

    useEffect(() => {
        onFetchingPstWH && _ServerFetchingPstWH();
    }, [onFetchingPstWH]);

    useEffect(() => {
        warehouse !== null && sErrWareHouse(false);
        warehouse !== null && sOnFetchingPstWH(true);
    }, [warehouse]);

    const _HandleActionItem = (id, type) => {
        if (type === "add") {
            const newData = dataChoose.map((e) => {
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
            sDataChoose([...newData]);
        }
    };

    const _HandleDeleteChild = (parentId, id) => {
        const newData = dataChoose
            .map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child?.filter((ce) => ce.id !== id);
                    return { ...e, child: newChild };
                }
                return e;
            })
            .filter((e) => e.child.length > 0);
        sDataChoose([...newData]);
    };

    const _HandleChangeChild = (parentId, id, type, value) => {
        const newData = dataChoose.map((e) => {
            if (e.id === parentId) {
                const newChild = e.child?.map((ce) => {
                    if (ce.id === id) {
                        if (type === "amount") {
                            ce.amount = Number(value?.value);
                            return { ...ce };
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
                            setTimeout(() => {
                                e?.checkSerial == "1" &&
                                    ce?.locate !== null &&
                                    ce?.serial !== null &&
                                    _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            }, 1000);
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
        sDataChoose([...newData]);
    };
    const _HandleCheckSameLot = (parentId, id, locate, lot, date) => {
        setTimeout(() => {
            const newData = dataChoose.map((e) => {
                if (e.id === parentId) {
                    const checkData = e.child
                        ?.filter((ce) => ce?.id !== id)
                        ?.some(
                            (item) =>
                                item?.locate?.value === locate?.value &&
                                item.lot?.value === lot?.value &&
                                moment(item.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy")
                        );
                    const newChild = e.child
                        ?.map((ce) => {
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
            sDataChoose([...newData1]);
        }, 500);
    };

    const _HandleCheckSameSerial = (parentId, id, locate, serial) => {
        setTimeout(() => {
            const dataChild = dataChoose?.map((e) => e?.child)?.flatMap((innerList) => innerList);
            const checkData = dataChild?.some((item) => item?.serial === serial && item?.id !== id);

            const newData = dataChoose?.map((e) => {
                if (e.id === parentId && checkData) {
                    isShow("error", `Trùng serial`);

                    return {
                        ...e,
                        child: e?.child?.filter((ce) => ce?.id !== id),
                    };
                }
                return e;
            });
            const parent = newData?.find((item) => item.id === parentId) || null;
            const child = parent?.child.find((e) => e.id === id) || null;
            const check = parent?.checkChild.find(
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
            sDataChoose([...newData1]);
        }, 1000);
    };

    const _HandleCheckSameLoca = (parentId, id, locate) => {
        setTimeout(() => {
            const newData = dataChoose.map((e) => {
                if (e.id === parentId) {
                    const checkData = e.child
                        ?.filter((ce) => ce?.id !== id)
                        ?.some((item) => item?.locate?.value === locate?.value);
                    const newChild = e.child
                        ?.map((ce) => {
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

            sDataChoose([...newData1]);
        }, 1000);
    };

    const _HandleCheckSame = (parentId, id, locate, serial) => {
        setTimeout(() => {
            const newData = dataChoose.map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child
                        ?.map((ce) => {
                            if (ce.id !== id && ce.locate?.value === locate?.value && ce.serial === serial) {
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
                        })
                        .filter((item) => item.locate !== null);
                    return { ...e, child: newChild };
                }
                return e;
            });
            const parent = newData.find((item) => item.id === parentId);
            if (!parent) return null;
            const child = parent.child.find((e) => e.id === id);
            if (!child) return null;
            const check = parent.checkChild.find((e) => e.locate === child.locate?.value && e.serial === child.serial);
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
            sDataChoose([...newData1]);
        }, 500);
    };

    const _ServerSending = async () => {
        let formData = new FormData();

        formData.append("code", code);
        formData.append("date", voucherdate);
        formData.append("warehouse", warehouse?.value);
        formData.append("branch", branch?.value);
        formData.append("note", note);

        dataChoose?.forEach((item, index) => {
            formData.append(`data[${index}][id]`, item?.id);
            formData.append(`data[${index}][code]`, item?.code);
            formData.append(`data[${index}][image]`, item?.img);
            formData.append(`data[${index}][variant]`, item?.variant);
            formData.append(`data[${index}][type]`, item?.type);
            formData.append(`data[${index}][name]`, item?.name);
            item?.child.forEach((itemChild, indexChild) => {
                formData.append(`data[${index}][child][${indexChild}][id]`, itemChild?.id);
                formData.append(`data[${index}][child][${indexChild}][date]`, itemChild?.date);
                formData.append(`data[${index}][child][${indexChild}][locate]`, itemChild?.locate?.value || null);
                formData.append(`data[${index}][child][${indexChild}][price]`, itemChild?.price || 0);
                formData.append(`data[${index}][child][${indexChild}][quantity_net]`, itemChild?.amount || 0);
                formData.append(`data[${index}][child][${indexChild}][quantity]`, itemChild?.quantity || 0);
                formData.append(`data[${index}][child][${indexChild}][lot]`, itemChild?.lot?.value || null);
                formData.append(`data[${index}][child][${indexChild}][serial]`, itemChild?.serial || null);
            });
        });
        try {
            const { isSuccess, message, items_error, result } = await apiInventory.apiHandingInventory(formData);
            if (isSuccess) {
                sIsSubmitted(false);

                sErrData([]);

                isShow("success", `${dataLang[message]}` || message);

                setTimeout(() => {
                    router.back();
                }, 1000);
            } else {
                isShow("error", `${dataLang[message]}` || message);

                sErrData(items_error);

                sIsSubmitted(true);

                const hasStatus2 = items_error?.some((item) => item.status === 2);

                if (hasStatus2) {
                    sDataErr(true);
                } else {
                    sDataErr(false);
                }
            }
        } catch (error) {}
        sOnSending(false);
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);
    const _HandleSubmit = (e) => {
        e.preventDefault();
        const checkLotDate = dataChoose.some((item) => item?.checkExpiry == "1");
        const checkSerial = dataChoose.some((item) => item?.checkSerial == "1");

        const checkErrNullLocate = dataChoose.some((item) => item.child.some((itemChild) => itemChild.locate === null));

        const checkErrNullLot = dataChoose.some(
            (item) =>
                (dataProductExpiry?.is_enable === "1" || dataMaterialExpiry?.is_enable === "1") &&
                item.checkExpiry === "1" &&
                item.child.some((itemChild) => itemChild.lot === null)
        );

        const checkErrNullDate = dataChoose.some(
            (item) =>
                (dataProductExpiry?.is_enable === "1" || dataMaterialExpiry?.is_enable === "1") &&
                item.checkExpiry === "1" &&
                item.child.some((itemChild) => itemChild.date === null)
        );

        const checkErrNullSerial = dataChoose.some(
            (item) =>
                dataProductSerial?.is_enable === "1" &&
                item.checkSerial === "1" &&
                item.child.some((itemChild) => itemChild.serial === null)
        );

        const ChildData = dataChoose?.map((e) => e?.child)?.flatMap((e) => e);
        const checkErrNullQty = ChildData?.some((e) => e?.amount === null);
        const hasEmptyChild = dataChoose.some((item) => item.child.length === 0);

        if (
            branch == null ||
            warehouse == null ||
            dataChoose.length == 0 ||
            checkErrNullLocate ||
            (dataProductSerial?.is_enable == "1" && checkErrNullSerial) ||
            ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") && checkErrNullLot) ||
            ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") && checkErrNullDate) ||
            hasEmptyChild ||
            checkErrNullQty
        ) {
            branch == null && sErrBranch(true);
            warehouse == null && sErrWareHouse(true);
            dataChoose.length == 0 && sErrProduct(true);
            checkErrNullLocate && sErrNullLocate(true);
            checkErrNullLot && sErrNullLot(true);
            checkErrNullDate && sErrNullDate(true);
            checkErrNullSerial && sErrNullSerial(true);
            checkErrNullQty && sErrNullQty(true);
            if (hasEmptyChild) {
                isShow("error", `Thêm thông tin mặt hàng`);
            } else {
                isShow("error", `${dataLang?.required_field_null}`);
            }
        } else {
            sErrBranch(false);
            sErrWareHouse(false);
            sErrProduct(false);
            sErrNullLocate(false);
            sOnSending(true);
        }
    };
    const checkDuplicateSerial = () => {
        if (!isSubmitted) return [];
        const duplicateIds = [];
        if (isSubmitted) {
            dataChoose?.forEach((parentItem) => {
                parentItem.child.forEach((childItem) => {
                    const hasDuplicate = errData?.some((responseItem) => {
                        return responseItem.serial === childItem.serial && Number(responseItem.id) === childItem.id;
                    });

                    if (hasDuplicate) {
                        duplicateIds.push(childItem.id);
                    }
                });
            });
        }

        return duplicateIds;
    };
    // Trong render của component
    const duplicateIds = checkDuplicateSerial();

    return (
        <>
            <Head>
                <title>Thêm phiếu kiểm kê kho</title>
            </Head>

            <Container className={"!h-auto"}>
                <Popup_status
                    dataErr={dataErr}
                    sDataErr={sDataErr}
                    isSubmitted={isSubmitted}
                    sIsSubmitted={sIsSubmitted}
                    db={sDataChoose}
                    dataChoose={dataChoose}
                    dataLang={dataLang}
                    errData={errData}
                    setOpen={true}
                />
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">Kiểm kê kho</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>Thêm phiếu kiểm kê kho</h6>
                    </div>
                )}
                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                    Thêm Phiếu Kiểm Kê Kho
                </h2>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <h2 className="bg-slate-100 py-2 px-4 rounded">Thông tin chung</h2>
                        <div className="grid grid-cols-4 gap-5">
                            <div className="space-y-1">
                                <label className="text-[#344054] font-normal text-sm mb-1 ">
                                    {"Mã chứng từ"} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={code}
                                    onChange={_HandleChangeValue.bind(this, "code")}
                                    type="text"
                                    placeholder={"Mặc định theo hệ thống"}
                                    className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#344054] font-normal text-sm mb-1 ">
                                    {"Ngày chứng từ"} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <DatePicker
                                        selected={voucherdate}
                                        dateFormat="dd/MM/yyyy"
                                        disabled
                                        className={`disabled:bg-[#f2f2f2] disabled:text-[#9999b0] focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                    />
                                    <IconCalendar size={22} className="absolute right-3 text-[#cccccc]" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#344054] text-sm mb-1 ">
                                    {"Chi nhánh"} <span className="text-red-500">*</span>
                                </label>
                                <SelectCore
                                    options={dataBranch}
                                    value={branch}
                                    onChange={_HandleChangeValue.bind(this, "branch")}
                                    placeholder={dataLang?.client_list_filterbrand}
                                    isClearable={true}
                                    isDisabled={dataChoose.length > 0}
                                    className={`${
                                        errBranch && branch == null ? "border-red-500" : "border-transparent"
                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] outline-none border `}
                                    isSearchable={true}
                                    noOptionsMessage={() => `${dataLang?.no_data_found}`}
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
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#344054] text-sm mb-1 ">
                                    {"Kho hàng"} <span className="text-red-500">*</span>
                                </label>
                                <SelectCore
                                    options={dataWareHouse}
                                    value={warehouse}
                                    onChange={_HandleChangeValue.bind(this, "warehouse")}
                                    placeholder={"Chọn kho hàng"}
                                    isDisabled={dataChoose.length > 0}
                                    isClearable={true}
                                    className={`${
                                        errWareHouse ? "border-red-500" : "border-transparent"
                                    } placeholder:text-slate-300 w-full disabled:bg-slate-50 rounded text-[#52575E] outline-none border `}
                                    isSearchable={true}
                                    noOptionsMessage={() => `${dataLang?.no_data_found}`}
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
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between bg-slate-100 py-2 px-4 rounded items-center">
                        <h2 className="">Mặt hàng cần kiểm kê</h2>
                        <div>
                            {errProduct && dataChoose?.length == 0 && (
                                <span className="text-red-500 mr-5">Vui lòng thêm mặt hàng để kiểm kê</span>
                            )}
                            <Popup_Product
                                dataLang={props.dataLang}
                                sDataErr={sDataErr}
                                warehouse={warehouse}
                                sErrWareHouse={sErrWareHouse}
                                sDataChoose={sDataChoose}
                                dataChoose={dataChoose}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none whitespace-pre"
                            />
                        </div>
                    </div>
                    <div className="">
                        <h2 className="bg-slate-100 py-2 px-4 rounded">Thông tin mặt hàng</h2>
                        {dataChoose.length > 0 && (
                            <>
                                <div className="grid grid-cols-6 pt-3 pb-2 shadow">
                                    <h5 className="font-[300] text-slate-600 col-span-1 px-1.5">Tên mặt hàng</h5>
                                    {/* <div className={`${(dataMaterialExpiry.is_enable == "0" && dataProductSerial.is_enable == "0") ? "grid-cols-7" : (dataProductExpiry.checkExpiry == "1" ? "grid-cols-9" : "grid-cols-8") } col-span-5 grid`}> */}
                                    <div
                                        className={`${
                                            dataProductSerial.is_enable == "1"
                                                ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                                    ? "grid-cols-10"
                                                    : dataMaterialExpiry.is_enable == "1"
                                                    ? "grid-cols-[repeat(10_minmax(0_1fr))]"
                                                    : "grid-cols-8"
                                                : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                                ? "grid-cols-9"
                                                : dataMaterialExpiry.is_enable == "1"
                                                ? "grid-cols-9"
                                                : "grid-cols-7"
                                        } grid col-span-5 `}
                                    >
                                        <h5 className="font-[300] text-slate-600  px-1.5">Vị trí kho</h5>
                                        {/* {dataMaterialExpiry?.is_enable == "1" && <h5 className='font-[300] text-slate-600 text-center px-1.5'>LOT</h5>}
                                        {dataProductExpiry?.is_enable == "1" && <h5 className='font-[300] text-slate-600 text-center px-1.5'>Date</h5>}
                                        {dataProductSerial?.is_enable == "1" && <h5 className='font-[300] text-slate-600 text-center px-1.5'>Serial</h5>} */}
                                        {dataProductSerial.is_enable === "1" && (
                                            <h4 className="font-[300] text-slate-600 text-center px-1.5">{"Serial"}</h4>
                                        )}
                                        {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                            <>
                                                <h4 className="font-[300] text-slate-600 text-center px-1.5">
                                                    {"Lot"}
                                                </h4>
                                                <h4 className="font-[300] text-slate-600 text-center px-1.5">
                                                    {props.dataLang?.warehouses_detail_date || "warehouses_detail_date"}
                                                </h4>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                        <h5 className="font-[300] text-slate-600 text-center px-1.5">Đơn giá</h5>
                                        <h5 className="font-[300] text-slate-600 text-center px-1.5">SL phần mềm</h5>
                                        <h5 className="font-[300] text-slate-600 text-center px-1.5">SL thực</h5>
                                        <h5 className="font-[300] text-slate-600 text-center px-1.5">Chênh lệch</h5>
                                        <h5 className="font-[300] text-slate-600 text-center px-1.5">Thành tiền</h5>
                                        <h5 className="font-[300] text-slate-600 text-center px-1.5">Tác vụ</h5>
                                    </div>
                                </div>
                                <div className="2xl:max-h-[300px] max-h-[320px] overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50">
                                    {dataChoose.map((e) => (
                                        <div key={e.id} className="grid grid-cols-6 items-start mt-3 ">
                                            <div className="col-span-1 grid grid-cols-12 items-center p-1.5 space-y-1 border  h-full">
                                                <div className="flex justify-between  col-span-3">
                                                    <div className="w-[60px] h-[60px] bg-gray-200 flex flex-col items-center justify-center rounded">
                                                        {" "}
                                                        {e?.img ? (
                                                            <img src={e?.img} alt="" className="rounded"></img>
                                                        ) : (
                                                            <IconImage />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-9 m-0 relative border rounded">
                                                    <h3 className="pl-1 font-medium 2xl:[14px] xl:text-xs text-[8px]">
                                                        {e.name}
                                                    </h3>
                                                    <h5 className="pl-1 text-gray-400 font-[400] 2xl:[14px] xl:text-xs text-[8px]">
                                                        {e.code}
                                                    </h5>
                                                    <h5 className="pl-1 text-[#0F4F9E] font-medium text-sm">
                                                        {e.variant}
                                                    </h5>
                                                    <h5 className="pl-1 text-gray-400 font-medium text-[10px]">
                                                        {props.dataLang[e.type]}
                                                    </h5>
                                                    <button
                                                        onClick={_HandleActionItem.bind(this, e.id, "add")}
                                                        className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 absolute transition flex flex-col justify-center items-center -top-4 hover:rotate-45 right-1.5 hover:scale-105 hover:text-red-500 ease-in-out "
                                                    >
                                                        <IconAdd />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* <div className={`${(e?.checkExpiry == "0" && e?.checkSerial == "0") ? "grid-cols-7" : (e?.checkExpiry == "1" ? "grid-cols-9" : "grid-cols-8") } col-span-5 grid`}> */}
                                            <div
                                                className={`${
                                                    dataProductSerial.is_enable == "1"
                                                        ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                                            ? "grid-cols-10"
                                                            : dataMaterialExpiry.is_enable == "1"
                                                            ? "grid-cols-[repeat(10_minmax(0_1fr))]"
                                                            : "grid-cols-8"
                                                        : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                                        ? "grid-cols-9"
                                                        : dataMaterialExpiry.is_enable == "1"
                                                        ? "grid-cols-9"
                                                        : "grid-cols-7"
                                                } grid col-span-5  h-full items-center`}
                                            >
                                                {/* {loadingData ? <h1 className='text-4xl font-bold'>Loading</h1> */}
                                                {/* : */}
                                                <>
                                                    {e.child?.map((ce) => (
                                                        <React.Fragment key={ce?.id}>
                                                            <div className="p-1.5 border h-full flex items-center">
                                                                <SelectCore
                                                                    options={dataPstWH}
                                                                    value={ce?.locate}
                                                                    onChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "locate"
                                                                    )}
                                                                    placeholder={"Vị trí kho"}
                                                                    isClearable={true}
                                                                    classNamePrefix="Select"
                                                                    className={`${
                                                                        errNullLocate && ce.locate == null
                                                                            ? "border-red-500"
                                                                            : "border-transparent"
                                                                    } Select__custom placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
                                                                    isSearchable={true}
                                                                    noOptionsMessage={() =>
                                                                        `${dataLang?.no_data_found}`
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
                                                            {dataProductSerial.is_enable === "1" ? (
                                                                <div className="p-1.5 border h-full  flex flex-col justify-center ">
                                                                    <input
                                                                        disabled={e?.checkSerial == "0"}
                                                                        value={ce?.serial}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "serial"
                                                                        )}
                                                                        className={`${
                                                                            e?.checkSerial == "0"
                                                                                ? "border-transparent"
                                                                                : errNullSerial &&
                                                                                  (ce.serial === null ||
                                                                                      ce.serial === "")
                                                                                ? "border-red-500"
                                                                                : "border-gray-200"
                                                                        } text-center py-1 px-1 font-medium w-full focus:outline-none border-b-2 `}
                                                                    />
                                                                    {isSubmitted && duplicateIds.includes(ce.id) && (
                                                                        <span className="text-red-500 text-[12px]">
                                                                            Serial đã tồn tại trong phần mềm
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {dataMaterialExpiry.is_enable === "1" ||
                                                            dataProductExpiry.is_enable === "1" ? (
                                                                <>
                                                                    <div className="p-1.5 border h-full flex items-center">
                                                                        <CreatableSelectCore
                                                                            isDisabled={e?.checkExpiry == "0"}
                                                                            placeholder={"Lot"}
                                                                            options={e?.dataLot}
                                                                            value={ce?.lot}
                                                                            onChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "lot"
                                                                            )}
                                                                            isClearable={true}
                                                                            classNamePrefix="Select"
                                                                            className={`${
                                                                                e?.checkExpiry == "0"
                                                                                    ? "border-transparent"
                                                                                    : errNullLot && ce.lot == null
                                                                                    ? "border-red-500"
                                                                                    : "border-transparent"
                                                                            } Select__custom removeDivide placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`}
                                                                            isSearchable={true}
                                                                            menuPortalTarget={document.body}
                                                                            onMenuOpen={handleMenuOpen}
                                                                            noOptionsMessage={() => `Chưa có gợi ý`}
                                                                            formatCreateLabel={(value) =>
                                                                                `Tạo "${value}"`
                                                                            }
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
                                                                    <div className="relative flex items-center p-1.5 border h-full">
                                                                        <DatePicker
                                                                            disabled={e?.checkExpiry == "0"}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            placeholderText="date"
                                                                            selected={ce?.date}
                                                                            onChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "date"
                                                                            )}
                                                                            className={`${
                                                                                e?.checkExpiry == "0"
                                                                                    ? "border-gray-200"
                                                                                    : errNullDate && ce?.date == null
                                                                                    ? "border-red-500"
                                                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                                            } bg-transparent disabled:bg-gray-100  placeholder:text-slate-300 w-full  rounded text-[#52575E] p-2 border outline-none text-[13px] relative`}
                                                                        />
                                                                        <IconCalendar
                                                                            size={22}
                                                                            className="absolute right-3 text-[#cccccc]"
                                                                        />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <div className="p-1.5 border  flex flex-col justify-center h-full">
                                                                <InPutMoneyFormat
                                                                    value={ce?.price}
                                                                    onValueChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "price"
                                                                    )}
                                                                    className="appearance-none text-right py-1 px-2 font-medium w-full focus:outline-none border-b-2 border-gray-200"
                                                                    isAllowed={isAllowedNumber}
                                                                />
                                                            </div>
                                                            <h6 className="text-center p-1.5 border flex flex-col justify-center h-full">
                                                                {formatNumber(ce?.quantity)}
                                                            </h6>
                                                            <div className="p-1.5 border h-full  flex flex-col justify-center ">
                                                                <InPutNumericFormat
                                                                    value={ce?.amount}
                                                                    onValueChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "amount"
                                                                    )}
                                                                    className={`${
                                                                        errNullQty && ce?.amount == null
                                                                            ? "border-red-500 border-b-2"
                                                                            : " border-gray-200 border-b-2"
                                                                    }  appearance-none text-center py-1 px-2 font-medium w-full focus:outline-none  `}
                                                                    isAllowed={(values) => {
                                                                        const { floatValue } = values;
                                                                        if (e?.checkSerial == "1") {
                                                                            return floatValue >= 0 && floatValue < 2;
                                                                        } else {
                                                                            return floatValue >= 0;
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <h6 className="flex flex-col justify-center items-center p-1.5 border h-full ">
                                                                {ce?.amount != null &&
                                                                    formatNumber(ce?.amount - ce?.quantity)}
                                                            </h6>
                                                            <h6 className="p-1.5 border h-full  flex flex-col justify-center items-center ">
                                                                {ce?.amount != null &&
                                                                    formatNumber(ce?.amount * ce?.price)}
                                                            </h6>
                                                            <div className="flex flex-col justify-center items-center p-1.5 border h-full ">
                                                                <button
                                                                    onClick={_HandleDeleteChild.bind(
                                                                        this,
                                                                        e.id,
                                                                        ce?.id
                                                                    )}
                                                                    title="Xóa"
                                                                    className="text-red-500 hover:text-red-600"
                                                                >
                                                                    <IconDelete />
                                                                </button>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </>
                                                {/* } */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <hr className="" />
                    <div className="grid grid-cols-2">
                        <div className="space-y-1 flex flex-col">
                            <label>Ghi chú</label>
                            <textarea
                                value={note}
                                onChange={_HandleChangeValue.bind(this, "note")}
                                placeholder="Ghi chú"
                                className="w-2/3 resize-none p-3 rounded border outline-none focus:border-[#92BFF7]"
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2 flex flex-col items-end">
                            <div className="flex">
                                <h5 className="min-w-[230px]">Tổng số lượng : </h5>
                                <span className="min-w-[150px] text-right">
                                    {formatNumber(
                                        dataChoose.reduce((acc, obj) => {
                                            return (
                                                acc +
                                                obj.child?.reduce((acc2, obj2) => {
                                                    return acc2 + obj2.quantity;
                                                }, 0)
                                            );
                                        }, 0)
                                    )}
                                </span>
                            </div>
                            <div className="flex">
                                <h5 className="min-w-[230px]">Tổng số lượng thực : </h5>
                                <span className="min-w-[150px] text-right">
                                    {formatNumber(
                                        dataChoose.reduce((acc, obj) => {
                                            return (
                                                acc +
                                                obj.child?.reduce((acc2, obj2) => {
                                                    return acc2 + obj2.amount;
                                                }, 0)
                                            );
                                        }, 0)
                                    )}
                                </span>
                            </div>
                            <div className="flex">
                                <h5 className="min-w-[230px]">Tổng số lượng chênh lệch : </h5>
                                <span className="min-w-[150px] text-right">
                                    {formatNumber(
                                        dataChoose.reduce((acc, obj) => {
                                            return (
                                                acc +
                                                obj.child?.reduce((acc2, obj2) => {
                                                    return acc2 + (obj2.amount - obj2.quantity);
                                                }, 0)
                                            );
                                        }, 0)
                                    )}
                                </span>
                            </div>
                            <div className="flex">
                                <h5 className="min-w-[230px]">Thành tiền : </h5>
                                <span className="min-w-[150px] text-right">
                                    {formatMoney(
                                        dataChoose.reduce((acc, obj) => {
                                            return (
                                                acc +
                                                obj.child?.reduce((acc2, obj2) => {
                                                    return acc2 + obj2.amount * obj2.price;
                                                }, 0)
                                            );
                                        }, 0)
                                    )}
                                </span>
                            </div>
                            <div className="space-x-2">
                                <ButtonBack onClick={() => router.back()} dataLang={dataLang} />
                                <ButtonSubmit loading={onSending} onClick={_HandleSubmit} dataLang={dataLang} />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

const Popup_status = (props) => {
    const dataLang = props?.dataLang;
    const [onFetching, sOnFetching] = useState(false);

    const [open, sOpen] = useState(false);

    const dataSeting = useSetingServer();

    const formatnumber = (num) => {
        return formatNumberConfig(+num, dataSeting);
    };

    const _HandleClose = () => {
        sOpen(false);
        props.sDataErr(false);
    };
    useEffect(() => {
        if (props.dataErr) {
            sOpen(true);
        } else {
            sOpen(false);
        }
    }, [props]);

    const newDataChoose = props?.errData
        ?.filter((errItem) => errItem.status === 2)
        .map((errItem) => {
            const matchingChild = props?.dataChoose?.find((dataItem) =>
                dataItem.child.some((childItem) => childItem.id.toString() === errItem.id)
            );
            return {
                ...errItem,
                name: matchingChild && matchingChild.name,
            };
        });

    const _HandleSave = (e) => {
        const updatedData = props?.dataChoose.map((parent) => {
            const updatedChild = parent.child.map((child) => {
                const matchedItem = props?.errData?.find(
                    (item) => item.id_parent === parent.id && Number(item.id) === child.id
                );
                if (matchedItem) {
                    return {
                        ...child,
                        quantity: isNaN(Number(matchedItem.check_quantity_stock))
                            ? 0
                            : Number(matchedItem.check_quantity_stock),
                    };
                } else {
                    return child;
                }
            });
            return { ...parent, child: updatedChild };
        });
        props.db(updatedData);
        sOpen(false);
        props.sDataErr(false);
    };

    return (
        <PopupEdit
            title={"Phiếu kiểm kê bị thay đổi về số lượng thực" + " " + `${moment(new Date()).format("DD/MM/YYYY")}`}
            open={open}
            onClose={_HandleClose.bind(this)}
            classNameBtn={props.className}
        >
            <div className="mt-4 space-x-5 w-[990px] h-auto">
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    <div className="pr-2 w-[100%] lx:w-[120%] ">
                        <div className={`grid-cols-10 grid sticky top-0 bg-white shadow  z-10`}>
                            <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center">
                                {"Tên hàng"}
                            </h4>
                            <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center">
                                {"Số lượng thay đổi"}
                            </h4>
                            <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center">
                                {"Số lượng thực"}
                            </h4>
                            <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center">
                                {"Chênh lệch"}
                            </h4>
                            <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center">
                                {"Xử lý"}
                            </h4>
                        </div>
                        {onFetching ? (
                            <Loading className="h-50" color="#0f4f9e" />
                        ) : newDataChoose?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] mt-2 ">
                                    {newDataChoose?.map((e) => (
                                        <div className={`grid-cols-10  grid hover:bg-slate-50 items-center`}>
                                            <h6 className="text-[13px]  px-2 col-span-2 text-center capitalize">
                                                {e?.name}
                                            </h6>
                                            <h6 className="text-[13px]  px-2 col-span-2 text-center capitalize">
                                                {formatnumber(e?.check_quantity_stock)}
                                            </h6>
                                            <h6 className="text-[13px]  px-2 col-span-2 text-center capitalize">
                                                {formatnumber(e?.quantity_net)}
                                            </h6>
                                            <h6 className="text-[13px]  px-2 col-span-2 text-center capitalize">
                                                {formatnumber(e?.quantity_net - e?.check_quantity_stock)}
                                            </h6>
                                            <h6 className="text-[13px]  px-2 col-span-2 text-center capitalize">
                                                {e?.quantity_net - e?.check_quantity_stock > 0
                                                    ? `Mặt hàng cần điều chỉnh tăng ${
                                                          formatnumber(e?.quantity_net) -
                                                          formatnumber(e?.check_quantity_stock)
                                                      }`
                                                    : `Mặt hàng cần điều chỉnh giảm ${Math.abs(
                                                          formatnumber(e?.quantity_net) -
                                                              formatnumber(e?.check_quantity_stock)
                                                      )}`}
                                            </h6>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <NoData />
                        )}
                    </div>
                    <div className="space-x-2 text-right mt-4">
                        <button
                            onClick={_HandleClose.bind(this)}
                            className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                        >
                            {dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}
                        </button>
                        <button
                            onClick={_HandleSave.bind(this)}
                            type="submit"
                            className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                        >
                            {"Cập nhật"}
                        </button>
                    </div>
                </div>
            </div>
        </PopupEdit>
    );
};

export default Form;
