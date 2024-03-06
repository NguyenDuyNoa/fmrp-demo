import Head from "next/head";
import Popup from "reactjs-popup";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { _ServerInstance as Axios } from "/services/axios";

import { MdClear } from "react-icons/md";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";

import Select, { components } from "react-select";

import { Add, Trash as IconDelete, Image as IconImage, Minus, TableDocument } from "iconsax-react";
import { NumericFormat } from "react-number-format";

import PopupAddress from "./components/PopupAddress";

import Loading from "@/components/UI/loading";
import ToatstNotifi from "@/utils/helpers/alerNotification";
import { routerDeliveryReceipt } from "routers/sellingGoods";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";

const Index = (props) => {
    const router = useRouter();
    const id = router.query?.id;

    const dataLang = props?.dataLang;

    const isShow = useToast();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const trangthaiExprired = useStatusExprired();

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingDetail, sOnFetchingDetail] = useState(false);

    const [onFetchingCondition, sOnFetchingCondition] = useState(false);

    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);

    const [onFetchingClient, sOnFetchingClient] = useState(false);

    const [onFetchingContactPerson, sOnFetchingContactPerson] = useState(false);

    const [onFetchingStaff, sOnFetchingStaff] = useState(false);

    const [onFetchingProductOrder, sOnFetchingProductOrder] = useState(false);

    const [onFetchingAddress, sOnFetchingAddress] = useState(false);

    const [openPopupAddress, sOpenPopupAddress] = useState(false);

    const [onLoading, sOnLoading] = useState(false);

    const [onLoadingChild, sOnLoadingChild] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [generalTax, sThuetong] = useState();

    const [generalDiscount, sChietkhautong] = useState(0);

    const [code, sCode] = useState("");

    const [startDate, sStartDate] = useState(new Date());

    const [effectiveDate, sEffectiveDate] = useState(null);

    const [note, sNote] = useState("");

    const [date, sDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));

    const [dataClient, sDataClient] = useState([]);

    const [dataContactPerson, sDataContactPerson] = useState([]);

    const [dataStaff, sDataStaff] = useState([]);

    const [dataBranch, sDataBranch] = useState([]);

    const [dataProductOrder, sDataProductOrder] = useState([]);

    const [dataAddress, sDataAddress] = useState([]);

    const [dataItems, sDataItems] = useState([]);

    const [dataTasxes, sDataTasxes] = useState([]);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});

    const [dataProductExpiry, sDataProductExpiry] = useState({});

    const [dataProductSerial, sDataProductSerial] = useState({});

    const [listData, sListData] = useState([]);

    const [idBranch, sIdBranch] = useState(null);

    const [idClient, sIdClient] = useState(null);

    const [idContactPerson, sIdContactPerson] = useState(null);

    const [idStaff, sIdStaff] = useState(null);

    const [idProductOrder, sIdProductOrder] = useState(null);

    const [idAddress, sIdAddress] = useState(null);

    const [itemAll, sItemAll] = useState([]);

    const [load, sLoad] = useState(false);

    const [errClient, sErrClient] = useState(false);

    const [errStaff, sErrStaff] = useState(false);

    const [errProductOrder, sErrProductOrder] = useState(false);

    const [errDate, sErrDate] = useState(false);

    const [errAddress, sErrAddress] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [errWarehouse, sErrWarehouse] = useState(false);

    const [errQuantity, sErrQuantity] = useState(false);

    const [errSurvive, sErrSurvive] = useState(false);

    const [errPrice, sErrPrice] = useState(false);

    const [errSurvivePrice, sErrSurvivePrice] = useState(false);

    const _HandleClosePopupAddress = (e) => {
        sOpenPopupAddress(e);
        !e && _ServerFetching_Address();
    };

    const resetAllStates = () => {
        sCode("");
        sStartDate(new Date());
        sIdBranch(null);
        sIdClient(null);
        sIdContactPerson(null);
        sIdProductOrder(null);
        sIdStaff(null);
        sIdAddress(null);
        sNote("");
        sErrBranch(false);
        sErrDate(false);
        sErrClient(false);
        sErrProductOrder(false);
        sErrQuantity(false);
        sErrStaff(false);
        sErrSurvive(false);
        sErrSurvivePrice(false);
        sErrWarehouse(false);
    };

    useEffect(() => {
        router.query && resetAllStates();
    }, [router.query]);

    const _ServerFetching = () => {
        sOnLoading(true);
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                sDataBranch(result?.map((e) => ({ label: e.name, value: e.id })));
                sOnLoading(false);
            }
        });
        Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
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

        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerFetchingCondition = () => {
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let data = response.data;
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
            <span style={{display: none}}>${e.product_letiation} </span>
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
                let rResult = response.data;
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
                                lot: e?.item?.warehouse_location?.lot,
                                date: e?.item?.warehouse_location?.expiration_date,
                                serial: e?.item?.warehouse_location?.serial,
                            },
                            dataWarehouse: e?.item?.warehouseList?.map((s) => ({
                                label: s?.location_name,
                                value: s?.id,
                                warehouse_name: s?.warehouse_name,
                                qty: s?.quantity,
                                lot: s?.lot,
                                date: s?.expiration_date,
                                serial: s?.serial,
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
                                label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_letiation + e.item?.text_type + e.item?.unit_name
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
                    let { result } = response.data.data;
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
                    let { rResult } = response.data;
                    sDataClient(rResult?.map((e) => ({ label: e.name, value: e.id })));
                    sOnLoading(false);
                }
            }
        );
        sOnFetchingClient(false);
    };

    const _ServerFetching_ContactPerson = () => {
        sOnLoading(true);
        Axios(
            "GET",
            "/api_web/api_client/contactCombobox/?csrf_protection=true",
            {
                params: {
                    "filter[client_id]": idClient != null ? idClient.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult } = response.data;
                    sDataContactPerson(rResult?.map((e) => ({ label: e.full_name, value: e.id })));
                    sOnLoading(false);
                }
            }
        );
        sOnFetchingContactPerson(false);
    };

    const _ServerFetching_Staff = () => {
        sOnLoading(true);
        Axios(
            "GET",
            "/api_web/Api_staff/staffOption?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idBranch !== null ? +idBranch?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult } = response.data;
                    sDataStaff(rResult?.map((e) => ({ label: e.name, value: e.staffid })));
                    sOnLoading(false);
                }
            }
        );
        sOnFetchingStaff(false);
    };

    const _ServerFetching_ProductOrder = () => {
        let data = new FormData();
        data.append("branch_id", idBranch !== null ? +idBranch.value : null);
        data.append("client_id", idClient !== null ? +idClient.value : null);
        id && data.append("filter[delivery_id]", id ? id : "");
        Axios(
            "POST",
            `/api_web/api_delivery/searchOrdersToCustomer?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { results } = response?.data;
                    sDataProductOrder(results?.map((e) => ({ label: e.text, value: e.id })));
                }
            }
        );
        sOnFetchingProductOrder(false);
    };

    const _ServerFetching_Address = () => {
        let data = new FormData();
        data.append("client_id", idClient !== null ? +idClient.value : null);
        Axios(
            "POST",
            `/api_web/api_delivery/GetShippingClient?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let rResult = response?.data;
                    sDataAddress(rResult?.map((e) => ({ label: e.name, value: e.id })));
                }
            }
        );
        sOnFetchingAddress(false);
    };

    useEffect(() => {
        idBranch === null && sDataClient([]);
    }, []);

    const handleSaveStatus = () => {
        isKeyState?.sDataItems([]);
        isKeyState?.sListData([]);
        isKeyState?.sId(isKeyState?.value);
        isKeyState?.sIdStaff && isKeyState?.sIdStaff(null);
        isKeyState?.idEmty && isKeyState?.idEmty(null);
        handleQueryId({ status: false });
    };

    const handleCancleStatus = () => {
        isKeyState?.sId({ ...isKeyState?.id });
        handleQueryId({ status: false });
    };

    const checkListData = (value, sDataItems, sListData, sId, id, idEmty, sIdStaff) => {
        return handleQueryId({
            status: true,
            initialKey: {
                value,
                sDataItems,
                sListData,
                sId,
                id,
                idEmty,
                sIdStaff,
            },
        });
    };

    const _HandleChangeInput = (type, value) => {
        if (type == "code") {
            sCode(value.target.value);
        } else if (type === "date") {
            sDate(moment(value.target.value).format("YYYY-MM-DD HH:mm:ss"));
        } else if (type === "idClient" && idClient != value) {
            if (listData?.length > 0) {
                checkListData(value, sDataItems, sListData, sIdClient, idClient, sIdProductOrder);
            } else {
                sIdClient(value);
                sIdProductOrder(null);
                sIdContactPerson(null);
                sDataContactPerson([]);
                if (value == null) {
                    sDataProductOrder([]);
                }
            }
        } else if (type === "idContactPerson") {
            sIdContactPerson(value);
        } else if (type === "idStaff" && idStaff != value) {
            sIdStaff(value);
        } else if (type === "idProductOrder" && idProductOrder != value) {
            if (listData?.length > 0) {
                checkListData(value, sDataItems, sListData, sIdProductOrder, idProductOrder);
            } else {
                sIdProductOrder(value);
            }
        } else if (type === "idAddress") {
            sIdAddress(value);
        } else if (type === "itemAll" && itemAll != value) {
            sItemAll(value);
            if (value?.length === 0) {
                sListData([]);
            } else if (value?.length > 0) {
                const newData = value?.map((e, index) => {
                    const parent = _DataValueItem(e).parent;
                    return parent;
                });
                sListData([...newData]);
            }
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type == "branch" && idBranch != value) {
            if (listData?.length > 0) {
                checkListData(value, sDataItems, sListData, sIdBranch, idBranch, sIdClient, sIdStaff);
            } else {
                sIdBranch(value);
                sIdClient(null);
                sIdProductOrder(null);
                sIdContactPerson(null);
                sIdStaff(null);
                if (value == null) {
                    sDataClient([]);
                }
            }
        } else if (type == "generalTax") {
            sThuetong(value);
            if (listData?.length > 0) {
                const newData = listData.map((e) => {
                    const newChild = e?.child.map((ce) => {
                        return { ...ce, tax: value };
                    });
                    return { ...e, child: newChild };
                });
                sListData(newData);
            }
        } else if (type == "generalDiscount") {
            sChietkhautong(value?.value);
            if (listData?.length > 0) {
                const newData = listData.map((e) => {
                    const newChild = e?.child.map((ce) => {
                        return { ...ce, discount: value?.value };
                    });
                    return { ...e, child: newChild };
                });
                sListData(newData);
            }
        }
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
        sErrDate(false);
    }, [date != null]);

    useEffect(() => {
        sErrClient(false);
    }, [idClient != null]);

    useEffect(() => {
        sErrStaff(false);
    }, [idStaff != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [idBranch != null]);

    useEffect(() => {
        sErrProductOrder(false);
    }, [idProductOrder != null]);

    useEffect(() => {
        sErrAddress(false);
    }, [idAddress != null]);

    useEffect(() => {
        router.query && sOnFetching(true);
    }, [router.query]);

    useEffect(() => {
        onFetchingClient && _ServerFetching_Client();
    }, [onFetchingClient]);
    useEffect(() => {
        onFetchingStaff && _ServerFetching_Staff();
    }, [onFetchingStaff]);

    useEffect(() => {
        if (idBranch == null) {
            sIdClient(null);
            sIdProductOrder(null);
            sDataProductOrder([]);
            sIdStaff(null);
            sDataStaff([]);
        } else {
            sOnFetchingClient(true);
            sOnFetchingStaff(true);
        }
    }, [idBranch]);

    useEffect(() => {
        idBranch != null && idClient != null && sOnFetchingProductOrder(true);
    }, [idBranch, idClient]);

    useEffect(() => {
        idProductOrder != null && sOnFetchingItemsAll(true);
    }, [idProductOrder]);

    useEffect(() => {
        if (idClient == null) {
            sIdProductOrder(null);
            sDataProductOrder([]);
        } else {
            _ServerFetching_ContactPerson(true);
            sOnFetchingAddress(true);
        }
    }, [idClient]);

    const useFetchingEffect = (condition, serverFetchFunction) => {
        useEffect(() => {
            if (condition) {
                serverFetchFunction();
            }
        }, [condition, serverFetchFunction]);
    };

    useFetchingEffect(onFetchingContactPerson, _ServerFetching_Client);
    useFetchingEffect(onFetchingProductOrder, _ServerFetching_ProductOrder);
    useFetchingEffect(onFetchingAddress, _ServerFetching_Address);
    useFetchingEffect(onFetchingItemsAll, _ServerFetching_ItemsAll);

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
                // const newChild = _DataValueItem(value).newChild;
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
            // const newData = _DataValueItem(value).parent;
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
        sItemAll([...newData]);
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
                        FunCheckQuantity(parentId, childId);
                        break;

                    case "increase":
                        sErrSurvive(false);
                        if (+ce.quantity === +ce?.warehouse?.qty) {
                            isShow(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                    +ce?.warehouse?.qty
                                )} số lượng tồn kho`,
                                3000
                            );
                        } else if (+ce.quantity === quantityAmount) {
                            isShow(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
                                3000
                            );
                        } else if (+ce.quantity > +ce?.warehouse?.qty) {
                            isShow(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                    +ce?.warehouse?.qty
                                )} số lượng tồn kho`,
                                3000
                            );
                        } else if (+ce.quantity > quantityAmount) {
                            isShow(
                                "error",
                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
                                3000
                            );
                        } else {
                            ce.quantity = Number(ce?.quantity) + 1;
                        }
                        FunCheckQuantity(parentId, childId);
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
                            isShow(
                                "error",
                                `Số lượng chưa giao vượt quá ${formatNumber(+value?.qty)} số lượng tồn kho`
                            );
                            ce.warehouse = value;
                            ce.quantity = value?.qty;
                            FunCheckQuantity(parentId, childId);
                        } else if (!checkWarehouse && totalSoLuong > quantityAmount) {
                            FunCheckQuantity(parentId, childId);
                            ce.warehouse = value;
                        } else if (checkWarehouse) {
                            isShow("error", `Kho - vị trí kho đã được chọn`);
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

    const FunCheckQuantity = (parentId, childId) => {
        const e = listData.find((item) => item?.id == parentId);
        if (!e) return;

        const ce = e.child.find((child) => child?.id == childId);
        if (!ce) return;

        const checkChild = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0);
        const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive;

        if (checkChild > quantityAmount) {
            isShow("error", `Tổng số lượng vượt quá ${formatNumber(quantityAmount)} số lượng chưa giao`);

            ce.quantity = "";
            HandTimeout();
            sErrQuantity(true);
        }
        if (checkChild > +ce?.warehouse?.qty) {
            isShow("error", `Tổng số lượng vượt quá ${formatNumber(+ce?.warehouse?.qty)} số lượng tồn`);
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
            isShow("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
        }
    };

    const handleSelectAll = (type) => {
        if (type == "addAll") {
            const newData = [...dataItems]?.map((e) => {
                const { parent } = _DataValueItem({ e: e });
                return parent;
            });
            sListData([...newData]);
            return;
        } else {
            sListData([]);
            return;
        }
    };

    const MenuList = (props) => {
        return (
            <components.MenuList {...props}>
                {dataItems?.length > 0 && (
                    <div className="grid grid-cols-2 items-center  cursor-pointer">
                        <div
                            className="hover:bg-slate-200 p-2 col-span-1 text-center 3xl:text-[16px] 2xl:text-[16px] xl:text-[14px] text-[13px] "
                            onClick={() => handleSelectAll("addAll")}
                        >
                            Chọn tất cả
                        </div>
                        <div
                            className="hover:bg-slate-200 p-2 col-span-1 text-center 3xl:text-[16px] 2xl:text-[16px] xl:text-[14px] text-[13px]"
                            onClick={() => handleSelectAll("deleteAll")}
                        >
                            Bỏ chọn tất cả
                        </div>
                    </div>
                )}
                {props.children}
            </components.MenuList>
        );
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
                                {option.e?.product_letiation}
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

        const hasNullWarehouse = listData.some((item) =>
            item.child?.some(
                (childItem) =>
                    childItem.warehouse === null ||
                    (id && (childItem.warehouse?.label === null || childItem.warehouse?.warehouse_name === null))
            )
        );

        const hasNullQuantity = listData.some((item) =>
            item.child?.some(
                (childItem) => childItem.quantity === null || childItem.quantity === "" || childItem.quantity == 0
            )
        );
        const hasNullPrice = listData.some((item) =>
            item.child?.some((childItem) => childItem.price === null || childItem.price === "" || childItem.price == 0)
        );

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
            idStaff == null ||
            idBranch == null ||
            idProductOrder == null ||
            idAddress == null ||
            hasNullWarehouse ||
            hasNullQuantity ||
            hasNullPrice ||
            isTotalExceeded ||
            isEmpty
        ) {
            idClient == null && sErrClient(true);
            idAddress == null && sErrAddress(true);
            idStaff == null && sErrStaff(true);
            idBranch == null && sErrBranch(true);
            idProductOrder == null && sErrProductOrder(true);
            hasNullWarehouse && sErrWarehouse(true);
            hasNullQuantity && sErrQuantity(true);
            hasNullPrice && sErrPrice(true);
            if (isEmpty) {
                isShow("error", `Chưa nhập thông tin mặt hàng`);
            } else if (isTotalExceeded) {
                sErrSurvive(true);
                isShow("error", `${dataLang?.returns_err_QtyNotQexceed || "returns_err_QtyNotQexceed"}`);
            } else if (hasNullPrice) {
                sErrSurvivePrice(true);
                isShow("error", `${"Vui lòng nhập đơn giá"}`);
            } else {
                isShow("error", `${dataLang?.required_field_null}`);
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
            `${id
                ? `/api_web/Api_delivery/updateDelivery/${id}?csrf_protection=true`
                : "/api_web/Api_delivery/AddDelivery/?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", `${dataLang[message] || message}`);
                        resetAllStates();
                        sListData([]);
                        router.push(routerDeliveryReceipt.home);
                    } else {
                        isShow("error", `${dataLang[message] || message}`);
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
                <title>
                    {id
                        ? dataLang?.delivery_receipt_edit || "delivery_receipt_edit"
                        : dataLang?.delivery_receipt_add || "delivery_receipt_add"}
                </title>
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
                            <h6>
                                {id
                                    ? dataLang?.delivery_receipt_edit || "delivery_receipt_edit"
                                    : dataLang?.delivery_receipt_add || "delivery_receipt_add"}
                            </h6>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-2xl text-xl ">
                            {dataLang?.delivery_receipt_edit_notes || "delivery_receipt_edit_notes"}
                        </h2>
                        <div className="flex justify-end items-center">
                            <button
                                onClick={() => router.push(routerDeliveryReceipt.home)}
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
                            <div className="grid grid-cols-12  gap-3 items-center mt-2">
                                <div className="col-span-3">
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
                                <div className="col-span-3 relative">
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
                                            className={`border ${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
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
                                <div className="col-span-3">
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
                                        className={`${errBranch ? "border-red-500" : "border-transparent"
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
                                <div className="col-span-3">
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
                                        className={`${errClient ? "border-red-500" : "border-transparent"
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
                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {"Người liên lạc"}
                                    </label>
                                    <Select
                                        options={dataContactPerson}
                                        onChange={_HandleChangeInput.bind(this, "idContactPerson")}
                                        isLoading={idBranch || idClient != null ? false : onLoading}
                                        value={idContactPerson}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={"Người liên lạc"}
                                        className={`placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                </div>

                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal 3xl:text-sm 2xl:text-[13px] text-[13px] ">
                                        {dataLang?.address || "address"} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Select
                                            options={dataAddress}
                                            onChange={_HandleChangeInput.bind(this, "idAddress")}
                                            value={idAddress}
                                            // isLoading={loading}
                                            placeholder={dataLang?.select_address || "select_address"}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            className={`${errAddress ? "border border-red-500 rounded-md" : ""
                                                } rounded-md 3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] `}
                                            isSearchable={true}
                                            // components={{
                                            //     ClearIndicator,
                                            //     LoadingIndicator,
                                            //     SelectIndicator,
                                            // }}
                                            noOptionsMessage={() => "Không có dữ liệu"}
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
                                                    padding: "0.7px",
                                                }),
                                            }}
                                        />
                                        <AiFillPlusCircle
                                            onClick={() => _HandleClosePopupAddress(true)}
                                            className="right-0 top-0 -translate-x-[450%] 3xl:translate-y-[80%] 2xl:translate-y-[70%] xl:translate-y-[70%] translate-y-[60%] 2xl:scale-150 scale-125 cursor-pointer text-sky-400 hover:text-sky-500 3xl:hover:scale-[1.7] 2xl:hover:scale-[1.6] hover:scale-150 hover:rotate-180  transition-all ease-in-out absolute "
                                        />
                                        <PopupAddress
                                            dataLang={dataLang}
                                            clientId={idClient?.value}
                                            handleFetchingAddress={_ServerFetching_Address}
                                            openPopupAddress={openPopupAddress}
                                            handleClosePopupAddress={() => _HandleClosePopupAddress(false)}
                                            className="hidden"
                                        />
                                        {errAddress && (
                                            <label className="text-sm text-red-500">
                                                {dataLang?.delivery_receipt_err_select_address ||
                                                    "delivery_receipt_err_select_address"}
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.delivery_receipt_edit_User || "delivery_receipt_edit_User"}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataStaff}
                                        onChange={_HandleChangeInput.bind(this, "idStaff")}
                                        isLoading={idBranch != null ? false : onLoading}
                                        value={idStaff}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={
                                            dataLang?.delivery_receipt_edit_User || "delivery_receipt_edit_User"
                                        }
                                        className={`${errStaff ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        // className={`placeholder:text-slate-300 w-full z-20  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                    {errStaff && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.delivery_receipt_err_userStaff ||
                                                "delivery_receipt_err_userStaff"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.delivery_receipt_product_order || "delivery_receipt_product_order"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataProductOrder}
                                        onChange={_HandleChangeInput.bind(this, "idProductOrder")}
                                        isLoading={idBranch || idClient != null ? false : onLoading}
                                        value={idProductOrder}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={
                                            dataLang?.delivery_receipt_product_order || "delivery_receipt_product_order"
                                        }
                                        className={`${errProductOrder ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                    {errProductOrder && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.delivery_receipt_err_select_product_order ||
                                                "delivery_receipt_err_select_product_order"}
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
                    <div className="grid grid-cols-12">
                        <div div className="col-span-3">
                            <label className="text-[#344054] font-normal 2xl:text-base text-[14px]">
                                {dataLang?.import_click_items || "import_click_items"}
                            </label>
                            <Select
                                options={idProductOrder ? options : []}
                                closeMenuOnSelect={false}
                                onChange={_HandleChangeInput.bind(this, "itemAll")}
                                value={itemAll?.value ? itemAll?.value : listData?.map((e) => e?.matHang)}
                                isMulti
                                components={{ MenuList, MultiValue }}
                                formatOptionLabel={(option) => selectItemsLabel(option)}
                                placeholder={"Chọn nhanh mặt hàng"}
                                hideSelectedOptions={false}
                                className="rounded-md bg-white 3xl:text-[16px] 2xl:text-[10px] xl:text-[13px] text-[12.5px] "
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                menuPortalTarget={document.body}
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
                                        zIndex: 100,
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        boxShadow: "none",
                                        padding: "0.7px",
                                    }),
                                }}
                            />
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
                                    1.00
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
                                                                        className={`${(errWarehouse && ce?.warehouse == null) ||
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
                                                                            console.log("option", option);
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
                                                                            className={`${errQuantity &&
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
                                                                                    isShow(
                                                                                        "error",
                                                                                        `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                                                            +ce?.warehouse?.qty
                                                                                        )} số lượng tồn kho`
                                                                                    );
                                                                                    return;
                                                                                } else if (newValue > quantityAmount) {
                                                                                    isShow(
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
                                                                        className={`${errPrice &&
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
                                                                                isShow(
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
                                onClick={() => router.push(routerDeliveryReceipt.home)}
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
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={handleCancleStatus}
            />
        </React.Fragment>
    );
};
const MoreSelectedBadge = ({ items }) => {
    // const style = {
    //     marginLeft: "auto",
    //     background: "#d4eefa",
    //     borderRadius: "4px",
    //     fontSize: "13px",
    //     padding: "2px 4px",
    //     order: 99,
    // };

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
