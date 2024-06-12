import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { MdClear } from "react-icons/md";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";

import Swal from "sweetalert2";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";
import Select, { components } from "react-select";
import { NumericFormat } from "react-number-format";
import { Add, Trash as IconDelete, Image as IconImage, Minus } from "iconsax-react";

import { _ServerInstance as Axios } from "/services/axios";

import Loading from "@/components/UI/loading";
import { routerImport } from "routers/buyImportGoods";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";

import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { debounce } from "lodash";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import useSetingServer from "@/hooks/useConfigNumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import { ERROR_DISCOUNT_MAX } from "@/constants/errorStatus/errorStatus";
import useFeature from "@/hooks/useConfigFeature";
import { isAllowedDiscount, isAllowedNumber } from "@/utils/helpers/common";
import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";

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

    const dataSeting = useSetingServer()

    const dataLang = props?.dataLang;

    const isShow = useToast();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [onFetching, sOnFetching] = useState(false);

    const statusExprired = useStatusExprired();

    const [onFetchingDetail, sOnFetchingDetail] = useState(false);

    const [onFetchingCondition, sOnFetchingCondition] = useState(false);

    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);

    const [onFetchingTheOrder, sOnFetchingTheOrder] = useState(false);

    const [onFetchingSupplier, sOnFetchingSupplier] = useState(false);

    const [onFetchingWarehouser, sOnFetchingWarehouse] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [thuetong, sThuetong] = useState();

    const [chietkhautong, sChietkhautong] = useState(0);

    const [code, sCode] = useState("");

    const [startDate, sStartDate] = useState(new Date());

    const [effectiveDate, sEffectiveDate] = useState(null);

    const [note, sNote] = useState("");

    const [date, sDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));

    const [dataSupplier, sDataSupplier] = useState([]);

    const [dataThe_order, sDataThe_order] = useState([]);

    const [dataBranch, sDataBranch] = useState([]);

    const [dataItems, sDataItems] = useState([]);

    const [warehouse, sDataWarehouse] = useState([]);

    const [dataTasxes, sDataTasxes] = useState([]);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()
    //new
    const [listData, sListData] = useState([]);

    const [idSupplier, sIdSupplier] = useState(null);

    const [idTheOrder, sIdTheOrder] = useState(null);

    const [idBranch, sIdBranch] = useState(null);

    const [errSupplier, sErrSupplier] = useState(false);

    const [errDate, sErrDate] = useState(false);

    const [errDateList, sErrDateList] = useState(false);

    const [errTheOrder, sErrTheOrder] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [errWarehouse, sErrWarehouse] = useState(false);

    const [errLot, sErrLot] = useState(false);
    const [errSerial, sErrSerial] = useState(false);

    const [mathangAll, sMathangAll] = useState([]);

    const [khotong, sKhotong] = useState(null);

    useEffect(() => {
        router.query && sErrDate(false);
        router.query && sErrSupplier(false);
        router.query && sErrTheOrder(false);
        router.query && sErrBranch(false);
        router.query && sErrSerial(false);
        router.query && sErrLot(false);
        router.query && sErrDateList(false);
        router.query && sStartDate(new Date());
        router.query && sNote("");
    }, [router.query]);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                sDataBranch(result?.map((e) => ({ label: e.name, value: e.id })));
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
            }
        });

        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        id && sOnFetchingCondition(true);
    }, []);

    const _ServerFetchingDetailPage = () => {
        Axios("GET", `/api_web/Api_import/getImport/${id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let rResult = response.data;
                sListData(
                    rResult?.items.map((e) => ({
                        id: e?.item?.id,
                        matHang: {
                            e: e?.item,
                            label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name
                                }</span>`,
                            value: e.item?.id,
                        },
                        child: e?.child.map((ce) => ({
                            id: Number(ce?.id),
                            disabledDate:
                                (e.item?.text_type == "material" && dataMaterialExpiry?.is_enable == "1" && false) ||
                                (e.item?.text_type == "material" && dataMaterialExpiry?.is_enable == "0" && true) ||
                                (e.item?.text_type == "products" && dataProductExpiry?.is_enable == "1" && false) ||
                                (e.item?.text_type == "products" && dataProductExpiry?.is_enable == "0" && true),
                            kho: {
                                label: ce?.location_name,
                                value: ce?.location_warehouses_id,
                                warehouse_name: ce?.warehouse_name,
                            },
                            serial: ce?.serial == null ? "" : ce?.serial,
                            lot: ce?.lot == null ? "" : ce?.lot,
                            date: ce?.expiration_date != null ? moment(ce?.expiration_date).toDate() : null,
                            donViTinh: e?.item?.unit_name,
                            amount: Number(ce?.quantity),
                            price: Number(ce?.price),
                            chietKhau: Number(ce?.discount_percent),
                            tax: {
                                tax_rate: ce?.tax_rate,
                                value: ce?.tax_id,
                                label: ce?.tax_name,
                            },
                            note: ce?.note,
                        })),
                    }))
                );
                sCode(rResult?.code);
                sIdBranch({
                    label: rResult?.branch_name,
                    value: rResult?.branch_id,
                });
                sIdSupplier({
                    label: rResult?.supplier_name,
                    value: rResult?.supplier_id,
                });
                sIdTheOrder({
                    label: rResult?.purchase_order_code,
                    value: rResult?.purchase_order_id,
                });
                // sDate(moment(rResult?.date).format('YYYY-MM-DD HH:mm:ss'))
                sStartDate(moment(rResult?.date).toDate());
                sNote(rResult?.note);
            }
            sOnFetchingDetail(false);
        });
    };
    useEffect(() => {
        // onFetchingDetail && _ServerFetchingDetail()
        //new
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

    const _ServerFetching_TheOrder = () => {
        Axios(
            "GET",
            "/api_web/Api_purchase_order/purchase_order_not_stock_combobox/?csrf_protection=true",
            {
                params: {
                    "filter[supplier_id]": idSupplier ? idSupplier?.value : null,
                    import_id: id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sDataThe_order(
                        db?.map((e) => ({ label: e?.code, value: e?.id })) || {
                            label: db?.code,
                            value: db?.id,
                        }
                    );
                }
            }
        );
        sOnFetchingTheOrder(false);
    };

    useEffect(() => {
        (idSupplier === null && sDataThe_order([])) || sIdTheOrder(null);
    }, []);

    const _ServerFetching_Supplier = () => {
        Axios(
            "GET",
            "/api_web/api_supplier/supplier/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataSupplier(rResult?.map((e) => ({ label: e.name, value: e.id })));
                }
            }
        );
        sOnFetchingSupplier(false);
    };

    useEffect(() => {
        (idBranch === null && sDataSupplier([])) || sIdSupplier(null);
    }, []);

    const resetValue = () => {
        if (isKeyState?.type === "supplier") {
            sDataItems([]);
            sDataWarehouse([]);
            sListData([]);
            sIdSupplier(isKeyState?.value);
            sIdTheOrder(null);
        }
        if (isKeyState?.type === "theorder") {
            sDataItems([]);
            sDataWarehouse([]);
            sListData([]);
            sIdTheOrder(isKeyState?.value);
        }
        if (isKeyState?.type === "branch") {
            sDataItems([]);
            sDataWarehouse([]);
            sListData([]);
            sIdBranch(isKeyState.value);
        }
        handleQueryId({ status: false });
    };

    useEffect(() => {
        sIdTheOrder(null);
        sIdSupplier(null);
        sKhotong(null);
    }, [idBranch])

    const _HandleChangeInput = (type, value) => {
        if (type == "code") {
            sCode(value.target.value);
        } else if (type === "date") {
            sDate(moment(value.target.value).format("YYYY-MM-DD HH:mm:ss"));
        } else if (type === "supplier" && idSupplier != value) {
            if (listData?.length > 0) {
                if (type === "supplier" && idSupplier != value) {
                    handleQueryId({ status: true, initialKey: { type, value } });
                }
            } else {
                sIdTheOrder(null);
                sIdSupplier(null);
                sKhotong(null);
                if (value == null) {
                    sDataSupplier([]);
                    sDataThe_order([]);
                }
            }
            if (listData.length === 0) {
                sIdSupplier(value);
                sMathangAll([]);
                sDataItems([]);
                sIdTheOrder(null);
                if (value == null) {
                    sDataThe_order([]);
                }
            }
        } else if (type === "theorder") {
            if (listData?.length > 0) {
                if (type === "theorder" && idTheOrder != value) {
                    handleQueryId({ status: true, initialKey: { type, value } });
                }
            }
            if (listData.length == 0) {
                sIdTheOrder(value);
                if (value == null) {
                    sDataItems([]);
                }
            }
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type == "branch" && idBranch != value) {
            if (listData?.length > 0) {
                if (type === "branch" && idBranch != value) {
                    handleQueryId({ status: true, initialKey: { type, value } });
                }
            } else {
                sIdBranch(value);
                sIdTheOrder(null);
                sIdSupplier(null);
                sKhotong(null);
                if (value == null) {
                    sDataSupplier([]);
                    sDataThe_order([]);
                }
            }
        } else if (type == "mathangAll") {
            sMathangAll(value);
            if (value?.length === 0) {
                //new
                sListData([]);
            } else if (value?.length > 0) {
                const newData = value?.map((e, index) => ({
                    id: uuidv4(),
                    time: index,
                    matHang: e,
                    child: [
                        {
                            kho: null,
                            disabledDate:
                                (e?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                                (e?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                                (e?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                                (e?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                            serial: "",
                            lot: "",
                            date: null,
                            donViTinh: e?.e?.unit_name,
                            amount: Number(e?.e?.quantity_left) || 1,
                            price: e?.e?.price,
                            chietKhau: chietkhautong ? chietkhautong : e?.e?.discount_percent,
                            priceAfter: Number(e?.e?.price_after_discount),
                            tax: thuetong
                                ? thuetong
                                : {
                                    label: e?.e?.tax_name,
                                    value: e?.e?.tax_id,
                                    tax_rate: e?.e?.tax_rate,
                                },
                            thanhTien: Number(e?.e?.amount),
                            note: e?.e?.note,
                        },
                    ],
                }));
                sListData(newData?.sort((a, b) => b.time - a.time));
            }
        } else if (type === "khotong") {
            sKhotong(value);
            if (listData?.length > 0) {
                const newData = listData.map((e) => {
                    const newChild = e?.child.map((ce) => {
                        return { ...ce, kho: value };
                    });
                    return { ...e, child: newChild };
                });
                sListData(newData);
            }
        } else if (type == "thuetong") {
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
        } else if (type == "chietkhautong") {
            sChietkhautong(value?.value);
            if (listData?.length > 0) {
                const newData = listData.map((e) => {
                    const newChild = e?.child.map((ce) => {
                        return { ...ce, chietKhau: value?.value };
                    });
                    return { ...e, child: newChild };
                });
                sListData(newData);
            }
        }
    };

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullKho = listData.some((item) =>
            item.child?.some(
                (childItem) =>
                    childItem.kho === null ||
                    (id && (childItem.kho?.label === null || childItem.kho?.warehouse_name === null))
            )
        );
        const hasNullSerial = listData.some(
            (item) =>
                item?.matHang.e?.text_type === "products" &&
                item.child?.some((childItem) => childItem.serial === "" || childItem.serial == null)
        );
        // const hasNullLot = listData.some(item => item?.matHang.e?.text_type === "material" && item.child?.some(childItem => (childItem.lot === '')));
        const hasNullLot = listData.some((item) =>
            item.child?.some((childItem) => !childItem.disabledDate && (childItem.lot === "" || childItem.lot == null))
        );
        const hasNullDate = listData.some((item) =>
            item.child?.some((childItem) => !childItem.disabledDate && childItem.date === null)
        );

        const checkNumber = listData.some((item) =>
            item.child?.some((childItem) => childItem.price == "" || childItem.price == 0 || childItem.amount == "" || childItem.amount == 0)
        );

        // if(date == null || idSupplier == null  || idBranch == null || idTheOrder == null || hasNullKho || ( dataProductSerial?.is_enable == "1"  && hasNullSerial) || (hasMaterial && dataMaterialExpiry?.is_enable == "1" &&  hasNullLot) || (hasProducts && dataProductExpiry?.is_enable == "1"  && hasNullDate) ){
        if (
            idSupplier == null ||
            idBranch == null ||
            idTheOrder == null ||
            hasNullKho ||
            (dataProductSerial?.is_enable == "1" && hasNullSerial) ||
            ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") && hasNullLot) ||
            ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") && hasNullDate) || checkNumber
        ) {
            // if(date == null || idSupplier == null  || idBranch == null || idTheOrder == null || hasNullKho){
            idSupplier == null && sErrSupplier(true);
            idBranch == null && sErrBranch(true);
            idTheOrder == null && sErrTheOrder(true);
            hasNullKho && sErrWarehouse(true);
            hasNullLot && sErrLot(true);
            hasNullSerial && sErrSerial(true);
            hasNullDate && sErrDateList(true);
            isShow("error", `${dataLang?.required_field_null}`);
        } else {
            sErrWarehouse(false);
            sErrLot(false);
            sErrSerial(false);
            sErrDateList(false);
            sOnSending(true);
        }
    };
    useEffect(() => {
        sErrDate(false);
    }, [date != null]);

    useEffect(() => {
        sErrSupplier(false);
    }, [idSupplier != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [idBranch != null]);

    useEffect(() => {
        sErrTheOrder(false);
    }, [idTheOrder != null]);

    const options = dataItems?.map((e) => ({
        label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
        value: e.id,
        e,
    }));

    const _ServerFetching_ItemsAll = () => {
        Axios(
            "GET",
            "/api_web/Api_purchase_order/searchItemsVariant/?csrf_protection=true",
            {
                params: {
                    "filter[purchase_order_id]": idTheOrder ? idTheOrder?.value : null,
                    import_id: id ? id : "",
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

    const _ServerFetching_Warehouse = () => {
        Axios(
            "GET",
            "/api_web/api_warehouse/Getcomboboxlocation/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idBranch.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var result = response.data.rResult;
                    sDataWarehouse(
                        result?.map((e) => ({
                            label: e?.name,
                            value: e?.id,
                            warehouse_name: e?.warehouse_name,
                        }))
                    );
                }
            }
        );
        sOnFetchingWarehouse(false);
    };
    useEffect(() => {
        onFetchingItemsAll && _ServerFetching_ItemsAll();
    }, [onFetchingItemsAll]);

    useEffect(() => {
        onFetchingWarehouser && _ServerFetching_Warehouse();
    }, [onFetchingWarehouser]);

    useEffect(() => {
        router.query && sOnFetching(true);
    }, [router.query]);

    useEffect(() => {
        idTheOrder != null && sOnFetchingItemsAll(true);
    }, [idTheOrder]);

    useEffect(() => {
        idBranch != null && sOnFetchingWarehouse(true);
    }, [idBranch]);

    useEffect(() => {
        onFetchingTheOrder && _ServerFetching_TheOrder();
    }, [onFetchingTheOrder]);

    useEffect(() => {
        onFetchingSupplier && _ServerFetching_Supplier();
    }, [onFetchingSupplier]);

    useEffect(() => {
        (idBranch == null && sIdTheOrder(null)) ||
            (idBranch == null && sDataThe_order([])) ||
            (idBranch == null && sDataWarehouse([]));
    }, [idBranch]);

    useEffect(() => {
        idBranch != null && sOnFetchingSupplier(true);
    }, [idBranch]);


    useEffect(() => {
        idSupplier != null && sOnFetchingTheOrder(true);
    }, [idSupplier]);

    const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes];

    const allItems = [...options];

    const _HandleSelectAll = () => {
        //new
        sMathangAll(
            allItems?.map((e) => ({
                id: uuidv4(),
                matHang: e,
                child: [
                    {
                        id: uuidv4(),
                        disabledDate:
                            (e?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                            (e?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                            (e?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                            (e?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                        kho: khotong ? khotong : null,
                        serial: "",
                        lot: "",
                        date: null,
                        donViTinh: e?.e?.unit_name,
                        amount: Number(e?.e?.quantity_left) || 1,
                        price: e?.e?.price,
                        chietKhau: chietkhautong ? chietkhautong : e?.e?.discount_percent,
                        priceAfter: Number(e?.e?.price_after_discount),
                        tax: thuetong
                            ? thuetong
                            : {
                                label: e?.e?.tax_name,
                                value: e?.e?.tax_id,
                                tax_rate: e?.e?.tax_rate,
                            },
                        thanhTien: Number(e?.e?.amount),
                        note: e?.e?.note,
                    },
                ],
            }))
        );
        sListData(
            allItems?.map((e) => ({
                id: uuidv4(),
                matHang: e,
                child: [
                    {
                        id: uuidv4(),
                        disabledDate:
                            (e?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                            (e?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                            (e?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                            (e?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                        kho: khotong ? khotong : null,
                        serial: "",
                        lot: "",
                        date: null,
                        donViTinh: e?.e?.unit_name,
                        amount: Number(e?.e?.quantity_left) || 1,
                        price: e?.e?.price,
                        chietKhau: chietkhautong ? chietkhautong : e?.e?.discount_percent,
                        priceAfter: Number(e?.e?.price_after_discount),
                        tax: thuetong
                            ? thuetong
                            : {
                                label: e?.e?.tax_name,
                                value: e?.e?.tax_id,
                                tax_rate: e?.e?.tax_rate,
                            },
                        thanhTien: Number(e?.e?.amount),
                        note: e?.e?.note,
                    },
                ],
            }))
        );
    };

    const _HandleDeleteAll = () => {
        //new
        sListData([]);
    };

    const MenuList = (props) => {
        return (
            <components.MenuList {...props}>
                {allItems?.length > 0 && (
                    <div className="grid grid-cols-2 items-center  cursor-pointer">
                        <div
                            className="hover:bg-slate-200 p-2 col-span-1 text-center "
                            onClick={_HandleSelectAll.bind(this)}
                        >
                            Chọn tất cả
                        </div>
                        <div
                            className="hover:bg-slate-200 p-2 col-span-1 text-center"
                            onClick={_HandleDeleteAll.bind(this)}
                        >
                            Bỏ chọn tất cả
                        </div>
                    </div>
                )}
                {props.children}
            </components.MenuList>
        );
    };

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const tinhTongTien = (option) => {
        const tongTien = option?.reduce((accumulator, item) => {
            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                const product = Number(childItem?.price) * Number(childItem?.amount);
                return childAccumulator + product;
            }, 0);
            return accumulator + childTotal;
        }, 0);

        const tienChietKhau = option?.reduce((accumulator, item) => {
            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                const product =
                    Number(childItem?.price) * (Number(childItem?.chietKhau) / 100) * Number(childItem?.amount);
                return childAccumulator + product;
            }, 0);
            return accumulator + childTotal;
        }, 0);

        const tongTienSauCK = option?.reduce((accumulator, item) => {
            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                const product = Number(childItem?.priceAfter) * Number(childItem?.amount);
                return childAccumulator + product;
            }, 0);
            return accumulator + childTotal;
        }, 0);

        const tienThue = option?.reduce((accumulator, item) => {
            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                const product =
                    Number(childItem?.priceAfter) *
                    (isNaN(childItem?.tax?.tax_rate) ? 0 : Number(childItem?.tax?.tax_rate) / 100) *
                    Number(childItem?.amount);
                return childAccumulator + product;
            }, 0);
            return accumulator + childTotal;
        }, 0);

        const tongThanhTien = option?.reduce((accumulator, item) => {
            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                const product =
                    Number(childItem?.priceAfter) *
                    (1 + Number(childItem?.tax?.tax_rate) / 100) *
                    Number(childItem?.amount);
                return childAccumulator + product;
            }, 0);
            return accumulator + childTotal;
        }, 0);

        return {
            tongTien: tongTien || 0,
            tienChietKhau: tienChietKhau || 0,
            tongTienSauCK: tongTienSauCK || 0,
            tienThue: tienThue || 0,
            tongThanhTien: tongThanhTien || 0,
        };
    };

    const [tongTienState, setTongTienState] = useState({
        tongTien: 0,
        tienChietKhau: 0,
        tongTienSauCK: 0,
        tienThue: 0,
        tongThanhTien: 0,
    });

    useEffect(() => {
        const tongTien = tinhTongTien(listData);
        setTongTienState(tongTien);
    }, [listData]);

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

    const _ServerSending = () => {
        var formData = new FormData();
        formData.append("code", code);
        formData.append("date", moment(startDate).format("YYYY-MM-DD HH:mm:ss"));
        formData.append("branch_id", idBranch.value);
        formData.append("suppliers_id", idSupplier.value);
        formData.append("id_order", idTheOrder.value);
        formData.append("note", note);
        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, item?.id);
            formData.append(`items[${index}][item]`, item?.matHang?.value);
            formData.append(`items[${index}][purchase_order_item_id]`, item?.matHang?.e?.purchase_order_item_id);
            item?.child?.forEach((childItem, childIndex) => {
                formData.append(`items[${index}][child][${childIndex}][id]`, childItem?.id);
                {
                    id &&
                        formData.append(
                            `items[${index}][child][${childIndex}][row_id]`,
                            typeof childItem?.id == "number" ? childItem?.id : 0
                        );
                }
                formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.amount);
                formData.append(
                    `items[${index}][child][${childIndex}][serial]`,
                    childItem?.serial === null ? "" : childItem?.serial
                );
                formData.append(
                    `items[${index}][child][${childIndex}][lot]`,
                    childItem?.lot === null ? "" : childItem?.lot
                );
                formData.append(
                    `items[${index}][child][${childIndex}][expiration_date]`,
                    childItem?.date === null ? "" : moment(childItem?.date).format("YYYY-MM-DD HH:mm:ss")
                );
                formData.append(`items[${index}][child][${childIndex}][unit_name]`, childItem?.donViTinh);
                formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note);
                formData.append(`items[${index}][child][${childIndex}][tax_id]`, childItem?.tax?.value);
                formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price);
                formData.append(`items[${index}][child][${childIndex}][location_warehouses_id]`, childItem?.kho?.value);
                formData.append(`items[${index}][child][${childIndex}][discount_percent]`, childItem?.chietKhau);
            });
        });
        Axios(
            "POST",
            `${id
                ? `/api_web/Api_import/import/${id}?csrf_protection=true`
                : "/api_web/Api_import/import/?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", dataLang[message] || message);

                        sCode("");
                        sStartDate(new Date());
                        sIdSupplier(null);
                        sIdBranch(null);
                        sIdTheOrder(null);
                        sNote("");
                        sErrBranch(false);
                        sErrDate(false);
                        sErrTheOrder(false);
                        sErrSupplier(false);
                        // sOption([{id: Date.now(), mathang: null}])
                        //new
                        sListData([]);
                        router.push(routerImport.home);
                    } else {
                        if (tongTienState.tongTien == 0) {
                            isShow("success", `Chưa nhập thông tin mặt hàng`);
                        } else {
                            isShow("success", dataLang[message] || message);
                        }
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    //new
    const _HandleAddChild = (parentId, value) => {
        const newData = listData?.map((e) => {
            if (e?.id === parentId) {
                const newChild = {
                    id: uuidv4(),
                    disabledDate:
                        (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                        (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                        (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                        (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                    kho: khotong ? khotong : null,
                    serial: "",
                    lot: "",
                    date: null,
                    donViTinh: value?.e?.unit_name,
                    price: value?.e?.price,
                    amount: 1,
                    chietKhau: chietkhautong ? chietkhautong : Number(value?.e?.discount_percent),
                    priceAfter: Number(value?.e?.price_after_discount),
                    tax: thuetong
                        ? thuetong
                        : {
                            label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                            value: value?.e?.tax_id,
                            tax_rate: value?.e?.tax_rate,
                        },
                    thanhTien: Number(value?.e?.amount),
                    note: value?.e?.note,
                };
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
            const newData = {
                id: Date.now(),
                matHang: value,
                child: [
                    {
                        id: uuidv4(),
                        disabledDate:
                            (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                            (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                            (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                            (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                        kho: khotong ? khotong : null,
                        serial: "",
                        lot: "",
                        date: null,
                        donViTinh: value?.e?.unit_name,
                        price: value?.e?.price,
                        amount: Number(value?.e?.quantity_left) || 1,
                        chietKhau: chietkhautong ? chietkhautong : Number(value?.e?.discount_percent),
                        priceAfter: Number(value?.e?.price_after_discount),
                        tax: thuetong
                            ? thuetong
                            : {
                                label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                                value: value?.e?.tax_id,
                                tax_rate: value?.e?.tax_rate,
                            },
                        thanhTien: Number(value?.e?.amount),
                        note: value?.e?.note,
                    },
                ],
            };
            sListData([newData, ...listData]);
        } else {
            Toast.fire({
                title: `${"Mặt hàng đã được chọn"}`,
                icon: "error",
            });
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

    const _HandleChangeChild = (parentId, childId, type, value) => {
        const newData = listData.map((e) => {
            if (e?.id === parentId) {
                const newChild = e?.child?.map((ce) => {
                    if (ce?.id === childId) {
                        if (type === "amount") {
                            return { ...ce, amount: Number(value?.value) };
                        } else if (type === "increase") {
                            return {
                                ...ce,
                                amount: Number(Number(ce?.amount) + 1),
                            };
                        } else if (type === "decrease") {
                            return {
                                ...ce,
                                amount: Number(Number(ce?.amount) - 1),
                            };
                        } else if (type === "price") {
                            return { ...ce, price: Number(value?.value) };
                        } else if (type === "chietKhau") {
                            return { ...ce, chietKhau: Number(value?.value) };
                        } else if (type === "note") {
                            return { ...ce, note: value?.target.value };
                        } else if (type === "kho") {
                            return { ...ce, kho: value };
                        } else if (type === "tax") {
                            return { ...ce, tax: value };
                        }
                        //  else if (type === "serial") {
                        //     return { ...ce, serial: value?.target.value };
                        else if (type === "lot") {
                            return { ...ce, lot: value?.target.value };
                        } else if (type === "serial") {
                            const isValueExists = e.child.some(
                                (otherCe) => otherCe[type] === value?.target.value && otherCe.id !== childId
                            );

                            if (isValueExists) {
                                handleQuantityError(`Giá trị ${type} đã tồn tại`);
                                return ce; // Trả về giá trị ban đầu nếu đã tồn tại
                            } else {
                                const otherElements = listData.filter(
                                    (otherE) =>
                                        otherE.id !== parentId &&
                                        otherE.child.some((otherCe) => otherCe[type] === value?.target.value)
                                );

                                if (otherElements.length > 0) {
                                    handleQuantityError(`Giá trị ${type} đã tồn tại ở các phần tử khác`);
                                    return ce; // Trả về giá trị ban đầu nếu đã tồn tại ở phần tử khác
                                } else {
                                    return {
                                        ...ce,
                                        [type]: value?.target.value,
                                    };
                                }
                            }
                        } else if (type === "date") {
                            return { ...ce, date: value };
                        }
                    } else {
                        return ce;
                    }
                });
                return { ...e, child: newChild };
            } else {
                return e;
            }
        });
        sListData([...newData]);
    };

    const handleQuantityError = (e) => isShow("error", e);

    const _HandleChangeValue = (parentId, value) => {
        const checkData = listData?.some((e) => e?.matHang?.value === value?.value);

        if (!checkData) {
            // const newData = { id: Date.now(), matHang: value, child: [{id: uuidv4(), kho: khotong ? khotong : null, donViTinh: value?.e?.unit_name, price: value?.e?.price, amount: Number(value?.e?.quantity_left) || 1, chietKhau: chietkhautong ? chietkhautong : Number(value?.e?.discount_percent), priceAfter: Number(value?.e?.price_after_discount), tax: thuetong ? thuetong : {label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name, value: value?.e?.tax_id, tax_rate: value?.e?.tax_rate}, thanhTien: Number(value?.e?.amount), note: value?.e?.note}] }
            const newData = listData?.map((e) => {
                if (e?.id === parentId) {
                    return {
                        ...e,
                        matHang: value,
                        child: [
                            {
                                id: uuidv4(),
                                kho: khotong ? khotong : null,
                                disabledDate:
                                    (value?.e?.text_type === "material" &&
                                        dataMaterialExpiry?.is_enable === "1" &&
                                        false) ||
                                    (value?.e?.text_type === "material" &&
                                        dataMaterialExpiry?.is_enable === "0" &&
                                        true) ||
                                    (value?.e?.text_type === "products" &&
                                        dataProductExpiry?.is_enable === "1" &&
                                        false) ||
                                    (value?.e?.text_type === "products" &&
                                        dataProductExpiry?.is_enable === "0" &&
                                        true),
                                serial: "",
                                lot: "",
                                date: null,
                                donViTinh: value?.e?.unit_name,
                                price: value?.e?.price,
                                amount: Number(value?.e?.quantity_left) || 1,
                                chietKhau: chietkhautong ? chietkhautong : Number(value?.e?.discount_percent),
                                priceAfter: Number(value?.e?.price_after_discount),
                                tax: thuetong
                                    ? thuetong
                                    : {
                                        label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                                        value: value?.e?.tax_id,
                                        tax_rate: value?.e?.tax_rate,
                                    },
                                thanhTien: Number(value?.e?.amount),
                                note: value?.e?.note,
                            },
                        ],
                    };
                } else {
                    return e;
                }
            });
            sListData([...newData]);
        } else {
            isShow("error", `${"Mặt hàng đã được chọn"}`);
        }
    };

    const _HandleSeachApi = debounce((inputValue) => {
        Axios(
            "POST",
            `/api_web/Api_purchase_order/purchase_order_not_stock_combobox/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
                params: {
                    "filter[supplier_id]": idSupplier ? idSupplier?.value : null,
                    import_id: id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var { result } = response?.data.data;
                    sDataItems(result);
                }
            }
        );
    }, 500)

    return (
        <React.Fragment>
            <Head>
                <title>{id ? dataLang?.import_from_title_edit : dataLang?.import_from_title_add}</title>
            </Head>
            <Container className="!h-auto">
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.import_title || "import_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{id ? dataLang?.import_from_title_edit : dataLang?.import_from_title_add}</h6>

                    </div>
                )}
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                            {dataLang?.import_title || "import_title"}
                        </h2>
                        <div className="flex justify-end items-center mr-2">
                            <ButtonBack
                                onClick={() => router.push(routerImport.home)}
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
                            <div className="grid grid-cols-10  gap-3 items-center mt-2">
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
                                        {dataLang?.import_day_vouchers || "import_day_vouchers"}{" "}
                                        <span className="text-red-500">*</span>
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
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_branch || "import_branch"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idBranch}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        className={`${errBranch ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        // components={{ MultiValue }}
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
                                        {dataLang?.import_supplier || "import_supplier"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataSupplier}
                                        onChange={_HandleChangeInput.bind(this, "supplier")}
                                        value={idSupplier}
                                        placeholder={dataLang?.import_supplier || "import_supplier"}
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${errSupplier ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        // components={{ MultiValue }}
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
                                    {errSupplier && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errSupplier || "purchase_order_errSupplier"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2 ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_the_orders || "import_the_orders"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        onInputChange={(event) =>{
                                            _HandleSeachApi(event)
                                        }}
                                        options={dataThe_order}
                                        onChange={_HandleChangeInput.bind(this, "theorder")}
                                        value={idTheOrder}
                                        isClearable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_the_orders || "import_the_orders"}
                                        className={`${errTheOrder ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        // components={{ MultiValue }}
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
                                                zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                                    {errTheOrder && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.import_err_theorder || "import_err_theorder"}
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
                    <div className="grid grid-cols-10 items-end gap-3">
                        <div div className="col-span-2   my-auto ">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {dataLang?.import_click_items || "import_click_items"}{" "}
                            </label>
                            <Select
                                options={allItems}
                                closeMenuOnSelect={false}
                                onChange={_HandleChangeInput.bind(this, "mathangAll")}
                                value={mathangAll?.value ? mathangAll?.value : listData?.map((e) => e?.matHang)}
                                isMulti
                                // components={{ Option: CustomOption,MenuList }}
                                components={{ MenuList, MultiValue }}
                                formatOptionLabel={(option) => {
                                    if (option.value === "0") {
                                        return <div className="text-gray-400 font-medium">{option.label}</div>;
                                    } else if (option.value === null) {
                                        return <div className="text-gray-400 font-medium">{option.label}</div>;
                                    } else {
                                        return (
                                            <div className="flex items-center justify-between py-2 z-20">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        {option.e?.images != null ? (
                                                            <img
                                                                src={option.e?.images}
                                                                alt="Product Image"
                                                                style={{
                                                                    width: "40px",
                                                                    height: "50px",
                                                                }}
                                                                className="object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-[50px] h-[60px] object-cover flex items-center justify-center rounded">
                                                                <img
                                                                    src="/no_img.png"
                                                                    alt="Product Image"
                                                                    style={{
                                                                        width: "40px",
                                                                        height: "40px",
                                                                    }}
                                                                    className="object-cover rounded"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                            {option.e?.name}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                {option.e?.code}
                                                            </h5>
                                                            <h5 className="font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                {option.e?.product_variation}
                                                            </h5>
                                                        </div>
                                                        <h5 className="text-gray-400 font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                            {dataLang[option.e?.text_type]}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="text-right opacity-0">{"0"}</div>
                                                    <div className="flex gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <h5 className="text-gray-400 font-normal">
                                                                {dataLang?.purchase_survive || "purchase_survive"}:
                                                            </h5>
                                                            <h5 className="text-[#0F4F9E] font-medium">
                                                                {formatNumber(option.e?.qty_warehouse || 0)}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                }}
                                // components={{ DropdownIndicator }}
                                placeholder={dataLang?.purchase_items || "purchase_items"}
                                hideSelectedOptions={false}
                                className="rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20"
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
                                        // zIndex: 100,
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
                        <div className="col-span-2 ">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {dataLang?.import_click_house || "import_click_house"}{" "}
                            </label>
                            <Select
                                // options={taxOptions}
                                onChange={_HandleChangeInput.bind(this, "khotong")}
                                value={khotong}
                                formatOptionLabel={(option) => (
                                    <div className="z-20">
                                        <h2>
                                            {dataLang?.import_Warehouse || "import_Warehouse"}: {option?.warehouse_name}
                                        </h2>
                                        <h2>
                                            {dataLang?.import_Warehouse_location || "import_Warehouse_ocation"}:{" "}
                                            {option?.label}
                                        </h2>
                                    </div>
                                )}
                                options={warehouse}
                                isClearable
                                placeholder={dataLang?.import_click_house || "import_click_house"}
                                hideSelectedOptions={false}
                                className={` "border-transparent placeholder:text-slate-300 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]   z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
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
                                        // zIndex: 999,
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
                    <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-1">
                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-2 text-center truncate font-[400]">
                            {dataLang?.import_from_items || "import_from_items"}
                        </h4>
                        <div className="col-span-10">
                            <div
                                className={`${dataProductSerial.is_enable == "1"
                                    ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                        ? "grid-cols-13"
                                        : dataMaterialExpiry.is_enable == "1" ? "grid-cols-[repeat(13_minmax(0_1fr))]" : "grid-cols-11"
                                    : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                        ? "grid-cols-12" : dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" : "grid-cols-10"
                                    } grid `}
                            >
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1   text-center  truncate font-[400]">
                                    {dataLang?.import_from_ware_loca || "import_from_ware_loca"}
                                </h4>
                                {dataProductSerial.is_enable === "1" && (
                                    <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                                        {"Serial"}
                                    </h4>
                                )}
                                {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                    <>
                                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                                            {"Lot"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                                            {props.dataLang?.warehouses_detail_date || "warehouses_detail_date"}
                                        </h4>
                                    </>
                                ) : (
                                    ""
                                )}
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
                                    {"Đơn giá SCK"}
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
                                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-none outline-none"
                                placeholder="Mặt hàng"
                                noOptionsMessage={() => "Không có dữ liệu"}
                                menuPortalTarget={document.body}
                                formatOptionLabel={(option) => (
                                    <div className="flex items-center  justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-[40px] h-h-[60px]">
                                                {option.e?.images != null ? (
                                                    <img
                                                        src={option.e?.images}
                                                        alt="Product Image"
                                                        className="max-w-[30px] h-[40px] text-[8px] object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className=" w-[30px] h-[40px] object-cover  flex items-center justify-center rounded">
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
                                                <div className="flex gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                            {dataLang[option.e?.text_type]}
                                                        </h5>
                                                        {"-"}
                                                        <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                            {dataLang?.purchase_survive || "purchase_survive"}:
                                                        </h5>
                                                        <h5 className=" font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                            {formatNumber(option.e?.qty_warehouse ?? 0)}
                                                        </h5>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                )}
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
                                        ...(state.isFocused && {
                                            border: "0 0 0 1px #92BFF7",
                                            boxShadow: "none",
                                        }),
                                    }),
                                    menu: (provided, state) => ({
                                        ...provided,
                                        width: "130%",
                                    }),
                                }}
                            />
                        </div>
                        <div className="col-span-10">
                            <div
                                className={`${dataProductSerial.is_enable == "1"
                                    ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                        ? "grid-cols-13"
                                        : dataMaterialExpiry.is_enable == "1"
                                            ? "grid-cols-[repeat(13_minmax(0_1fr))]"
                                            : "grid-cols-11"
                                    : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                        ? "grid-cols-12"
                                        : dataMaterialExpiry.is_enable == "1"
                                            ? "grid-cols-12"
                                            : "grid-cols-10"
                                    } grid  divide-x border-t border-b border-r border-l`}
                            >
                                <div className="col-span-1">
                                    {" "}
                                    <Select
                                        classNamePrefix="customDropdowDefault"
                                        placeholder="Kho - vị trí kho"
                                        className="3xl:text-[12px] border-none outline-none 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                        isDisabled={true}
                                    />
                                </div>
                                {dataProductSerial.is_enable === "1" ? (
                                    <div className=" col-span-1 flex items-center">
                                        <div className="flex justify-center   p-0.5 flex-col items-center">
                                            <NumericFormat
                                                className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  2xl:px-2 xl:px-1 p-0 font-normal  focus:outline-none "
                                                allowNegative={false}
                                                decimalScale={0}
                                                isNumericString={true}
                                                thousandSeparator=","
                                                disabled
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                    <>
                                        <div className=" col-span-1 flex items-center">
                                            <div className="flex justify-center flex-col items-center">
                                                <NumericFormat
                                                    className="py-2 appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal w-[100%]  focus:outline-none "
                                                    allowNegative={false}
                                                    decimalScale={0}
                                                    isNumericString={true}
                                                    thousandSeparator=","
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className=" col-span-1 flex items-center ">
                                            <div className="custom-date-picker flex flex-row ">
                                                <DatePicker
                                                    // selected={effectiveDate}
                                                    // blur
                                                    // dateFormat="dd/MM/yyyy"
                                                    // onSelect={(date) => sEffectiveDate(date)}
                                                    // placeholder={dataLang?.price_quote_system_default || "price_quote_system_default"}
                                                    disabled
                                                    className={`3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  placeholder:text-slate-300 w-full  rounded text-[#52575E] font-light px-2 py-2 text-center outline-none cursor-pointer  `}
                                                />
                                                {/* {effectiveDate && (
                                  <>
                                    <MdClear className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer" onClick={() => handleClearDate('effectiveDate')} />
                                  </>
                                )}
                                <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" /> */}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                                <div className="col-span-1"></div>
                                <div className="col-span-1 flex items-center justify-center">
                                    {/* 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px] */}
                                    {/* <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center3xl:p-0 2xl:p-0 xl:p-0 p-0  bg-slate-200 rounded-full"><Minus className='2xl:scale-100 xl:scale-100 scale-50' size="16"/></button> */}
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Minus className="2xl:scale-100 xl:scale-100 scale-50" size="16" />
                                    </button>
                                    <div className=" text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal  focus:outline-none border-b w-full border-gray-200">
                                        1
                                    </div>
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Add className="2xl:scale-100 xl:scale-100 scale-50" size="16" />
                                    </button>
                                </div>
                                <div className="col-span-1 justify-center flex items-center">
                                    <div className=" 2xl:w-24 xl:w-[75px] w-[70px] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-2 px-2 font-medium text-black">
                                        1
                                    </div>
                                </div>
                                <div className="col-span-1 justify-center flex items-center">
                                    <div className=" 2xl:w-24 xl:w-[75px] w-[70px] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-1 px-2 font-medium">
                                        0
                                    </div>
                                </div>
                                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black flex items-center justify-end">
                                    0
                                </div>
                                <div className="col-span-1 flex items-center w-full">
                                    <Select
                                        placeholder="% Thuế"
                                        className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] w-full"
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black  flex items-center justify-end">
                                    1.00
                                </div>
                                <input
                                    placeholder="Ghi chú"
                                    disabled
                                    className=" disabled:bg-gray-50 col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                                />
                                <button
                                    title="Xóa"
                                    disabled
                                    className="col-span-1  disabled:opacity-50 transition w-full h-full bg-slate-100  rounded-[5.5px] text-red-500 flex flex-col justify-center items-center"
                                >
                                    <IconDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="min:h-[400px] h-[100%] max:h-[800px]">
                            {onFetchingDetail ? (
                                <Loading className="h-60" color="#0f4f9e" />
                            ) : (
                                <>
                                    {listData?.map((e) => (
                                        <div
                                            key={e?.id?.toString()}
                                            className="grid grid-cols-12 gap-1 my-1 items-start"
                                        >
                                            <div className="col-span-2 border border-r p-0.5 pb-1 h-full">
                                                <div className="relative mr-5 mt-5">
                                                    <Select
                                                        options={options}
                                                        value={e?.matHang}
                                                        className=""
                                                        onChange={_HandleChangeValue.bind(this, e?.id)}
                                                        menuPortalTarget={document.body}
                                                        formatOptionLabel={(option) => (
                                                            <div className="flex items-center  justify-between py-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-[40px] h-h-[60px]">
                                                                        {option.e?.images != null ? (
                                                                            <img
                                                                                src={option.e?.images}
                                                                                alt="Product Image"
                                                                                className="object-cover rounded"
                                                                            />
                                                                        ) : (
                                                                            <div className=" object-cover  flex items-center justify-center rounded w-[40px] h-h-[60px]">
                                                                                <img
                                                                                    src="/no_img.png"
                                                                                    alt="Product Image"
                                                                                    className="object-cover rounded "
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                            {option.e?.name}
                                                                        </h3>
                                                                        <div className="flex gap-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                                    {option.e?.code}
                                                                                </h5>
                                                                                <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                                    {option.e?.product_variation}
                                                                                </h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                                    {dataLang[option.e?.text_type]}
                                                                                </h5>
                                                                                {"-"}
                                                                                <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                    {dataLang?.purchase_survive || "purchase_survive"}:
                                                                                </h5>
                                                                                <h5 className=" font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                    {formatNumber(option.e?.qty_warehouse ?? 0)}
                                                                                </h5>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
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
                                                                width: "130%",
                                                            }),
                                                        }}
                                                    />
                                                    <button
                                                        onClick={_HandleAddChild.bind(this, e?.id, e?.matHang)}
                                                        className="w-10 h-10 rounded bg-slate-100 flex flex-col justify-center items-center absolute -top-4 -right-4"
                                                    >
                                                        <Add />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-10  items-center">
                                                <div
                                                    className={`${dataProductSerial.is_enable == "1"
                                                        ? dataMaterialExpiry.is_enable !=
                                                            dataProductExpiry.is_enable
                                                            ? "grid-cols-13"
                                                            : dataMaterialExpiry.is_enable == "1"
                                                                ? "grid-cols-[repeat(13_minmax(0_1fr))]"
                                                                : "grid-cols-11"
                                                        : dataMaterialExpiry.is_enable !=
                                                            dataProductExpiry.is_enable
                                                            ? "grid-cols-12"
                                                            : dataMaterialExpiry.is_enable == "1"
                                                                ? "grid-cols-12"
                                                                : "grid-cols-10"
                                                        } grid  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b divide-x divide-y border-r`}
                                                >
                                                    {e?.child?.map((ce) => (
                                                        <React.Fragment key={ce?.id?.toString()}>
                                                            <div className="flex justify-center border-t border-l  h-full p-1 flex-col items-center ">
                                                                <Select
                                                                    options={warehouse}
                                                                    value={ce?.kho}
                                                                    onChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "kho"
                                                                    )}
                                                                    className={`${(errWarehouse && ce?.kho == null) ||
                                                                        (errWarehouse &&
                                                                            (ce?.kho?.label == null ||
                                                                                ce?.kho?.warehouse_name == null))
                                                                        ? "border-red-500 border"
                                                                        : ""
                                                                        }  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                                                    placeholder={"Kho - vị trí kho"}
                                                                    menuPortalTarget={document.body}
                                                                    formatOptionLabel={(option) => {
                                                                        return (
                                                                            (option?.warehouse_name ||
                                                                                option?.label) && (
                                                                                <div className="z-[999]">
                                                                                    <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                                                                                        {dataLang?.import_Warehouse ||
                                                                                            "import_Warehouse"}
                                                                                        : {option?.warehouse_name}
                                                                                    </h2>
                                                                                    <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                                                                                        {option?.label}
                                                                                    </h2>
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
                                                                    styles={{
                                                                        menu: (provided, state) => ({
                                                                            ...provided,
                                                                            width: "150%",
                                                                        }),
                                                                    }}
                                                                    classNamePrefix="customDropdow"
                                                                />
                                                            </div>
                                                            {dataProductSerial.is_enable === "1" ? (
                                                                <div className=" col-span-1 ">
                                                                    <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                        <input
                                                                            value={ce?.serial}
                                                                            disabled={
                                                                                e?.matHang?.e?.text_type != "products"
                                                                            }
                                                                            className={`border ${e?.matHang?.e?.text_type != "products"
                                                                                ? "bg-gray-50"
                                                                                : errSerial &&
                                                                                    (ce?.serial == "" ||
                                                                                        ce?.serial == null)
                                                                                    ? "border-red-500"
                                                                                    : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                                                //  && !ce?.disabledDate
                                                                                //   ? ""
                                                                                //   : ce?.disabledDate ? "" : ""
                                                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer`}
                                                                            // className={`border ${errDateList && ce?.date == null && !ce?.disabledDate ?"border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer  `}
                                                                            // className={`${e?.matHang?.e?.text_type === "products" && errSerial && ce?.serial ==="" ? "border-red-500 border" : "border-b w-[100%] border-gray-200" } rounded "appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal   focus:outline-none"`}
                                                                            onChange={_HandleChangeChild.bind(
                                                                                this,
                                                                                e?.id,
                                                                                ce?.id,
                                                                                "serial"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {dataMaterialExpiry.is_enable === "1" ||
                                                                dataProductExpiry.is_enable === "1" ? (
                                                                <>
                                                                    <div className=" col-span-1  ">
                                                                        <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                            {/* <input
                                        value={ce?.lot}
                                        disabled={e?.matHang?.e?.text_type != "material"}
                                        className={`${e?.matHang?.e?.text_type === "material" && errLot && ce?.lot === "" ? "border-red-500 border" : "border-b border-gray-200" } rounded "appearance-none focus:outline-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none"`}
                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "lot")}
                                      /> */}
                                                                            <input
                                                                                value={ce?.lot}
                                                                                disabled={ce?.disabledDate}
                                                                                className={`border ${ce?.disabledDate
                                                                                    ? "bg-gray-50"
                                                                                    : errLot &&
                                                                                        (ce?.lot == "" ||
                                                                                            ce?.lot == null)
                                                                                        ? "border-red-500"
                                                                                        : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                                                    //  && !ce?.disabledDate
                                                                                    //   ? ""
                                                                                    //   : ce?.disabledDate ? "" : ""
                                                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer`}
                                                                                // className={`border ${errDateList && ce?.date == null && !ce?.disabledDate ?"border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer  `}

                                                                                // className={`${errLot && ce?.lot === "" && !ce?.disabledDate ? "border-red-500 border" : "border-b border-gray-200" } rounded w-[100%] "appearance-none focus:outline-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal    focus:outline-none"`}
                                                                                onChange={_HandleChangeChild.bind(
                                                                                    this,
                                                                                    e?.id,
                                                                                    ce?.id,
                                                                                    "lot"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className=" col-span-1  ">
                                                                        <div className="custom-date-picker flex justify-center h-full p-0.5 flex-col items-center w-full">
                                                                            {/* <input type='date'
                                        value={ce?.date}
                                        disabled={ce?.disabledDate}
                                        className={`${errDateList && ce?.date == "" && !ce?.disabledDate ? "border-red-500 border" : "border-b-2 border-gray-200"} w-[100%] rounded "appearance-none  text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-1 xl:px-1 p-0 font-normal   focus:outline-none "`}
                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "date")}
                                      /> */}
                                                                            <div className="col-span-4 relative">
                                                                                <div className="custom-date-picker flex flex-row">
                                                                                    <DatePicker
                                                                                        selected={ce?.date}
                                                                                        blur
                                                                                        disabled={ce?.disabledDate}
                                                                                        placeholderText="DD/MM/YYYY"
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        onSelect={(date) =>
                                                                                            _HandleChangeChild(
                                                                                                e?.id,
                                                                                                ce?.id,
                                                                                                "date",
                                                                                                date
                                                                                            )
                                                                                        }
                                                                                        placeholder={
                                                                                            dataLang?.price_quote_system_default ||
                                                                                            "price_quote_system_default"
                                                                                        }
                                                                                        className={`border ${ce?.disabledDate
                                                                                            ? "bg-gray-50"
                                                                                            : errDateList &&
                                                                                                ce?.date == null
                                                                                                ? "border-red-500"
                                                                                                : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                                                            //  && !ce?.disabledDate
                                                                                            //   ? ""
                                                                                            //   : ce?.disabledDate ? "" : ""
                                                                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer`}
                                                                                    // className={`border ${errDateList && ce?.date == null && !ce?.disabledDate ?"border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer  `}
                                                                                    />
                                                                                    {effectiveDate && (
                                                                                        <>
                                                                                            <MdClear
                                                                                                className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                                                                onClick={() =>
                                                                                                    handleClearDate(
                                                                                                        "effectiveDate"
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </>
                                                                                    )}
                                                                                    <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <div className="text-center  p-0.5 pr-2.5 h-full flex flex-col justify-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                {ce?.donViTinh}
                                                            </div>
                                                            <div className="flex items-center justify-center  h-full p-0.5">
                                                                <button
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
                                                                        "amount"
                                                                    )}
                                                                    value={ce?.amount}
                                                                    isAllowed={isAllowedNumber}
                                                                    className={`${ce?.amount == 0 && 'border-red-500' || ce?.amount == "" && 'border-red-500'} appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal w-full focus:outline-none border-b border-gray-200`}
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
                                                            <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                <InPutMoneyFormat
                                                                    className={`
                                                                    ${ce?.price == 0 && 'border-red-500' || ce?.price == "" && 'border-red-500'} 
                                                                    appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px] focus:outline-none border-b border-gray-200 h-fit`}
                                                                    onValueChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "price"
                                                                    )}
                                                                    value={ce?.price}
                                                                />
                                                            </div>
                                                            <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                <InPutNumericFormat
                                                                    className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b border-gray-200"
                                                                    onValueChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "chietKhau"
                                                                    )}
                                                                    value={ce?.chietKhau}
                                                                    isAllowed={isAllowedDiscount}
                                                                />
                                                            </div>
                                                            {/* <div>{ce?.priceAfter}</div> */}
                                                            <div className="col-span-1  text-right flex items-center justify-end  h-full p-0.5">
                                                                <h3 className="px-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                    {formatMoney(
                                                                        Number(ce?.price) *
                                                                        (1 - Number(ce?.chietKhau) / 100)
                                                                    )}
                                                                </h3>
                                                            </div>
                                                            <div className=" flex flex-col items-center p-0.5 h-full justify-center">
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
                                                                        dataLang?.import_from_tax || "import_from_tax"
                                                                    }
                                                                    className={`  3xl:text-[12px] 2xl:text-[10px] p-1 xl:text-[9.5px] text-[9px] border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
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
                                                                />
                                                            </div>
                                                            {/* <div>{ce?.thanhTien}</div> */}
                                                            <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                {formatMoney(
                                                                    ce?.price *
                                                                    (1 - Number(ce?.chietKhau) / 100) *
                                                                    (1 + Number(ce?.tax?.tax_rate) / 100) *
                                                                    Number(ce?.amount)
                                                                )}
                                                            </div>
                                                            {/* <div>{ce?.note}</div> */}
                                                            <div className="col-span-1  flex items-center justify-center  h-full p-0.5">
                                                                <input
                                                                    value={ce?.note}
                                                                    onChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "note"
                                                                    )}
                                                                    placeholder="Ghi chú"
                                                                    type="text"
                                                                    className="  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 outline-none mb-2"
                                                                />
                                                            </div>
                                                            <div className=" h-full p-0.5 flex flex-col items-center justify-center ">
                                                                <button
                                                                    title="Xóa"
                                                                    onClick={_HandleDeleteChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id
                                                                    )}
                                                                    className=" text-red-500 flex flex-col justify-center items-center"
                                                                >
                                                                    <IconDelete />
                                                                </button>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
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
                                    value={chietkhautong}
                                    isAllowed={isAllowedDiscount}
                                    onValueChange={_HandleChangeInput.bind(this, "chietkhautong")}
                                    className=" text-center py-1 px-2 bg-transparent font-medium w-20 focus:outline-none border-b-2 border-gray-300"

                                />
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 ">
                            <h2>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h2>
                            <Select
                                options={taxOptions}
                                onChange={_HandleChangeInput.bind(this, "thuetong")}
                                value={thuetong}
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
                                noOptionsMessage={() => "Không có dữ liệu"}
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
                            {dataLang?.purchase_order_note || "purchase_order_note"}
                        </div>
                        <textarea
                            value={note}
                            placeholder={dataLang?.purchase_order_note || "purchase_order_note"}
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product = Number(childItem?.price) * Number(childItem?.amount);
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price) *
                                                    (Number(childItem?.chietKhau) / 100) *
                                                    Number(childItem?.amount);
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
                                    {dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {/* {formatNumber(tongTienState.tongTienSauCK)} */}
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.chietKhau / 100)) *
                                                    Number(childItem?.amount);
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.chietKhau / 100)) *
                                                    (isNaN(childItem?.tax?.tax_rate)
                                                        ? 0
                                                        : Number(childItem?.tax?.tax_rate) / 100) *
                                                    Number(childItem?.amount);
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.chietKhau / 100)) *
                                                    (1 + Number(childItem?.tax?.tax_rate) / 100) *
                                                    Number(childItem?.amount);
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
                                onClick={() => router.push(routerImport.home)}
                                dataLang={dataLang}
                            />
                            <ButtonSubmit
                                onClick={_HandleSubmit.bind(this)}
                                dataLang={dataLang}
                                loading={onSending}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={resetValue}
                nameModel={'change_item'}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};
const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    // const label = `+ ${length}`;
    const label = ``;

    return <div title={title}>{label}</div>;
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
