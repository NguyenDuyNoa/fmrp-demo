import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { _ServerInstance as Axios } from "/services/axios";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import Loading from "components/UI/loading";

import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import DatePicker from "react-datepicker";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import Select, { components, MenuListProps } from "react-select";

import { Add, Trash as IconDelete, Image as IconImage, MaximizeCircle, Minus, TableDocument } from "iconsax-react";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Link from "next/link";
import moment from "moment/moment";
import Popup from "reactjs-popup";
import { useSelector } from "react-redux";
import ToatstNotifi from "components/UI/alerNotification/alerNotification";
import { routerReturnSales } from "components/UI/router/sellingGoods";
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Index = (props) => {
    const router = useRouter();
    const id = router.query?.id;

    const dataLang = props?.dataLang;
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingDetail, sOnFetchingDetail] = useState(false);
    const [onFetchingCondition, sOnFetchingCondition] = useState(false);
    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);
    const [onFetchingClient, sOnFetchingClient] = useState(false);
    const [onLoading, sOnLoading] = useState(false);
    const [onLoadingChild, sOnLoadingChild] = useState(false);

    const [onSending, sOnSending] = useState(false);
    const [generalTax, sThuetong] = useState();
    const [generalDiscount, sGeneralD] = useState(0);
    const [code, sCode] = useState("");
    const [startDate, sStartDate] = useState(new Date());
    const [effectiveDate, sEffectiveDate] = useState(null);

    const [note, sNote] = useState("");
    const [date, sDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
    const [dataClient, sDataClient] = useState([]);
    const [dataTreatmentr, sDataTreatmentr] = useState([]);

    const [dataBranch, sDataBranch] = useState([]);
    const [dataItems, sDataItems] = useState([]);
    const [dataTasxes, sDataTasxes] = useState([]);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    const [listData, sListData] = useState([]);

    const [idBranch, sIdBranch] = useState(null);
    const [idClient, sIdClient] = useState(null);
    const [idTreatment, sIdTreatment] = useState(null);

    const [load, sLoad] = useState(false);

    const [errClient, sErrClient] = useState(false);
    const [errTreatment, sErrTreatment] = useState(false);
    const [errDate, sErrDate] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [errWarehouse, sErrWarehouse] = useState(false);
    const [errQuantity, sErrQuantity] = useState(false);
    const [errSurvive, sErrSurvive] = useState(false);
    const [errPrice, sErrPrice] = useState(false);
    const [errSurvivePrice, sErrSurvivePrice] = useState(false);

    const resetAllStates = () => {
        sCode("");
        sStartDate(new Date());
        sIdBranch(null);
        sIdClient(null);
        sNote("");
        sErrBranch(false);
        sErrDate(false);
        sErrClient(false);
        sErrQuantity(false);
        sErrSurvive(false);
        sErrSurvivePrice(false);
        sErrWarehouse(false);
        sErrTreatment(false);
    };

    useEffect(() => {
        router.query && resetAllStates();
    }, [router.query]);

    const _ServerFetching = () => {
        sOnLoading(true);
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { result } = response.data;
                sDataBranch(result?.map((e) => ({ label: e.name, value: e.id })));
                sOnLoading(false);
            }
        });
        Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataTasxes(
                    rResult?.map((e) => ({
                        label: e.name,
                        value: e.id,
                        tax_rate: e.tax_rate,
                    }))
                );
                sOnLoading(false);
            }
        });
        Axios("GET", "/api_web/Api_return_supplier/treatment_methods/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sDataTreatmentr(
                    data?.map((e) => ({
                        label: dataLang[e?.name],
                        value: e?.id,
                    }))
                );
                sOnLoading(false);
            }
        });

        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerFetchingCondition = () => {
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
                sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
                sDataProductSerial(data.find((x) => x.code == "product_serial"));
            }
            sOnFetchingCondition(false);
        });
    };

    useEffect(() => {
        onFetchingCondition && _ServerFetchingCondition();
    }, [onFetchingCondition]);

    useEffect(() => {
        id && sOnFetchingCondition(true);
    }, []);

    useEffect(() => {
        JSON.stringify(dataMaterialExpiry) === "{}" &&
            JSON.stringify(dataProductExpiry) === "{}" &&
            JSON.stringify(dataProductSerial) === "{}" &&
            sOnFetchingCondition(true);
    }, [
        JSON.stringify(dataMaterialExpiry) === "{}",
        JSON.stringify(dataProductExpiry) === "{}",
        JSON.stringify(dataProductSerial) === "{}",
    ]);

    const options = dataItems?.map((e) => ({
        label: `${e.name}
            <span style={{display: none}}>${e.code}</span>
            <span style={{display: none}}>${e.product_variation} </span>
            <span style={{display: none}}>${e.serial} </span>
            <span style={{display: none}}>${e.lot} </span>
            <span style={{display: none}}>${e.expiration_date} </span>
            <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
        value: e.id,
        e,
    }));

    const _ServerFetchingDetailPage = () => {
        Axios("GET", `/api_web/Api_delivery/getDeliveryDetail/${id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var rResult = response.data;
                sListData(
                    rResult?.items.map((e) => {
                        const child = e?.child.map((ce) => ({
                            id: Number(ce?.id),
                            idChildBackEnd: Number(ce?.id),
                            disabledDate:
                                (e.item?.text_type == "material" && dataMaterialExpiry?.is_enable == "1" && false) ||
                                (e.item?.text_type == "material" && dataMaterialExpiry?.is_enable == "0" && true) ||
                                (e.item?.text_type == "products" && dataProductExpiry?.is_enable == "1" && false) ||
                                (e.item?.text_type == "products" && dataProductExpiry?.is_enable == "0" && true),
                            warehouse: {
                                label: e?.item?.warehouse_location?.location_name,
                                value: e?.item?.warehouse_location?.id,
                                warehouse_name: e?.item?.warehouse_location?.warehouse_name,
                                qty: e?.item?.warehouse_location?.quantity,
                            },
                            dataWarehouse: e?.item?.warehouseList?.map((ce) => ({
                                label: ce?.location_name,
                                value: ce?.id,
                                warehouse_name: ce?.warehouse_name,
                                qty: ce?.quantity,
                                lot: ce?.lot,
                                date: ce?.expiration_date,
                                serial: ce?.serial,
                            })),
                            quantityStock: e?.item?.quantity,
                            quantityDelive: e?.item?.quantity_delivery,
                            unit: e?.item?.unit_name,
                            quantity: Number(ce?.quantity),
                            price: Number(ce?.price),
                            discount: Number(ce?.discount_percent_item),
                            tax: {
                                tax_rate: ce?.tax_rate_item,
                                value: ce?.tax_id_item,
                                label: ce?.tax_name_item || "Miễn thuế",
                            },
                            note: ce?.note_item,
                        }));
                        return {
                            id: e?.item?.id,
                            idParenBackend: e?.item?.id,
                            matHang: {
                                e: e?.item,
                                label: `${e.item?.name} <span style={{display: none}}>${
                                    e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name
                                }</span>`,
                                value: e.item?.id,
                            },
                            child: child,
                        };
                    })
                );
                sCode(rResult?.reference_no);
                sIdBranch({
                    label: rResult?.branch_name,
                    value: rResult?.branch_id,
                });
                sStartDate(moment(rResult?.date).toDate());
                sNote(rResult?.note);
                sIdAddress({ label: rResult?.name_address_delivery, value: rResult?.address_delivery_id });
                sIdClient({ label: rResult?.customer_name, value: rResult?.customer_id });
                sIdStaff({ label: rResult?.staff_full_name, value: rResult?.staff_id });
                sIdProductOrder({ label: rResult?.order_code, value: rResult?.order_id });
                sIdContactPerson(
                    rResult?.person_contact_id != 0 && {
                        label: rResult?.person_contact_name,
                        value: rResult?.person_contact_id,
                    }
                );
            }
            sOnFetchingDetail(false);
        });
    };

    useEffect(() => {
        onFetchingDetail && _ServerFetchingDetailPage();
    }, [onFetchingDetail]);

    useEffect(() => {
        id &&
            JSON.stringify(dataMaterialExpiry) !== "{}" &&
            JSON.stringify(dataProductExpiry) !== "{}" &&
            JSON.stringify(dataProductSerial) !== "{}" &&
            sOnFetchingDetail(true);
    }, [
        JSON.stringify(dataMaterialExpiry) !== "{}" &&
            JSON.stringify(dataProductExpiry) !== "{}" &&
            JSON.stringify(dataProductSerial) !== "{}",
    ]);

    const _ServerFetching_ItemsAll = () => {
        Axios(
            "POST",
            "/api_web/api_delivery/searchItemsVariant/?csrf_protection=true",
            {
                params: {
                    "filter[order_id]": idProductOrder !== null ? +idProductOrder.value : null,
                    "filter[delivery_id]": id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var { result } = response.data.data;
                    sDataItems(result);
                }
            }
        );
        sOnFetchingItemsAll(false);
    };

    const _ServerFetching_Client = () => {
        sOnLoading(true);
        Axios(
            "GET",
            "/api_web/api_client/client_option/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataClient(rResult?.map((e) => ({ label: e.name, value: e.id })));
                    sOnLoading(false);
                }
            }
        );
        sOnFetchingClient(false);
    };

    const checkListData = (value, sDataItems, sListData, sId, id, idEmty) => {
        return Swal.fire({
            title: `${dataLang?.returns_err_DeleteItem || "returns_err_DeleteItem"}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                sDataItems([]);
                sListData([]);
                sId(value);
                idEmty && idEmty(null);
            } else {
                sId({ ...id });
            }
        });
    };

    const _HandleChangeInput = (type, value) => {
        const onChange = {
            code: () => sCode(value.target.value),
            date: () => sDate(moment(value.target.value).format("YYYY-MM-DD HH:mm:ss")),
            idClient: () => {
                if (listData?.length > 0) {
                    checkListData(value, sDataItems, sListData, sIdClient, idClient);
                } else {
                    sIdClient(value);
                    if (value == null) {
                        alert("rỗng thì mặt hàng rỗng nhe");
                    }
                }
            },
            treatment: () => sIdTreatment(value),
            note: () => sNote(value.target.value),
            branch: () => {
                if (listData?.length > 0) {
                    checkListData(value, sDataItems, sListData, sIdBranch, idBranch, sIdClient);
                } else {
                    sIdBranch(value);
                    sIdClient(null);
                    sOnFetchingClient(true);
                    if (value == null) {
                        sDataClient([]);
                        sIdClient(null);
                    }
                }
            },
            generalTax: () => {
                sThuetong(value);
                if (listData?.length > 0) {
                    const newData = listData.map((e) => {
                        const newChild = e?.child.map((ce) => ({ ...ce, tax: value }));
                        return { ...e, child: newChild };
                    });
                    sListData(newData);
                }
            },
            generalDiscount: () => {
                sGeneralD(value?.value);
                if (listData?.length > 0) {
                    const newData = listData.map((e) => {
                        const newChild = e?.child.map((ce) => ({ ...ce, discount: value?.value }));
                        return { ...e, child: newChild };
                    });
                    sListData(newData);
                }
            },
        };
        onChange[type] && onChange[type]();
    };

    const handleClearDate = (type) => {
        if (type === "effectiveDate") {
            sEffectiveDate(null);
        }
        if (type === "startDate") {
            sStartDate(new Date());
        }
    };
    const handleTimeChange = (date) => {
        sStartDate(date);
    };

    useEffect(() => {
        router.query && sOnFetching(true);
    }, [router.query]);

    const useClearError = (condition, sState) => {
        useEffect(() => {
            sState(false);
        }, [condition]);
    };

    useClearError(date != null, sErrDate);
    useClearError(idClient != null, sErrClient);
    useClearError(idBranch != null, sErrBranch);
    useClearError(idTreatment != null, sErrTreatment);

    useEffect(() => {
        onFetchingClient && _ServerFetching_Client();
    }, [onFetchingClient]);

    const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes];

    const formatNumber = (number) => {
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    const _DataValueItem = (value) => {
        const newChild = {
            id: uuidv4(),
            idChildBackEnd: "",
            disabledDate:
                (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
            quantityStock: value?.e?.quantity,
            quantityDelive: value?.e?.quantity_delivery,
            warehouse: null,
            dataWarehouse: value?.e?.warehouseList?.map((e) => ({
                label: e?.location_name,
                value: e?.id,
                warehouse_name: e?.warehouse_name,
                qty: e?.quantity,
                lot: e?.lot,
                date: e?.expiration_date,
                serial: e?.serial,
            })),
            unit: value?.e?.unit_name,
            price: Number(value?.e?.price),
            quantity: value?.e?.quantity,
            discount: generalDiscount ? generalDiscount : Number(value?.e?.discount_percent_item),
            tax: generalTax
                ? generalTax
                : {
                      label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                      value: value?.e?.tax_id_item,
                      tax_rate: value?.e?.tax_rate_item,
                  },
            note: value?.e?.note_item,
        };
        return {
            newChild: newChild,
            parent: {
                id: uuidv4(),
                matHang: value,
                idParenBackend: "",
                child: [newChild],
            },
        };
    };

    const _HandleAddChild = (parentId, value) => {
        const newData = listData?.map((e) => {
            if (e?.id === parentId) {
                const { newChild } = _DataValueItem(value);
                return { ...e, child: [...e.child, newChild] };
            } else {
                return e;
            }
        });
        sListData(newData);
    };

    const _HandleAddParent = (value) => {
        const checkData = listData?.some((e) => e?.matHang?.value === value?.value);
        if (!checkData) {
            const { parent } = _DataValueItem(value);
            sListData([parent, ...listData]);
        } else {
            ToatstNotifi("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
        }
    };

    const _HandleDeleteChild = (parentId, childId) => {
        const newData = listData
            .map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child?.filter((ce) => ce?.id !== childId);
                    return { ...e, child: newChild };
                }
                return e;
            })
            .filter((e) => e.child?.length > 0);
        sListData([...newData]);
    };

    const _HandleDeleteAllChild = (parentId) => {
        const newData = listData
            .map((e) => {
                if (e.id === parentId) {
                    const newChild = e.child?.filter((ce) => ce?.warehouse !== null);
                    return { ...e, child: newChild };
                }
                return e;
            })
            .filter((e) => e.child?.length > 0);
        sListData([...newData]);
    };

    const _HandleChangeChild = (parentId, childId, type, value) => {
        const newData = listData.map((e) => {
            if (e?.id !== parentId) return e;

            const newChild = e.child?.map((ce) => {
                if (ce?.id !== childId) return ce;
                const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive;
                const totalSoLuong = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0);
                const checkWarehouse = e?.child?.some((i) => i?.warehouse?.value === value?.value);
                switch (type) {
                    case "quantity":
                        sErrSurvive(false);
                        ce.quantity = Number(value?.value);
                        funtionsCheckQuantity(parentId, childId);
                        break;

                    case "increase":
                        sErrSurvive(false);
                        if (+ce.quantity === +ce?.warehouse?.qty) {
                            ToatstNotifi(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                    +ce?.warehouse?.qty
                                )} số lượng tồn kho`,
                                3000
                            );
                        } else if (+ce.quantity === quantityAmount) {
                            ToatstNotifi(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
                                3000
                            );
                        } else if (+ce.quantity > +ce?.warehouse?.qty) {
                            ToatstNotifi(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                    +ce?.warehouse?.qty
                                )} số lượng tồn kho`,
                                3000
                            );
                        } else if (+ce.quantity > quantityAmount) {
                            ToatstNotifi(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
                                3000
                            );
                        } else {
                            ce.quantity = Number(ce?.quantity) + 1;
                        }
                        funtionsCheckQuantity(parentId, childId);
                        break;

                    case "decrease":
                        sErrSurvive(false);
                        ce.quantity = Number(ce?.quantity) - 1;
                        break;

                    case "price":
                        sErrSurvivePrice(false);
                        ce.price = Number(value?.value);
                        break;

                    case "discount":
                        ce.discount = Number(value?.value);
                        break;

                    case "note":
                        ce.note = value?.target.value;
                        break;

                    case "warehouse":
                        if (!checkWarehouse && +ce?.quantity > +value?.qty) {
                            ToatstNotifi(
                                "error",
                                `Số lượng chưa giao vượt quá ${formatNumber(+value?.qty)} số lượng tồn kho`
                            );
                            ce.warehouse = value;
                            ce.quantity = value?.qty;
                            funtionsCheckQuantity(parentId, childId);
                        } else if (!checkWarehouse && totalSoLuong > quantityAmount) {
                            funtionsCheckQuantity(parentId, childId);
                            ce.warehouse = value;
                        } else if (checkWarehouse) {
                            ToatstNotifi("error", `Kho - vị trí kho đã được chọn`);
                        } else {
                            ce.warehouse = value;
                        }
                        break;

                    case "tax":
                        ce.tax = value;
                        break;

                    default:
                }

                return { ...ce };
            });

            return { ...e, child: newChild };
        });

        sListData([...newData]);
    };

    const funtionsCheckQuantity = (parentId, childId) => {
        const e = listData.find((item) => item?.id == parentId);
        if (!e) return;

        const ce = e.child.find((child) => child?.id == childId);
        if (!ce) return;

        const checkChild = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0);
        const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive;

        if (checkChild > quantityAmount) {
            ToatstNotifi("error", `Tổng số lượng vượt quá ${formatNumber(quantityAmount)} số lượng chưa giao`);
            ce.quantity = "";
            HandTimeout();
            sErrQuantity(true);
        }
        if (checkChild > +ce?.warehouse?.qty) {
            ToatstNotifi("error", `Tổng số lượng vượt quá ${formatNumber(+ce?.warehouse?.qty)} số lượng tồn`);
            ce.quantity = "";
            sErrQuantity(true);
            HandTimeout();
        }
    };

    const HandTimeout = () => {
        setTimeout(() => {
            sLoad(true);
        }, 500);
        setTimeout(() => {
            sLoad(false);
        }, 1000);
    };

    const _HandleChangeValue = (parentId, value) => {
        const checkData = listData?.some((e) => e?.matHang?.value === value?.value);
        if (!checkData) {
            const newData = listData?.map((e) => {
                if (e?.id === parentId) {
                    const { parent } = _DataValueItem(value);
                    return parent;
                } else {
                    return e;
                }
            });
            sListData([...newData]);
        } else {
            ToatstNotifi("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
        }
    };

    const selectItemsLabel = (option) => {
        let quantityUndelived = +option?.e?.quantity - +option?.e?.quantity_delivery;
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center ">
                    <div>
                        {option.e?.images !== null ? (
                            <img
                                src={option.e?.images}
                                alt="Product Image"
                                className="3xl:max-w-[40px] 3xl:h-[40px] 2xl:max-w-[40px] 2xl:h-[40px] xl:max-w-[40px] xl:h-[40px] max-w-[40px] h-[40px] text-[8px] object-cover rounded mr-1"
                            />
                        ) : (
                            <div className="3xl:max-w-[40px] 3xl:h-[40px] 2xl:max-w-[40px] 2xl:h-[40px] xl:max-w-[40px] xl:h-[40px] max-w-[40px] h-[40px] object-cover flex items-center justify-center rounded xl:mr-1 mx-0.5">
                                <img
                                    src="/no_img.png"
                                    alt="Product Image"
                                    className="3xl:max-w-[40px] 3xl:h-[40px] 2xl:max-w-[40px] 2xl:h-[40px] xl:max-w-[40px] xl:h-[40px] max-w-[40px] h-[40px] object-cover rounded mr-1"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium 3xl:text-[14px] 2xl:text-[11px] xl:text-[10px] text-[10px] whitespace-pre-wrap">
                            {option.e?.name}
                        </h3>

                        <div className="flex 3xl:gap-2 2xl:gap-1 xl:gap-1 gap-1">
                            <h5 className="text-gray-400  3xl:text-[14px] 2xl:text-[11px] xl:text-[8px] text-[7px]">
                                {option.e?.code} :
                            </h5>
                            <h5 className="3xl:text-[14px] 2xl:text-[11px] xl:text-[8px] text-[7px]">
                                {option.e?.product_variation}
                            </h5>
                        </div>
                        <div className="flex 3xl:gap-3 2xl:gap-3 xl:gap-3 gap-1">
                            <div className="flex items-center gap-1">
                                <h5 className="min-w-1/3 text-gray-400 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {dataLang[option.e?.text_type]}
                                </h5>
                                <h5 className="text-gray-400 font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {dataLang?.delivery_receipt_quantity || "delivery_receipt_quantity"}:
                                </h5>

                                <h5 className=" font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {option.e?.quantity ? formatNumber(+option.e?.quantity) : "0"}
                                </h5>
                            </div>

                            <div className="flex items-center gap-1">
                                <h5 className="text-gray-400 font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {dataLang?.delivery_receipt_quantity_undelivered_order ||
                                        "delivery_receipt_quantity_undelivered_order"}
                                    :
                                </h5>

                                <h5 className=" font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {quantityUndelived ? formatNumber(+quantityUndelived) : "0"}
                                </h5>
                            </div>

                            <div className="flex items-center gap-1">
                                <h5 className="text-gray-400 font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {dataLang?.delivery_receipt_quantity_delivered_order ||
                                        "delivery_receipt_quantity_delivered_order"}
                                    :
                                </h5>

                                <h5 className=" font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                    {option.e?.quantity_delivery ? formatNumber(+option.e?.quantity_delivery) : "0"}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const _HandleSubmit = (e) => {
        e.preventDefault();

        const checkChildItem = (childItem, property) => {
            switch (property) {
                case "warehouse":
                    return (
                        childItem.warehouse === null ||
                        (id && (!childItem.warehouse?.label || !childItem.warehouse?.warehouse_name))
                    );
                case "quantity":
                    return childItem.quantity === null || childItem.quantity === "" || childItem.quantity == 0;
                case "price":
                    return childItem.price === null || childItem.price === "" || childItem.price == 0;
                default:
                    return false;
            }
        };

        const checkPropertyRecursive = (list, property) => {
            return list.some((item) => item.child?.some((childItem) => checkChildItem(childItem, property)));
        };

        const hasNullWarehouse = checkPropertyRecursive(listData, "warehouse");
        const hasNullQuantity = checkPropertyRecursive(listData, "quantity");
        const hasNullPrice = checkPropertyRecursive(listData, "price");

        const isTotalExceeded = listData?.some(
            (e) =>
                !hasNullWarehouse &&
                e.child?.some((opt) => {
                    const quantity = parseFloat(opt?.quantity) || 0;
                    const qty = parseFloat(opt?.warehouse?.qty) || 0;
                    return quantity > qty;
                })
        );

        const isEmpty = listData?.length === 0 ? true : false;
        if (
            idClient == null ||
            idBranch == null ||
            idTreatment == null ||
            hasNullWarehouse ||
            hasNullQuantity ||
            hasNullPrice ||
            isTotalExceeded ||
            isEmpty
        ) {
            idClient == null && sErrClient(true);
            idTreatment == null && sErrTreatment(true);
            idBranch == null && sErrBranch(true);
            hasNullWarehouse && sErrWarehouse(true);
            hasNullQuantity && sErrQuantity(true);
            hasNullPrice && sErrPrice(true);
            if (isEmpty) {
                ToatstNotifi("error", `Chưa nhập thông tin mặt hàng`);
            } else if (isTotalExceeded) {
                sErrSurvive(true);
                ToatstNotifi("error", `${dataLang?.returns_err_QtyNotQexceed || "returns_err_QtyNotQexceed"}`);
            } else if (hasNullPrice) {
                sErrSurvivePrice(true);
                ToatstNotifi("error", `${"Vui lòng nhập đơn giá"}`);
            } else {
                ToatstNotifi("error", `${dataLang?.required_field_null}`);
            }
        } else {
            sOnSending(true);
        }
    };

    const _ServerSending = async () => {
        let formData = new FormData();
        formData.append("code", code ? code : "");
        formData.append(
            "date",
            moment(startDate).format("YYYY-MM-DD HH:mm:ss") ? moment(startDate).format("YYYY-MM-DD HH:mm:ss") : ""
        );
        formData.append("branch_id", idBranch?.value ? idBranch?.value : "");
        formData.append("client_id", idClient?.value ? idClient?.value : "");
        formData.append("person_contact_id", idContactPerson?.value ? idContactPerson?.value : "");
        formData.append("address_id", idAddress?.value ? idAddress?.value : "");
        formData.append("staff_id", idStaff?.value ? idStaff?.value : "");
        formData.append("product_order_id", idProductOrder?.value ? idProductOrder?.value : "");
        formData.append("note", note ? note : "");
        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, id ? item?.idParenBackend : "");
            formData.append(`items[${index}][item]`, item?.matHang?.value);
            item?.child?.forEach((childItem, childIndex) => {
                formData.append(`items[${index}][child][${childIndex}][row_id]`, id ? childItem?.idChildBackEnd : "");
                formData.append(
                    `items[${index}][child][${childIndex}][warehouse_id]`,
                    childItem?.warehouse?.value || 0
                );
                formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.quantity);
                formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price);
                formData.append(`items[${index}][child][${childIndex}][discount]`, childItem?.discount);
                formData.append(`items[${index}][child][${childIndex}][tax]`, childItem?.tax?.value);
                formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note ? childItem?.note : "");
            });
        });
        await Axios(
            "POST",
            `${
                id
                    ? `/api_web/Api_delivery/updateDelivery/${id}?csrf_protection=true`
                    : "/api_web/Api_delivery/AddDelivery/?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        ToatstNotifi("success", `${dataLang[message] || message}`);
                        resetAllStates();
                        sListData([]);
                        router.push(routerReturnSales.home);
                    } else {
                        ToatstNotifi("error", `${dataLang[message] || message}`);
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    return (
        <React.Fragment>
            <Head>
                <title>{id ? "Sửa trả lại hàng bán" : "Thêm trả lại hàng bán"}</title>
            </Head>
            <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    {trangthaiExprired ? (
                        <div className="p-2"></div>
                    ) : (
                        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                            <h6 className="text-[#141522]/40">
                                {dataLang?.delivery_receipt_edit_notes || "delivery_receipt_edit_notes"}
                            </h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>{id ? "Sửa trả lại hàng bán" : "Thêm trả lại hàng bán"}</h6>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-2xl text-xl ">{"Trả lại hàng bán"}</h2>
                        <div className="flex justify-end items-center">
                            <button
                                onClick={() => router.push(routerReturnSales.home)}
                                className="xl:text-sm text-xs xl:px-5 px-3 hover:bg-blue-500 hover:text-white transition-all ease-in-out xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.import_comeback || "import_comeback"}
                            </button>
                        </div>
                    </div>

                    <div className=" w-full rounded">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2">
                                {dataLang?.purchase_order_detail_general_informatione ||
                                    "purchase_order_detail_general_informatione"}
                            </h2>
                            <div className="grid grid-cols-10 gap-3 items-center mt-2">
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_code_vouchers || "import_code_vouchers"}{" "}
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        name="fname"
                                        type="text"
                                        placeholder={
                                            dataLang?.purchase_order_system_default || "purchase_order_system_default"
                                        }
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                                    />
                                </div>
                                <div className="col-span-2 relative">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                    </label>
                                    <div className="custom-date-picker flex flex-row">
                                        <DatePicker
                                            blur
                                            fixedHeight
                                            showTimeSelect
                                            selected={startDate}
                                            onSelect={(date) => sStartDate(date)}
                                            onChange={(e) => handleTimeChange(e)}
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default || "price_quote_system_default"
                                            }
                                            className={`border ${
                                                errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                            } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {startDate && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => handleClearDate("startDate")}
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_branch || "import_branch"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idBranch}
                                        isLoading={idBranch != null ? false : onLoading}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        className={`${
                                            errBranch ? "border-red-500" : "border-transparent"
                                        } placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
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
                                            menu: (provided) => ({
                                                ...provided,
                                                // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                boxShadow: "none",
                                                padding: "2.7px",
                                                ...(state.isFocused && {
                                                    border: "0 0 0 1px #92BFF7",
                                                }),
                                            }),
                                        }}
                                    />
                                    {errBranch && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {"Khách hàng"} <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataClient}
                                        onChange={_HandleChangeInput.bind(this, "idClient")}
                                        value={idClient}
                                        isLoading={onLoading}
                                        placeholder={"Khách hàng"}
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${
                                            errClient ? "border-red-500" : "border-transparent"
                                        } placeholder:text-slate-300 w-full z-[30]  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
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
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                boxShadow: "none",
                                                padding: "2.7px",
                                                ...(state.isFocused && {
                                                    border: "0 0 0 1px #92BFF7",
                                                }),
                                            }),
                                        }}
                                    />
                                    {errClient && (
                                        <label className="text-sm text-red-500">{"Vui lòng chọn khách hàng"}</label>
                                    )}
                                </div>
                                <div className="col-span-2 ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.returns_treatment_methods || "returns_treatment_methods"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataTreatmentr}
                                        onChange={_HandleChangeInput.bind(this, "treatment")}
                                        isLoading={idBranch || idClient != null ? false : onLoading}
                                        value={idTreatment}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.returns_treatment_methods || "returns_treatment_methods"}
                                        className={`${
                                            errTreatment ? "border-red-500" : "border-transparent"
                                        } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
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
                                            menu: (provided) => ({
                                                ...provided,
                                                // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                boxShadow: "none",
                                                padding: "2.7px",
                                                ...(state.isFocused && {
                                                    border: "0 0 0 1px #92BFF7",
                                                }),
                                            }),
                                        }}
                                    />
                                    {errTreatment && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.returns_treatment_methods_err || "returns_treatment_methods_err"}
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" bg-[#ECF0F4] p-2 grid  grid-cols-12">
                        <div className="font-normal col-span-12">
                            {dataLang?.import_item_information || "import_item_information"}
                        </div>
                    </div>
                    <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-2 text-center truncate font-[400]">
                            {dataLang?.import_from_items || "import_from_items"}
                        </h4>
                        <div className="col-span-10">
                            <div className="grid grid-cols-11">
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]">
                                    {dataLang?.PDF_house || "PDF_house"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {"ĐVT"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.import_from_quantity || "import_from_quantity"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.import_from_unit_price || "import_from_unit_price"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.import_from_discount || "import_from_discount"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.returns_sck || "returns_sck"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.import_from_tax || "import_from_tax"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_into_money || "import_into_money"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_from_note || "import_from_note"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_from_operation || "import_from_operation"}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 items-center gap-1 py-2">
                        <div className="col-span-2">
                            <Select
                                options={options}
                                value={null}
                                onChange={_HandleAddParent.bind(this)}
                                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                placeholder={dataLang?.returns_items || "returns_items"}
                                noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                menuPortalTarget={document.body}
                                formatOptionLabel={selectItemsLabel}
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
                                        // zIndex: 9999,
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        ...(state.isFocused && {
                                            border: "0 0 0 1px #92BFF7",
                                            boxShadow: "none",
                                        }),
                                    }),
                                    menu: (provided, state) => ({
                                        ...provided,
                                        width: "150%",
                                    }),
                                }}
                            />
                        </div>
                        <div className="col-span-10">
                            <div className="grid grid-cols-11  divide-x border-t border-b border-r border-l">
                                <div className="col-span-2">
                                    {" "}
                                    <Select
                                        classNamePrefix="customDropdowDefault"
                                        placeholder={
                                            dataLang?.delivery_receipt_warehouse || "delivery_receipt_warehouse"
                                        }
                                        className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-span-1"></div>
                                <div className="col-span-1 flex  justify-center items-center">
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Minus className="2xl:scale-100 xl:scale-100 scale-50" size="16" />
                                    </button>
                                    <div className=" text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none border-b border-gray-200">
                                        1
                                    </div>
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Add className="2xl:scale-100 xl:scale-100 scale-50" size="16" />
                                    </button>
                                </div>
                                <div className="col-span-1 justify-center flex items-center">
                                    <div className=" 3xl:text-[12px] w-full 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-1 px-2 font-medium bg-slate-50 text-black">
                                        1
                                    </div>
                                </div>
                                <div className="col-span-1 justify-center flex items-center">
                                    <div className=" w-full 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-1 px-2 font-medium bg-slate-50">
                                        0
                                    </div>
                                </div>
                                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black flex items-center justify-end">
                                    0
                                </div>
                                <div className="col-span-1 flex items-center w-full">
                                    <Select
                                        classNamePrefix="customDropdowDefault"
                                        placeholder={dataLang?.returns_tax || "returns_tax"}
                                        className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] w-full"
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black  flex items-center justify-end">
                                    1
                                </div>
                                <input
                                    placeholder={dataLang?.returns_note || "returns_note"}
                                    disabled
                                    className=" disabled:bg-gray-50 col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                                />
                                <button
                                    title={dataLang?.returns_delete || "returns_delete"}
                                    disabled
                                    className="col-span-1 disabled:opacity-50 transition w-full h-full bg-slate-100  rounded-[5.5px] text-red-500 flex flex-col justify-center items-center"
                                >
                                    <IconDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="min:h-[400px] h-[100%] max:h-[800px] w-full">
                            {onFetchingDetail ? (
                                <Loading className="h-10 w-full" color="#0f4f9e" />
                            ) : (
                                <>
                                    {listData?.map((e) => (
                                        <div
                                            key={e?.id?.toString()}
                                            className="grid grid-cols-12 gap-2 my-1 items-start"
                                        >
                                            <div className="col-span-2 border border-r p-2 pb-1 h-full">
                                                <div className="relative mt-5">
                                                    <Select
                                                        options={options}
                                                        value={e?.matHang}
                                                        className=""
                                                        onChange={_HandleChangeValue.bind(this, e?.id)}
                                                        menuPortalTarget={document.body}
                                                        formatOptionLabel={selectItemsLabel}
                                                        classNamePrefix="customDropdow"
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
                                                                // zIndex: 9999,
                                                            }),
                                                            control: (base, state) => ({
                                                                ...base,
                                                                ...(state.isFocused && {
                                                                    border: "0 0 0 1px #92BFF7",
                                                                    boxShadow: "none",
                                                                }),
                                                            }),
                                                            menu: (provided, state) => ({
                                                                ...provided,
                                                                width: "150%",
                                                            }),
                                                        }}
                                                    />
                                                    <button
                                                        onClick={_HandleAddChild.bind(this, e?.id, e?.matHang)}
                                                        className="w-8 h-8 rounded bg-slate-100 flex flex-col justify-center items-center absolute -top-4 right-5 hover:rotate-45 hover:bg-slate-200 transition hover:scale-105 hover:text-red-500 ease-in-out"
                                                    >
                                                        <Add className="" />
                                                    </button>
                                                </div>
                                                {e?.child?.filter((e) => e?.warehouse == null).length >= 2 && (
                                                    <button
                                                        onClick={_HandleDeleteAllChild.bind(this, e?.id, e?.matHang)}
                                                        className="w-full rounded mt-1.5 px-5 py-1 overflow-hidden group bg-rose-500 relative hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-rose-400 transition-all ease-out duration-300"
                                                    >
                                                        <span className="absolute right-0 w-full h-full -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                                        <span className="relative text-xs">
                                                            Xóa {e?.child?.filter((e) => e?.warehouse == null).length}{" "}
                                                            hàng chưa chọn kho
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="col-span-10  items-center">
                                                <div className="grid grid-cols-11  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b divide-x divide-y border-r">
                                                    {load ? (
                                                        <Loading className="h-2 col-span-11" color="#0f4f9e" />
                                                    ) : (
                                                        e?.child?.map((ce) => (
                                                            <React.Fragment key={ce?.id?.toString()}>
                                                                <div className="p-1 border-t border-l  flex flex-col col-span-2 justify-center h-full">
                                                                    <Select
                                                                        options={ce?.dataWarehouse}
                                                                        value={ce?.warehouse}
                                                                        isLoading={
                                                                            ce?.warehouse == null
                                                                                ? onLoadingChild
                                                                                : false
                                                                        }
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "warehouse"
                                                                        )}
                                                                        className={`${
                                                                            (errWarehouse && ce?.warehouse == null) ||
                                                                            (errWarehouse &&
                                                                                (ce?.warehouse?.label == null ||
                                                                                    ce?.warehouse?.warehouse_name ==
                                                                                        null))
                                                                                ? "border-red-500 border"
                                                                                : ""
                                                                        }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                                                        placeholder={
                                                                            onLoadingChild
                                                                                ? ""
                                                                                : dataLang?.PDF_house || "PDF_house"
                                                                        }
                                                                        menuPortalTarget={document.body}
                                                                        formatOptionLabel={(option) => {
                                                                            return (
                                                                                (option?.warehouse_name ||
                                                                                    option?.label ||
                                                                                    option?.qty) && (
                                                                                    <div className="">
                                                                                        <div className="flex gap-1">
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                {"Kho"}:
                                                                                            </h2>
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                                                                {option?.warehouse_name}
                                                                                            </h2>
                                                                                        </div>
                                                                                        <div className="flex gap-1">
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                {"Vị trí kho"}:
                                                                                            </h2>
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                                                                {option?.label}
                                                                                            </h2>
                                                                                        </div>
                                                                                        <div className="flex gap-1">
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                {dataLang?.returns_survive ||
                                                                                                    "returns_survive"}
                                                                                                :
                                                                                            </h2>
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] uppercase font-semibold">
                                                                                                {formatNumber(
                                                                                                    option?.qty
                                                                                                )}
                                                                                            </h2>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2 italic">
                                                                                            {dataProductSerial.is_enable ===
                                                                                                "1" && (
                                                                                                <div className="text-[11px] text-[#667085] font-[500]">
                                                                                                    Serial:{" "}
                                                                                                    {option?.serial
                                                                                                        ? option?.serial
                                                                                                        : "-"}
                                                                                                </div>
                                                                                            )}
                                                                                            {dataMaterialExpiry.is_enable ===
                                                                                                "1" ||
                                                                                            dataProductExpiry.is_enable ===
                                                                                                "1" ? (
                                                                                                <>
                                                                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                                                                        Lot:{" "}
                                                                                                        {option?.lot
                                                                                                            ? option?.lot
                                                                                                            : "-"}
                                                                                                    </div>
                                                                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                                                                        Date:{" "}
                                                                                                        {option?.date
                                                                                                            ? moment(
                                                                                                                  option?.date
                                                                                                              ).format(
                                                                                                                  "DD/MM/YYYY"
                                                                                                              )
                                                                                                            : "-"}
                                                                                                    </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                ""
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            );
                                                                        }}
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
                                                                        // styles={{
                                                                        //   menu: (provided, state) => ({
                                                                        //     ...provided,
                                                                        //     width: "200%",
                                                                        //   }),
                                                                        // }}
                                                                        classNamePrefix="customDropdow"
                                                                    />
                                                                </div>
                                                                <div className="text-center  p-0.5 pr-2.5 h-full flex flex-col justify-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                    {ce?.unit}
                                                                </div>
                                                                <div className="relative">
                                                                    <div className="flex items-center justify-center h-full p-0.5">
                                                                        <button
                                                                            disabled={
                                                                                ce?.quantity === 1 ||
                                                                                ce?.quantity === "" ||
                                                                                ce?.quantity === null ||
                                                                                ce?.quantity === 0
                                                                            }
                                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                            onClick={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "decrease"
                                                                            )}
                                                                        >
                                                                            <Minus
                                                                                className="2xl:scale-100 xl:scale-100 scale-50"
                                                                                size="16"
                                                                            />
                                                                        </button>
                                                                        <NumericFormat
                                                                            onValueChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "quantity"
                                                                            )}
                                                                            value={ce?.quantity || null}
                                                                            className={`${
                                                                                errQuantity &&
                                                                                (ce?.quantity == null ||
                                                                                    ce?.quantity == "" ||
                                                                                    ce?.quantity == 0)
                                                                                    ? "border-b border-red-500"
                                                                                    : errSurvive
                                                                                    ? "border-b border-red-500"
                                                                                    : "border-b border-gray-200"
                                                                            } appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                                            allowNegative={false}
                                                                            decimalScale={0}
                                                                            isNumericString={true}
                                                                            thousandSeparator=","
                                                                            isAllowed={(values) => {
                                                                                const { value } = values;
                                                                                const newValue = +value;
                                                                                const quantityAmount =
                                                                                    +ce?.quantityStock -
                                                                                    +ce?.quantityDelive;

                                                                                if (newValue > +ce?.warehouse?.qty) {
                                                                                    ToatstNotifi(
                                                                                        "error",
                                                                                        `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                                                            +ce?.warehouse?.qty
                                                                                        )} số lượng tồn kho`
                                                                                    );
                                                                                    return;
                                                                                } else if (newValue > quantityAmount) {
                                                                                    ToatstNotifi(
                                                                                        "error",
                                                                                        `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                                                            quantityAmount
                                                                                        )} số lượng chưa giao`
                                                                                    );
                                                                                    return;
                                                                                }
                                                                                return true;
                                                                            }}
                                                                        />
                                                                        <button
                                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                            onClick={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "increase"
                                                                            )}
                                                                        >
                                                                            <Add
                                                                                className="2xl:scale-100 xl:scale-100 scale-50"
                                                                                size="16"
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    <div className="absolute top-0 right-0 p-1 cursor-pointer ">
                                                                        <Popup
                                                                            className=""
                                                                            trigger={
                                                                                <div className="relative ">
                                                                                    <TableDocument
                                                                                        size="18"
                                                                                        color="#4f46e5"
                                                                                        className="font-medium"
                                                                                    />
                                                                                    <span className="h-2 w-2  absolute top-0 left-1/2  translate-x-[50%] -translate-y-[50%]">
                                                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-indigo-500">
                                                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 absolute"></span>
                                                                                        </span>
                                                                                    </span>
                                                                                </div>
                                                                            }
                                                                            position="left center"
                                                                            on={["hover", "focus"]}
                                                                        >
                                                                            <div className="flex flex-col bg-gray-300 px-2.5 py-0.5 rounded-sm">
                                                                                <span className="font-medium text-xs">
                                                                                    Sl tồn:{" "}
                                                                                    {ce?.warehouse == null
                                                                                        ? 0
                                                                                        : formatNumber(
                                                                                              +ce?.warehouse?.qty
                                                                                          )}
                                                                                </span>

                                                                                <span className="font-medium text-xs">
                                                                                    Sl đã giao:{" "}
                                                                                    {formatNumber(ce?.quantityDelive)}
                                                                                </span>
                                                                                <span className="font-medium text-xs">
                                                                                    Sl chưa giao:{" "}
                                                                                    {formatNumber(
                                                                                        ce?.quantityStock -
                                                                                            ce?.quantityDelive
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </Popup>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                    <NumericFormat
                                                                        className={`${
                                                                            errPrice &&
                                                                            (ce?.price == null ||
                                                                                ce?.price == "" ||
                                                                                ce?.price == 0)
                                                                                ? "border-b border-red-500"
                                                                                : errSurvivePrice &&
                                                                                  (ce?.price == null ||
                                                                                      ce?.price == "" ||
                                                                                      ce?.price == 0)
                                                                                ? "border-b border-red-500"
                                                                                : "border-b border-gray-200"
                                                                        } appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "price"
                                                                        )}
                                                                        value={ce?.price}
                                                                        allowNegative={false}
                                                                        decimalScale={0}
                                                                        isNumericString={true}
                                                                        thousandSeparator=","
                                                                    />
                                                                </div>
                                                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                    <NumericFormat
                                                                        className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b border-gray-200"
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "discount"
                                                                        )}
                                                                        value={ce?.discount}
                                                                        allowNegative={false}
                                                                        decimalScale={0}
                                                                        isNumericString={true}
                                                                        thousandSeparator=","
                                                                        isAllowed={(values) => {
                                                                            const { value } = values;
                                                                            if (+value > 100) {
                                                                                ToatstNotifi(
                                                                                    "error",
                                                                                    " % Chiết khấu chỉ được bé hơn hoặc bằng 100%"
                                                                                );
                                                                            }
                                                                            return value < 101;
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="col-span-1 text-right flex items-center justify-end  h-full p-0.5">
                                                                    <h3 className="px-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                        {formatNumber(
                                                                            Number(ce?.price) *
                                                                                (1 - Number(ce?.discount) / 100)
                                                                        )}
                                                                    </h3>
                                                                </div>
                                                                <div className=" flex flex-col items-center p-1 h-full justify-center">
                                                                    <Select
                                                                        options={taxOptions}
                                                                        value={ce?.tax}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "tax"
                                                                        )}
                                                                        placeholder={
                                                                            dataLang?.import_from_tax ||
                                                                            "import_from_tax"
                                                                        }
                                                                        className={`  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                                                        menuPortalTarget={document.body}
                                                                        style={{
                                                                            border: "none",
                                                                            boxShadow: "none",
                                                                            outline: "none",
                                                                        }}
                                                                        formatOptionLabel={(option) => (
                                                                            <div className="flex justify-start items-center gap-1 ">
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                                    {option?.label}
                                                                                </h2>
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">{`(${option?.tax_rate})`}</h2>
                                                                            </div>
                                                                        )}
                                                                        theme={(theme) => ({
                                                                            ...theme,
                                                                            colors: {
                                                                                ...theme.colors,
                                                                                primary25: "#EBF5FF",
                                                                                primary50: "#92BFF7",
                                                                                primary: "#0F4F9E",
                                                                            },
                                                                        })}
                                                                        classNamePrefix="customDropdowTax"
                                                                    />
                                                                </div>
                                                                {/* <div>{ce?.thanhTien}</div> */}
                                                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                    {formatNumber(
                                                                        ce?.price *
                                                                            (1 - Number(ce?.discount) / 100) *
                                                                            (1 + Number(ce?.tax?.tax_rate) / 100) *
                                                                            Number(ce?.quantity)
                                                                    )}
                                                                </div>
                                                                {/* <div>{ce?.note}</div> */}
                                                                <div className="col-span-1 flex items-center justify-center  h-full p-0.5">
                                                                    <input
                                                                        value={ce?.note}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "note"
                                                                        )}
                                                                        placeholder={
                                                                            dataLang?.delivery_receipt_note ||
                                                                            "delivery_receipt_note"
                                                                        }
                                                                        type="text"
                                                                        className="  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 outline-none mb-2"
                                                                    />
                                                                </div>
                                                                <div className=" h-full p-0.5 flex flex-col items-center justify-center">
                                                                    <button
                                                                        title="Xóa"
                                                                        onClick={_HandleDeleteChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id
                                                                        )}
                                                                        className=" text-red-500 flex flex-col justify-center items-center hover:scale-110 bg-red-50 p-2 rounded-md hover:bg-red-200 transition-all ease-linear animate-bounce-custom"
                                                                    >
                                                                        <IconDelete />
                                                                    </button>
                                                                </div>
                                                            </React.Fragment>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center">
                        <div className="col-span-2  flex items-center gap-2">
                            <h2>{dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h2>
                            <div className="col-span-1 text-center flex items-center justify-center">
                                <NumericFormat
                                    value={generalDiscount}
                                    onValueChange={_HandleChangeInput.bind(this, "generalDiscount")}
                                    className=" text-center py-1 px-2 bg-transparent font-medium w-20 focus:outline-none border-b-2 border-gray-300"
                                    thousandSeparator=","
                                    allowNegative={false}
                                    decimalScale={0}
                                    isNumericString={true}
                                />
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 ">
                            <h2>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h2>
                            <Select
                                options={taxOptions}
                                onChange={_HandleChangeInput.bind(this, "generalTax")}
                                value={generalTax}
                                formatOptionLabel={(option) => (
                                    <div className="flex justify-start items-center gap-1 ">
                                        <h2>{option?.label}</h2>
                                        <h2>{`(${option?.tax_rate})`}</h2>
                                    </div>
                                )}
                                placeholder={dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}
                                hideSelectedOptions={false}
                                className={` "border-transparent placeholder:text-slate-300 w-[70%] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                isSearchable={true}
                                noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                //  dangerouslySetInnerHTML={{__html: option.label}}
                                menuPortalTarget={document.body}
                                closeMenuOnSelect={true}
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
                                        zIndex: 20,
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        boxShadow: "none",
                                        padding: "2.7px",
                                        ...(state.isFocused && {
                                            border: "0 0 0 1px #92BFF7",
                                        }),
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                        {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}{" "}
                    </h2>
                </div>
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.returns_reason || "returns_reason"}
                        </div>
                        <textarea
                            value={note}
                            placeholder={dataLang?.returns_reason || "returns_reason"}
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                        />
                    </div>
                    <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal ">
                                <h3>{dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {/* {formatNumber(tongTienState.tongTien)} */}
                                    {formatNumber(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product = Number(childItem?.price) * Number(childItem?.quantity);
                                                return childAccumulator + product;
                                            }, 0);
                                            return accumulator + childTotal;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {/* {formatNumber(tongTienState.tienChietKhau)} */}
                                    {formatNumber(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price) *
                                                    (Number(childItem?.discount) / 100) *
                                                    Number(childItem?.quantity);
                                                return childAccumulator + product;
                                            }, 0);
                                            return accumulator + childTotal;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {/* {formatNumber(tongTienState.tongTienSauCK)} */}
                                    {formatNumber(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.discount / 100)) *
                                                    Number(childItem?.quantity);
                                                return childAccumulator + product;
                                            }, 0);
                                            return accumulator + childTotal;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {/* {formatNumber(tongTienState.tienThue)} */}
                                    {formatNumber(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.discount / 100)) *
                                                    (isNaN(childItem?.tax?.tax_rate)
                                                        ? 0
                                                        : Number(childItem?.tax?.tax_rate) / 100) *
                                                    Number(childItem?.quantity);
                                                return childAccumulator + product;
                                            }, 0);
                                            return accumulator + childTotal;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {/* {formatNumber(tongTienState.tongThanhTien)} */}
                                    {formatNumber(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.discount / 100)) *
                                                    (1 + Number(childItem?.tax?.tax_rate) / 100) *
                                                    Number(childItem?.quantity);
                                                return childAccumulator + product;
                                            }, 0);
                                            return accumulator + childTotal;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => router.push(routerReturnSales.home)}
                                className="button text-[#344054] font-normal text-base hover:bg-blue-500 hover:text-white hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}
                            </button>
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                type="submit"
                                className="button text-[#FFFFFF] hover:bg-blue-500 font-normal text-base hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
const MoreSelectedBadge = ({ items }) => {
    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;
    // const label = ``;

    return (
        <div className="ml-auto bg-sky-500 rounded-md text-xs px-1 py-1 order-[99] text-white" title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 0;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};

export default Index;
