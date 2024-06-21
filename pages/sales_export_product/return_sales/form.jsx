import { Add, Trash as IconDelete, Minus, TableDocument } from "iconsax-react";
import moment from "moment/moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import Select from "react-select";
import Popup from "reactjs-popup";
import { v4 as uuidv4 } from "uuid";

import { _ServerInstance as Axios } from "/services/axios";


import Loading from "@/components/UI/loading";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { routerReturnSales } from "routers/sellingGoods";

import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { Container } from "@/components/UI/common/layout";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { isAllowedDiscount, isAllowedNumber } from "@/utils/helpers/common";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";

const Index = (props) => {
    const router = useRouter();

    const id = router.query?.id;

    const initsFetching = {
        onFetching: false,
        onFetchingDetail: false,
        onFetchingCondition: false,
        onFetchingItemsAll: false,
        onFetchingClient: false,
        onLoading: false,
        onLoadingChild: false,
        onFetchingWarehouser: false,
        onSending: false,
        load: false,
    };

    const initsErors = {
        errClient: false,
        errTreatment: false,
        errBranch: false,
        errWarehouse: false,
        errQuantity: false,
        errSurvive: false,
        errPrice: false,
        errSurvivePrice: false,
    };

    const initsArr = {
        dataBranch: [],
        dataItems: [],
        dataClient: [],
        dataTasxes: [],
        dataTreatmentr: [],
        dataWarehouse: [],
    };

    const initsValue = {
        code: "",
        date: new Date(),
        idBranch: null,
        idClient: null,
        idTreatment: null,
        note: "",
    };

    const dataLang = props?.dataLang;

    const isShow = useToast();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const statusExprired = useStatusExprired();

    const [fetChingData, sFetchingData] = useState(initsFetching);

    const dataSeting = useSetingServer()

    const { dataMaterialExpiry, dataProductSerial, dataProductExpiry } = useFeature()

    const [generalTax, sGeneralTax] = useState();

    const [generalDiscount, sGeneralD] = useState(0);

    const [dataSelect, sDataSelect] = useState(initsArr);

    const [idChange, sIdChange] = useState(initsValue);

    const [errors, sErrors] = useState(initsErors);

    const [listData, sListData] = useState([]);

    const resetAllStates = () => {
        sIdChange(initsValue);
        sErrors(initsErors);
    };

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };
    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    useEffect(() => {
        router.query && resetAllStates();
    }, [router.query]);

    const _ServerFetching = () => {
        sFetchingData((e) => ({ ...e, onLoading: true }));

        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                sDataSelect((e) => ({
                    ...e,
                    dataBranch: result?.map((e) => ({ label: e.name, value: e.id })),
                }));
                sFetchingData((e) => ({ ...e, onLoading: false }));
            }
        });

        Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sDataSelect((e) => ({
                    ...e,
                    dataTasxes: rResult?.map((e) => ({
                        label: e.name,
                        value: e.id,
                        tax_rate: e.tax_rate,
                    })),
                }));
                sFetchingData((e) => ({ ...e, onLoading: false }));
            }
        });

        Axios(
            "GET",
            "/api_web/Api_return_order/comboboxHandlingSolution/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    sDataSelect((e) => ({
                        ...e,
                        dataTreatmentr: data?.map((e) => ({
                            label: dataLang[e?.name] ? dataLang[e?.name] : e?.name,
                            value: e?.id,
                        })),
                    }));
                    sFetchingData((e) => ({ ...e, onLoading: false }));
                }
            }
        );

        sFetchingData((e) => ({ ...e, onFetching: false }));
    };

    useEffect(() => {
        fetChingData.onFetching && _ServerFetching();
    }, [fetChingData.onFetching]);


    const options = dataSelect.dataItems?.map((e) => ({
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
        Axios("GET", `/api_web/Api_return_order/getDetail/${id}?csrf_protection=true`, {}, (err, response) => {
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
                                label: ce?.location_name,
                                value: ce?.location_warehouses_id,
                                warehouse_name: ce?.warehouse_name,
                            },
                            quantityDelivered: e?.item?.quantity_create,
                            quantityPay: e?.item?.quantity_returned,
                            quantityLeft: e?.item?.quantity_left,
                            unit: e?.item?.unit_name,
                            quantity: Number(ce?.quantity),
                            price: Number(ce?.price),
                            discount: Number(ce?.discount_percent),
                            tax: {
                                tax_rate: ce?.tax_rate || "0",
                                value: ce?.tax_id || "0",
                                label: ce?.tax_name || "Miễn thuế",
                            },
                            note: ce?.note,
                        }));
                        return {
                            id: e?.item?.id,
                            idParenBackend: e?.item?.id,
                            matHang: {
                                e: e?.item,
                                label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name
                                    }</span>`,
                                value: e.item?.id,
                            },
                            child: child,
                        };
                    })
                );
                sIdChange({
                    code: rResult.code,
                    date: moment(rResult?.date).toDate(),
                    idBranch: {
                        label: rResult?.branch_name,
                        value: rResult?.branch_id,
                    },
                    idClient: {
                        label: rResult?.client_name,
                        value: rResult?.client_id,
                    },
                    idTreatment: {
                        label: dataLang[rResult?.handling_solution] || rResult?.handling_solution,
                        value: rResult?.handling_solution,
                    },
                    note: rResult?.note,
                });
            }
            sFetchingData((e) => ({ ...e, onFetchingDetail: false }));
        });
    };

    useEffect(() => {
        fetChingData.onFetchingDetail && _ServerFetchingDetailPage();
    }, [fetChingData.onFetchingDetail]);

    useEffect(() => {
        id && sFetchingData((e) => ({ ...e, onFetchingDetail: true }));
    }, [id]);

    const _ServerFetching_ItemsAll = () => {
        Axios(
            "POST",
            "/api_web/Api_return_order/getDeliveriItems?csrf_protection=true",
            {
                params: {
                    "filter[client_id]": idChange.idClient !== null ? +idChange.idClient.value : null,
                    "filter[branch_id]": idChange.idBranch !== null ? +idChange.idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { result } = response.data.data;
                    sDataSelect((e) => ({
                        ...e,
                        dataItems: result,
                    }));
                }
            }
        );

        sFetchingData((e) => ({ ...e, onFetchingItemsAll: false }));
    };

    const _ServerFetching_Client = () => {
        sFetchingData((e) => ({ ...e, onLoading: true }));
        Axios(
            "GET",
            "/api_web/api_client/client_option/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idChange.idBranch != null ? idChange.idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult } = response.data;

                    sDataSelect((e) => ({
                        ...e,
                        dataClient: rResult?.map((e) => ({ label: e.name, value: e.id })),
                    }));
                    sFetchingData((e) => ({ ...e, onLoading: false }));
                }
            }
        );
        sFetchingData((e) => ({ ...e, onFetchingClient: false }));
    };

    const _ServerFetching_Warehouse = () => {
        Axios(
            "GET",
            "/api_web/api_warehouse/Getcomboboxlocation/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idChange.idBranch ? idChange.idBranch?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let result = response.data.rResult;
                    sDataSelect((e) => ({
                        ...e,
                        dataWarehouse: result?.map((e) => ({
                            label: e?.name,
                            value: e?.id,
                            warehouse_name: e?.warehouse_name,
                        })),
                    }));
                }
            }
        );
        sFetchingData((e) => ({ ...e, onFetchingWarehouser: false }));
    };

    const handleSaveStatus = () => {
        isKeyState?.sDataSelect((e) => ({ ...e, dataItems: [] }));
        isKeyState?.sListData([]);
        isKeyState?.sId(isKeyState?.value);
        isKeyState?.idEmty && isKeyState?.idEmty(null);
        handleQueryId({ status: false });
    };

    const handleCancleStatus = () => {
        isKeyState?.sId({ ...isKeyState?.id });
        handleQueryId({ status: false });
    };

    const checkListData = (value, sDataSelect, sListData, sId, id, idEmty) => {
        handleQueryId({
            status: true,
            initialKey: { value, sDataSelect, sListData, sId, id, idEmty },
        });
    };

    const _HandleChangeInput = (type, value) => {
        const sIdClient = (e) => {
            sIdChange((list) => ({ ...list, idClient: e }));
        };

        const sIdBranch = (e) => {
            sIdChange((list) => ({ ...list, idBranch: e }));
        };

        const onChange = {
            code: () => sIdChange((e) => ({ ...e, code: value.target.value })),

            date: () => sIdChange((e) => ({ ...e, date: formatMoment(value, FORMAT_MOMENT.DATE_TIME_LONG) })),

            startDate: () => sIdChange((e) => ({ ...e, date: new Date() })),

            idClient: () => {
                if (idChange.idClient != value)
                    if (listData?.length > 0) {
                        checkListData(value, sDataSelect, sListData, sIdClient, idChange.idClient);
                    } else {
                        sIdChange((e) => ({ ...e, idClient: value }));

                        sFetchingData((e) => ({ ...e, onFetchingItemsAll: true }));

                        if (value == null) {
                            sFetchingData((e) => ({ ...e, onFetchingItemsAll: false }));

                            sDataSelect((e) => ({ ...e, dataItems: [] }));
                        }
                    }
            },

            treatment: () => sIdChange((e) => ({ ...e, idTreatment: value })),

            note: () => sIdChange((e) => ({ ...e, note: value.target.value })),

            branch: () => {
                if (idChange.idBranch != value)
                    if (listData?.length > 0) {
                        checkListData(value, sDataSelect, sListData, sIdBranch, idChange.idBranch, sIdClient);
                    } else {
                        sIdChange((e) => ({ ...e, idClient: null, idBranch: value }));
                        sFetchingData((e) => ({ ...e, onFetchingClient: true }));
                        if (value == null) {
                            sDataSelect((e) => ({ ...e, dataClient: [] }));
                            sIdChange((e) => ({ ...e, idClient: null }));
                            sFetchingData((e) => ({ ...e, onFetchingClient: false }));
                        }
                    }
            },

            generalTax: () => {
                sGeneralTax(value);

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

    useEffect(() => {
        router.query && sFetchingData((e) => ({ ...e, onFetching: true }));
    }, [router.query]);

    useEffect(() => {
        if (idChange.idBranch !== null) sErrors((prevErrors) => ({ ...prevErrors, errBranch: false }));

        if (idChange.idClient !== null) sErrors((prevErrors) => ({ ...prevErrors, errClient: false }));

        if (idChange.idTreatment !== null) sErrors((prevErrors) => ({ ...prevErrors, errTreatment: false }));
    }, [idChange.idBranch, idChange.idClient, idChange.idTreatment]);

    useEffect(() => {
        idChange.idBranch != null && sFetchingData((e) => ({ ...e, onFetchingWarehouser: true }));
        idChange.idBranch == null && sDataSelect((e) => ({ ...e, dataClient: [] }));
    }, [idChange.idBranch]);

    useEffect(() => {
        fetChingData.onFetchingClient && _ServerFetching_Client();
    }, [fetChingData.onFetchingClient]);

    useEffect(() => {
        fetChingData.onFetchingItemsAll && _ServerFetching_ItemsAll();
    }, [fetChingData.onFetchingItemsAll]);

    useEffect(() => {
        fetChingData.onFetchingWarehouser && _ServerFetching_Warehouse();
    }, [fetChingData.onFetchingWarehouser]);

    const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataSelect.dataTasxes];



    const _DataValueItem = (value) => {
        const newChild = {
            id: uuidv4(),
            idChildBackEnd: "",
            disabledDate:
                (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
            quantityDelivered: value?.e?.quantity_create,
            quantityPay: value?.e?.quantity_returned,
            quantityLeft: value?.e?.quantity_left,
            warehouse: null,
            unit: value?.e?.unit_name,
            price: Number(value?.e?.price),
            quantity: value?.e?.quantity_left,
            discount: generalDiscount ? generalDiscount : Number(value?.e?.discount_percent_item),
            tax: generalTax
                ? generalTax
                : {
                    label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                    value: value?.e?.tax_id_item ? value?.e?.tax_id_item : "0",
                    tax_rate: value?.e?.tax_rate ? value?.e?.tax_rate : "0",
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
        const { newChild } = _DataValueItem(value);

        const newData = listData?.map((e) => {
            if (e?.id == parentId) {
                return {
                    ...e,
                    child: [...e.child, { ...newChild, quantity: 0, note: "" }],
                };
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
            isShow("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
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
                switch (type) {
                    case "quantity":
                        sErrors((e) => ({ ...e, errSurvive: false }));

                        ce.quantity = Number(value?.value);

                        validateQuantity(parentId, childId, type);

                        break;
                    case "increase":
                        sErrors((e) => ({ ...e, errSurvive: false }));

                        ce.quantity = Number(ce?.quantity) + 1;

                        validateQuantity(parentId, childId, type);

                        break;

                    case "decrease":
                        sErrors((e) => ({ ...e, errSurvive: false }));

                        ce.quantity = Number(ce?.quantity) - 1;

                        break;

                    case "price":
                        sErrors((e) => ({ ...e, errSurvivePrice: false }));

                        ce.price = Number(value?.value);

                        break;

                    case "discount":
                        ce.discount = Number(value?.value);
                        break;

                    case "note":
                        ce.note = value?.target.value;
                        break;

                    case "warehouse":
                        ce.warehouse = value;
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
    /// Hàm kiểm tra số lượng
    const validateQuantity = (parentId, childId, type) => {
        const e = listData.find((item) => item?.id == parentId);
        if (!e) return;
        const ce = e.child.find((child) => child?.id == childId);
        if (!ce) return;

        const checkMsg = (mssg) => {
            isShow("error", `${mssg}`);
            ce.quantity = "";
            HandTimeout();
        };
        const checkChild = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0);
        if (type == "increase" && ce?.quantity > +ce?.quantityLeft) {
            checkMsg(`Số lượng vượt quá ${formatNumber(+ce?.quantityLeft)} số lượng còn lại`);
        } else if (checkChild > +ce?.quantityLeft) {
            checkMsg(`Tổng số lượng vượt quá ${formatNumber(+ce?.quantityLeft)} số lượng còn lại`);
        }
    };

    const HandTimeout = () => {
        setTimeout(() => {
            sErrors((e) => ({ ...e, errQuantity: true }));
            sFetchingData((e) => ({ ...e, load: true }));
        }, 500);
        setTimeout(() => {
            sFetchingData((e) => ({ ...e, load: false }));
        }, 1300);
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

    const selectItemsLabel = (option) => {
        return (
            <div className="py-2">
                <div className="flex items-center gap-1">
                    <div className="w-[40px] h-[50px]">
                        {option.e?.images != null ? (
                            <img
                                src={option.e?.images}
                                alt="Product Image"
                                className="max-w-[40px] h-[50px] text-[8px] object-cover rounded"
                            />
                        ) : (
                            <div className=" w-[40px] h-[50px] object-cover  flex items-center justify-center rounded">
                                <img
                                    src="/no_img.png"
                                    alt="Product Image"
                                    className="w-[30px] h-[30px] object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {option.e?.name}
                        </h3>
                        <div className="flex gap-2">
                            <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                {option.e?.code}
                            </h5>
                            <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                {option.e?.product_variation}
                            </h5>
                        </div>
                        <div className="flex items-center gap-1">
                            <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                {option.e?.import_code} -{" "}
                            </h5>
                            <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                {dataLang[option.e?.text_type]}
                            </h5>
                        </div>

                        <div className="flex items-center gap-2 italic">
                            {dataProductSerial.is_enable === "1" && (
                                <div className="text-[11px] text-[#667085] font-[500]">
                                    Serial: {option.e?.serial ? option.e?.serial : "-"}
                                </div>
                            )}
                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                <>
                                    <div className="text-[11px] text-[#667085] font-[500]">
                                        Lot: {option.e?.lot ? option.e?.lot : "-"}
                                    </div>
                                    <div className="text-[11px] text-[#667085] font-[500]">
                                        Date:{" "}
                                        {option.e?.expiration_date ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
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

        const isEmpty = listData?.length == 0;

        if (
            !idChange.idClient ||
            !idChange.idTreatment ||
            !idChange.idBranch ||
            hasNullWarehouse ||
            hasNullQuantity ||
            hasNullPrice ||
            isEmpty
        ) {
            sErrors((e) => ({
                ...e,
                errClient: !idChange.idClient,
                errTreatment: !idChange.idTreatment,
                errBranch: !idChange.idBranch,
                errWarehouse: hasNullWarehouse,
                errQuantity: hasNullQuantity,
                errPrice: hasNullPrice,
            }));
            if (!idChange.idClient || !idChange.idTreatment || !idChange.idBranch) {
                isShow("error", `${dataLang?.required_field_null}`);
            } else if (isEmpty) {
                isShow("error", `Chưa nhập thông tin mặt hàng`);
            } else if (hasNullPrice) {
                isShow("error", `${"Vui lòng nhập đơn giá"}`);
            } else {
                isShow("error", `${dataLang?.required_field_null}`);
            }
        } else {
            sFetchingData((e) => ({ ...e, onSending: true }));
        }
    };
    const _ServerSending = async () => {
        let formData = new FormData();

        formData.append("code", idChange.code ? idChange.code : "");

        formData.append(
            "date",
            formatMoment(idChange.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG)
                ? formatMoment(idChange.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG)
                : ""
        );
        formData.append("branch_id", idChange.idBranch?.value ? idChange.idBranch?.value : "");
        formData.append("client_id", idChange.idClient?.value ? idChange.idClient?.value : "");
        formData.append("handling_solution", idChange.idTreatment?.value ? idChange.idTreatment?.value : "");
        formData.append("note", idChange.note ? idChange.note : "");
        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, id ? item?.idParenBackend : "");
            formData.append(`items[${index}][item]`, item?.matHang?.value);
            item?.child?.forEach((childItem, childIndex) => {
                formData.append(`items[${index}][child][${childIndex}][row_id]`, id ? childItem?.idChildBackEnd : "");
                formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.quantity);
                formData.append(`items[${index}][child][${childIndex}][tax_id]`, childItem?.tax?.value);
                formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price);
                formData.append(
                    `items[${index}][child][${childIndex}][location_warehouses_id]`,
                    childItem?.warehouse?.value
                );
                formData.append(`items[${index}][child][${childIndex}][discount_percent]`, childItem?.discount);
                formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note);
            });
        });
        await Axios(
            "POST",
            `${id
                ? `/api_web/Api_return_order/return_order/${id}?csrf_protection=true`
                : "/api_web/Api_return_order/return_order/?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;

                    if (isSuccess) {
                        isShow("success", `${dataLang[message] || message}` || message);

                        resetAllStates();

                        sListData([]);

                        router.push(routerReturnSales.home);
                    } else {
                        isShow("error", `${dataLang[message] || message}` || message);
                    }
                }

                sFetchingData((e) => ({ ...e, onSending: false }));
            }
        );
    };

    useEffect(() => {
        fetChingData.onSending && _ServerSending();
    }, [fetChingData.onSending]);

    return (
        <React.Fragment>
            <Head>
                <title>
                    {id
                        ? dataLang?.returnSales_edit || "returnSales_edit"
                        : dataLang?.returnSales_add || "returnSales_add"}
                </title>
            </Head>
            <Container className="!h-auto">
                {statusExprired ? (
                    <EmptyExprired />
                ) : (

                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.delivery_receipt_edit_notes || "delivery_receipt_edit_notes"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6> {id ? dataLang?.returnSales_edit || "returnSales_edit"
                            : dataLang?.returnSales_add || "returnSales_add"}</h6>
                    </div>
                )}
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                            {dataLang?.returnSales_titleLits || "returnSales_titleLits"}
                        </h2>
                        <div className="flex justify-end items-center mr-2">
                            <ButtonBack
                                onClick={() => router.push(routerReturnSales.home)}
                                dataLang={dataLang}
                            />
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
                                        value={idChange.code}
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
                                            selected={idChange.date}
                                            onSelect={(date) => sIdChange((e) => ({ ...e, date: date }))}
                                            onChange={(e) => _HandleChangeInput(e, "date")}
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default || "price_quote_system_default"
                                            }
                                            className={`border ${"focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {idChange.date && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => _HandleChangeInput("startDate")}
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
                                        options={dataSelect.dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idChange.idBranch}
                                        isLoading={idChange.idBranch != null ? false : fetChingData.onLoading}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        className={`${errors.errBranch ? "border-red-500" : "border-transparent"
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
                                    {errors.errBranch && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.returnSales_client || "returnSales_client"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataSelect.dataClient}
                                        onChange={_HandleChangeInput.bind(this, "idClient")}
                                        value={idChange.idClient}
                                        isLoading={fetChingData.onLoading}
                                        placeholder={dataLang?.returnSales_client || "returnSales_client"}
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${errors.errClient ? "border-red-500" : "border-transparent"
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
                                    {errors.errClient && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.returnSales_errClient || "returnSales_errClient"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2 ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.returns_treatment_methods || "returns_treatment_methods"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataSelect.dataTreatmentr}
                                        onChange={_HandleChangeInput.bind(this, "treatment")}
                                        isLoading={
                                            idChange.idBranch || idChange.idClient != null
                                                ? false
                                                : fetChingData.onLoading
                                        }
                                        value={idChange.idTreatment}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.returns_treatment_methods || "returns_treatment_methods"}
                                        className={`${errors.errTreatment ? "border-red-500" : "border-transparent"
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
                                    {errors.errTreatment && (
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
                            {fetChingData.onFetchingDetail ? (
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
                                                    {fetChingData.load ? (
                                                        <Loading className="h-2 col-span-11" color="#0f4f9e" />
                                                    ) : (
                                                        e?.child?.map((ce) => (
                                                            <React.Fragment key={ce?.id?.toString()}>
                                                                <div className="p-1 border-t border-l  flex flex-col col-span-2 justify-center h-full">
                                                                    <Select
                                                                        options={dataSelect.dataWarehouse}
                                                                        value={ce?.warehouse}
                                                                        isLoading={
                                                                            ce?.warehouse == null
                                                                                ? fetChingData.onLoadingChild
                                                                                : false
                                                                        }
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "warehouse"
                                                                        )}
                                                                        className={`${(errors.errWarehouse &&
                                                                            ce?.warehouse == null) ||
                                                                            (errors.errWarehouse &&
                                                                                (ce?.warehouse?.label == null ||
                                                                                    ce?.warehouse?.warehouse_name ==
                                                                                    null))
                                                                            ? "border-red-500 border"
                                                                            : ""
                                                                            }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                                                        placeholder={
                                                                            fetChingData.onLoadingChild
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
                                                                        <InPutNumericFormat
                                                                            onValueChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "quantity"
                                                                            )}
                                                                            value={ce?.quantity || null}
                                                                            className={`${errors.errQuantity &&
                                                                                (ce?.quantity == null ||
                                                                                    ce?.quantity == "" ||
                                                                                    ce?.quantity == 0)
                                                                                ? "border-b border-red-500"
                                                                                : errors.errSurvive
                                                                                    ? "border-b border-red-500"
                                                                                    : "border-b border-gray-200"
                                                                                }
                                                                                ${ce?.quantity == 0 && 'border-red-500' || ce?.quantity == "" && 'border-red-500'} 
                                                                                appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                                            isAllowed={({ floatValue }) => {
                                                                                if (floatValue == 0) {
                                                                                    return true;
                                                                                }
                                                                                if (+floatValue > +ce?.quantityLeft) {
                                                                                    isShow(
                                                                                        "error",
                                                                                        `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                                                            +ce?.quantityLeft
                                                                                        )} số lượng còn lại`
                                                                                    );
                                                                                    return false
                                                                                }
                                                                                else {
                                                                                    return true;
                                                                                }
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
                                                                                    Sl đã giao:{" "}
                                                                                    {formatNumber(
                                                                                        +ce?.quantityDelivered
                                                                                    )}
                                                                                </span>
                                                                                <span className="font-medium text-xs">
                                                                                    Sl đã trả:{" "}
                                                                                    {formatNumber(ce?.quantityPay)}
                                                                                </span>
                                                                                <span className="font-medium text-xs">
                                                                                    Sl còn lại:{" "}
                                                                                    {formatNumber(ce?.quantityLeft)}
                                                                                </span>
                                                                            </div>
                                                                        </Popup>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                    <InPutMoneyFormat
                                                                        className={`${errors.errPrice &&
                                                                            (ce?.price == null ||
                                                                                ce?.price == "" ||
                                                                                ce?.price == 0)
                                                                            ? "border-b border-red-500"
                                                                            : errors.errSurvivePrice &&
                                                                                (ce?.price == null ||
                                                                                    ce?.price == "" ||
                                                                                    ce?.price == 0)
                                                                                ? "border-b border-red-500"
                                                                                : "border-b border-gray-200"
                                                                            }
                                                                            ${ce?.price == 0 && 'border-red-500' || ce?.price == "" && 'border-red-500'} 
                                                                            appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "price"
                                                                        )}
                                                                        value={ce?.price}
                                                                        isAllowed={isAllowedNumber}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                    <InPutNumericFormat
                                                                        className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b border-gray-200"
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "discount"
                                                                        )}
                                                                        value={ce?.discount}
                                                                        isAllowed={isAllowedDiscount}
                                                                    />
                                                                </div>

                                                                <div className="col-span-1 text-right flex items-center justify-end  h-full p-0.5">
                                                                    <h3 className="px-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                        {formatMoney(
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
                                                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                    {formatMoney(
                                                                        ce?.price *
                                                                        (1 - Number(ce?.discount) / 100) *
                                                                        (1 + Number(ce?.tax?.tax_rate) / 100) *
                                                                        Number(ce?.quantity)
                                                                    )}
                                                                </div>
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
                                <InPutNumericFormat
                                    isAllowed={isAllowedDiscount}
                                    value={generalDiscount}
                                    onValueChange={_HandleChangeInput.bind(this, "generalDiscount")}
                                    className=" text-center py-1 px-2 bg-transparent font-medium w-20 focus:outline-none border-b-2 border-gray-300"

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
                                className={`border-transparent placeholder:text-slate-300 w-[70%] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
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
                            value={idChange.note}
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
                                    {formatMoney(
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
                                    {formatMoney(
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
                                    {formatMoney(
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
                                    {formatMoney(
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
                                    {formatMoney(
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
                            <ButtonBack
                                onClick={() => router.push(routerReturnSales.home)}
                                dataLang={dataLang}
                            />
                            <ButtonSubmit
                                onClick={_HandleSubmit.bind(this)}
                                dataLang={dataLang}
                                loading={initsFetching.onSending}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                nameModel={'change_item'}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={handleCancleStatus}
            />
        </React.Fragment>
    );
};

export default Index;
