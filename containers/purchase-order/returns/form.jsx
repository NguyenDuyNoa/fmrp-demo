import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { reTryQuery } from "@/configs/configRetryQuery";
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useSupplierList } from "@/containers/suppliers/supplier/hooks/useSupplierList";
import { useBranchList } from "@/hooks/common/useBranch";
import { useTaxList } from "@/hooks/common/useTaxs";
import { useTreatmentList } from "@/hooks/common/useTreatment";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { isAllowedDiscount, isAllowedNumber } from "@/utils/helpers/common";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { PopupParent } from "@/utils/lib/Popup";
import { SelectCore } from "@/utils/lib/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Add, Trash as IconDelete, Minus, TableDocument } from "iconsax-react";
import moment from "moment/moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { NumericFormat } from "react-number-format";
import { routerReturns } from "routers/buyImportGoods";
import { v4 as uuidv4 } from "uuid";
import { useReturnItemsBySupplier } from "./hooks/useReturnItemsBySupplier";
import { useReturnQuantitiStock } from "./hooks/useReturnQuantitiStock";
const PurchaseReturnsForm = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const id = router.query?.id;

    const dataLang = props?.dataLang;

    const dataSeting = useSetingServer()

    const statusExprired = useStatusExprired();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [onSending, sOnSending] = useState(false);

    const [tax, sTax] = useState();

    const [discount, sDiscount] = useState(0);

    const [code, sCode] = useState("");

    const [startDate, sStartDate] = useState(new Date());

    const [note, sNote] = useState("");

    const [date, sDate] = useState(moment().format(FORMAT_MOMENT.DATE_TIME_LONG));

    //new
    const [listData, sListData] = useState([]);

    const [idParen, sIdParent] = useState(null);

    const [qtyHouse, sQtyHouse] = useState(null);

    const [idSupplier, sIdSupplier] = useState(null);

    const [idTreatment, sIdTreatment] = useState(null);

    const [idBranch, sIdBranch] = useState(null);

    const [load, sLoad] = useState(false);

    const [errSupplier, sErrSupplier] = useState(false);

    const [errDate, sErrDate] = useState(false);

    const [errTreatment, sErrTreatment] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [errWarehouse, sErrWarehouse] = useState(false);

    const [errAmount, sErrAmount] = useState(false);

    const [errSurvive, sErrSurvive] = useState(false);

    const [warehouseAll, sWarehouseAll] = useState(null);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature();

    const { data: dataTasxes = [] } = useTaxList();

    const { data: listBranch = [] } = useBranchList();

    const { data: dataDepartment = [] } = useTreatmentList(dataLang)

    const params = { "filter[supplier_id]": idSupplier ? idSupplier?.value : null, "filter[branch_id]": idBranch ? idBranch?.value : null }

    const { data: dataItems = [] } = useReturnItemsBySupplier(idSupplier, params)

    const { data: listSupplier } = useSupplierList({ "filter[branch_id]": idBranch != null ? idBranch.value : null, });

    const dataSupplier = idBranch ? listSupplier?.rResult?.map((e) => ({ label: e?.name, value: e?.id, e })) : []

    const { data: dataWarehouse = [] } = useReturnQuantitiStock(idParen, idBranch);

    useEffect(() => {
        router.query && sErrDate(false);
        router.query && sErrSupplier(false);
        router.query && sErrTreatment(false);
        router.query && sErrBranch(false);
        router.query && sStartDate(new Date());
        router.query && sNote("");
        router.query && sIdSupplier(null);
    }, [router.query]);

    const { isFetching } = useQuery({
        queryKey: ["api_detailpage", id],
        queryFn: async () => {
            const rResult = await apiReturns.apiDetailPageReturns(id);
            sListData(rResult?.items.map((e) => ({
                id: e?.item?.id,
                item: {
                    e: e?.item,
                    label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name}</span>`,
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
                        qty: ce?.quantity_warehouse,
                    },
                    serial: ce?.serial == null ? "" : ce?.serial,
                    quantityLeft: Number(e?.item?.quantity_left),
                    quantityReturned: Number(e?.item?.quantity_returned),
                    quantityCreate: Number(e?.item?.quantity_create),
                    lot: ce?.lot == null ? "" : ce?.lot,
                    date: ce?.expiration_date != null ? moment(ce?.expiration_date).toDate() : null,
                    unit: e?.item?.unit_name,
                    amount: Number(ce?.quantity),
                    price: Number(ce?.price),
                    discount: Number(ce?.discount_percent),
                    tax: {
                        tax_rate: ce?.tax_rate,
                        value: ce?.tax_id,
                        label: ce?.tax_name,
                    },
                    note: ce?.note,
                })),
            })));

            const checkQty = rResult?.items?.map((e) => e?.item).reduce((obj, e) => {
                obj.id = e?.id;
                obj.qty = Number(e?.quantity_left);
                return obj;
            }, {});

            sIdParent(checkQty?.id);
            sQtyHouse(checkQty?.qty);
            sCode(rResult?.code);
            sIdBranch({
                label: rResult?.branch_name,
                value: rResult?.branch_id,
            });
            sIdSupplier({
                label: rResult?.supplier_name,
                value: rResult?.supplier_id,
            });
            sIdTreatment({
                label: dataLang[rResult?.treatment_methods_name],
                value: rResult?.treatment_methods,
            });
            sStartDate(moment(rResult?.date).toDate());
            sNote(rResult?.note);
            return rResult
        },
        enabled: !!id,
        ...reTryQuery
    })

    const resetValue = () => {
        if (isKeyState?.type === "supplier") {
            sListData([]);
            sIdSupplier(isKeyState?.value);
        }
        if (isKeyState?.type === "branch") {
            sListData([]);
            sIdSupplier(null);
            sIdBranch(isKeyState?.value);
        }
        handleQueryId({ status: false });
    };

    const _HandleChangeInput = (type, value) => {
        if (type == "code") {
            sCode(value.target.value);
        } else if (type === "date") {
            sDate(formatMoment(value.target.value, FORMAT_MOMENT.DATE_TIME_LONG));
        } else if (type === "supplier" && idSupplier != value) {
            if (listData?.length > 0) {
                if (type === "supplier" && idSupplier != value) {
                    handleQueryId({ status: true, initialKey: { type, value } });
                }
            } else {
                sIdSupplier(null);
            }
            if (listData.length === 0) {
                sIdSupplier(value);
            }
        } else if (type === "treatment") {
            sIdTreatment(value);
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type == "branch" && idBranch != value) {
            if (listData?.length > 0) {
                if (type === "branch" && idBranch != value) {
                    handleQueryId({ status: true, initialKey: { type, value } });
                }
            } else {
                sIdBranch(value);
                sIdSupplier(null);
                sWarehouseAll(null);
            }
        } else if (type == "tax") {
            sTax(value);
            if (listData?.length > 0) {
                const newData = listData.map((e) => {
                    const newChild = e?.child.map((ce) => {
                        return { ...ce, tax: value };
                    });
                    return { ...e, child: newChild };
                });
                sListData(newData);
            }
        } else if (type == "discount") {
            sDiscount(value?.value);
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

        }
        if (type === "startDate") {
            sStartDate(new Date());
        }
    };
    const handleTimeChange = (date) => {
        sStartDate(date);
    };

    const _HandleSubmit = (e) => {
        e.preventDefault();

        const hasNullKho = listData.some((item) => item.child?.some((childItem) => childItem.kho === null || (id && (childItem.kho?.label === null || childItem.kho?.warehouse_name === null))));

        const hasNullAmount = listData.some((item) => item.child?.some((childItem) => childItem.amount === null || childItem.amount === "" || childItem.amount == 0));

        const isTotalExceeded = listData?.some((e) => !hasNullKho && e.child?.some((opt) => {
            const amount = parseFloat(opt?.amount) || 0;
            const qty = parseFloat(opt?.kho?.qty) || 0;
            return amount > qty;
        }));

        const isEmpty = listData?.length === 0 ? true : false;
        if (idSupplier == null || idBranch == null || idTreatment == null || hasNullKho || hasNullAmount || isTotalExceeded || isEmpty) {
            idSupplier == null && sErrSupplier(true);
            idBranch == null && sErrBranch(true);
            idTreatment == null && sErrTreatment(true);
            hasNullKho && sErrWarehouse(true);
            hasNullAmount && sErrAmount(true);
            if (isEmpty) {
                isShow("error", `Chưa nhập thông tin mặt hàng`);
            } else if (isTotalExceeded) {
                sErrSurvive(true);
                isShow("error", `${dataLang?.returns_err_QtyNotQexceed || "returns_err_QtyNotQexceed"}`);
            } else {
                isShow("error", `${dataLang?.required_field_null}`);
            }
        } else {
            sErrSurvive(false);
            sErrWarehouse(false);
            sErrAmount(false);
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
        sErrTreatment(false);
    }, [idTreatment != null]);

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    }

    const handingReturn = useMutation({
        mutationFn: (data) => {
            return apiReturns.apiHandingReturn(id, data)
        }
    })

    const _ServerSending = () => {
        let formData = new FormData();
        formData.append("code", code);
        formData.append("date", formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG));
        formData.append("branch_id", idBranch?.value);
        formData.append("supplier_id", idSupplier?.value);
        formData.append("treatment_methods", idTreatment?.value);
        formData.append("note", note);
        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, item?.id);
            formData.append(`items[${index}][item]`, item?.item?.value);
            // formData.append(`items[${index}][purchase_order_item_id]`, item?.item?.e?.purchase_order_item_id);
            item?.child?.forEach((childItem, childIndex) => {
                formData.append(`items[${index}][child][${childIndex}][id]`, childItem?.id);
                { id && formData.append(`items[${index}][child][${childIndex}][row_id]`, typeof childItem?.id == "number" ? childItem?.id : 0); }
                formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.amount);
                // formData.append(`items[${index}][child][${childIndex}][serial]`, childItem?.serial === null ? "" : childItem?.serial);
                // formData.append(`items[${index}][child][${childIndex}][lot]`, childItem?.lot === null ? "" : childItem?.lot);
                // formData.append(`items[${index}][child][${childIndex}][expiration_date]`, childItem?.date === null ? "" : moment(childItem?.date).format("YYYY-MM-DD HH:mm:ss"));
                formData.append(`items[${index}][child][${childIndex}][unit_name]`, childItem?.unit);
                formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note);
                formData.append(`items[${index}][child][${childIndex}][tax_id]`, childItem?.tax?.value);
                formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price);
                formData.append(`items[${index}][child][${childIndex}][location_warehouses_id]`, childItem?.kho?.value);
                formData.append(`items[${index}][child][${childIndex}][discount_percent]`, childItem?.discount);
            });
        });
        handingReturn.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", dataLang[message] || message);
                    sCode("");
                    sStartDate(new Date());
                    sIdSupplier(null);
                    sIdBranch(null);
                    sIdTreatment(null);
                    sNote("");
                    sErrBranch(false);
                    sErrDate(false);
                    sErrTreatment(false);
                    sErrSupplier(false);
                    sListData([]);
                    router.push(routerReturns.home);
                } else {
                    isShow("error", dataLang[message] || message);
                }
            }
        });
        sOnSending(false);
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    //new
    const _HandleAddChild = (parentId, value) => {
        const newData = listData?.map((e) => {
            if (e?.id === parentId) {
                sQtyHouse(value?.e?.quantity_left);
                const newChild = {
                    id: uuidv4(),
                    disabledDate:
                        (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                        (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                        (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                        (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                    quantityLeft: Number(value?.e?.quantity_left),
                    quantityReturned: Number(value?.e?.quantity_returned),
                    quantityCreate: Number(value?.e?.quantity_create),
                    kho: null,
                    unit: value?.e?.unit_name,
                    price: Number(value?.e?.price),
                    // amount: Number(value?.e?.quantity_create) || 1,
                    amount: null,
                    discount: discount ? discount : Number(value?.e?.discount_percent),
                    priceAfter: Number(value?.e?.price_after_discount),
                    tax: tax ? tax : {
                        label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                        value: value?.e?.tax_id,
                        tax_rate: value?.e?.tax_rate,
                    },
                    totalMoney: Number(value?.e?.amount),
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
        const checkData = listData?.some((e) => e?.item?.value === value?.value);
        if (!checkData) {
            sIdParent(value?.value);
            sQtyHouse(value?.e?.quantity_left);
            const newData = {
                id: Date.now(),
                item: value,
                child: [
                    {
                        id: uuidv4(),
                        disabledDate:
                            (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                            (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                            (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                            (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                        kho: null,
                        unit: value?.e?.unit_name,
                        quantityLeft: Number(value?.e?.quantity_left),
                        quantityReturned: Number(value?.e?.quantity_returned),
                        quantityCreate: Number(value?.e?.quantity_create),
                        price: Number(value?.e?.price),
                        amount: Number(value?.e?.quantity_left),
                        discount: discount ? discount : Number(value?.e?.discount_percent),
                        priceAfter: Number(value?.e?.price_after_discount),
                        tax: tax
                            ? tax
                            : {
                                label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                                value: value?.e?.tax_id,
                                tax_rate: value?.e?.tax_rate,
                            },
                        totalMoney: Number(value?.e?.amount),
                        note: value?.e?.note,
                    },
                ],
            };
            sListData([newData, ...listData]);
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
                    const newChild = e.child?.filter((ce) => ce?.kho !== null);
                    return { ...e, child: newChild };
                }
                return e;
            })
            .filter((e) => e.child?.length > 0);
        sListData([...newData]);
    };


    const FunCheckQuantity = (parentId, childId) => {
        const e = listData.find((item) => item?.id == parentId);
        if (!e) return;
        const ce = e.child.find((child) => child?.id == childId);
        if (!ce) return;
        const checkChild = e.child.reduce((sum, opt) => sum + parseFloat(opt?.amount || 0), 0);

        if (checkChild > qtyHouse) {
            isShow("error", `Tổng số lượng chỉ được bé hơn hoặc bằng ${formatNumber(qtyHouse)} số lượng còn lại`);
            ce.amount = "";
            setTimeout(() => {
                sLoad(true);
            }, 500);
            setTimeout(() => {
                sLoad(false);
            }, 1000);
        }
    };

    const _HandleChangeChild = (parentId, childId, type, value) => {
        const newData = listData.map((e) => {
            if (e?.id === parentId) {
                const newChild = e.child?.map((ce) => {
                    var index = e.child.findIndex((x) => x?.id === childId);
                    if (ce?.id === childId) {
                        if (type === "amount") {
                            sErrSurvive(false);
                            ce.amount = Number(value?.value);
                            FunCheckQuantity(parentId, childId);
                            // const totalSoLuong = e.child.reduce((sum, opt) => sum + parseFloat(opt?.amount || 0), 0);
                            // if (totalSoLuong > qtyHouse) {
                            //     e.child.forEach((opt, optIndex) => {
                            //         const currentValue = ce.amount; // Lưu giá trị hiện tại
                            //         ce.amount = "";
                            //         if (optIndex === index) {
                            //             ce.amount = currentValue; // Gán lại giá trị hiện tại
                            //         }
                            //     });
                            //     Toast.fire({
                            //         title: `Tổng số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                            //             qtyHouse
                            //         )} số lượng còn lại`,
                            //         icon: "error",
                            //         confirmButtonColor: "#296dc1",
                            //         cancelButtonColor: "#d33",
                            //         confirmButtonText: dataLang?.aler_yes,
                            //         timer: 3000,
                            //     });
                            //     ce.amount = "" || null;
                            //     setTimeout(() => {
                            //         sLoad(true);
                            //     }, 500);
                            //     setTimeout(() => {
                            //         sLoad(false);
                            //     }, 1000);
                            //     return { ...ce };
                            // } else {
                            //     sLoad(false);
                            //     console.log(" ce.amount", ce.amount);
                            //     return { ...ce };
                            // }
                            return { ...ce };
                        } else if (type === "increase") {
                            sErrSurvive(false);

                            const totalSoLuong = e.child.reduce((sum, opt) => sum + parseFloat(opt?.amount || 0), 0);

                            if (ce?.id === childId && totalSoLuong == qtyHouse) {
                                isShow(
                                    "error",
                                    `Tổng số lượng chỉ được bé hơn hoặc bằng ${formatNumber(qtyHouse)} số lượng còn lại`
                                );

                                return { ...ce };
                            } else if (ce?.id === childId && totalSoLuong == Number(ce?.kho?.qty)) {
                                isShow(
                                    "error",
                                    `Tổng số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                        Number(ce?.kho?.qty)
                                    )} số lượng còn lại`
                                );

                                return { ...ce };
                            } else if (ce?.id === childId && totalSoLuong > Number(ce?.kho?.qty)) {
                                isShow(
                                    "error",
                                    `Tổng số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                        Number(ce?.kho?.qty)
                                    )} số lượng tồn`
                                );

                                return { ...ce };
                            } else if (ce?.id === childId && totalSoLuong > qtyHouse) {
                                isShow(
                                    "error",
                                    `Tổng số lượng chỉ được bé hơn hoặc bằng ${formatNumber(qtyHouse)} số lượng tồn`
                                );

                                return { ...ce };
                            } else {
                                return {
                                    ...ce,
                                    amount: Number(Number(ce?.amount) + 1),
                                };
                            }
                        } else if (type === "decrease") {
                            sErrSurvive(false);
                            return {
                                ...ce,
                                amount: Number(Number(ce?.amount) - 1),
                            };
                        } else if (type === "price") {
                            return { ...ce, price: Number(value?.value) };
                        } else if (type === "discount") {
                            return { ...ce, discount: Number(value?.value) };
                        } else if (type === "note") {
                            return { ...ce, note: value?.target.value };
                        } else if (type === "kho") {
                            const checkKho = e?.child
                                ?.map((house) => house)
                                ?.some((i) => i?.kho?.value === value?.value);
                            sErrSurvive(false);
                            if (checkKho) {
                                isShow("error", `${dataLang?.returns_err_Warehouse || "returns_err_Warehouse"}`);
                                return { ...ce };
                            } else {
                                return { ...ce, kho: value };
                            }
                        } else if (type === "tax") {
                            return { ...ce, tax: value };
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

    const _HandleChangeValue = (parentId, value) => {
        const checkData = listData?.some((e) => e?.item?.value === value?.value);
        if (!checkData) {
            sIdParent(value?.value);
            sQtyHouse(value?.e?.quantity_left);
            const newData = listData?.map((e) => {
                if (e?.id === parentId) {
                    return {
                        ...e,
                        item: value,
                        child: [
                            {
                                id: uuidv4(),
                                kho: warehouseAll ? warehouseAll : null,
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
                                unit: value?.e?.unit_name,
                                price: value?.e?.price,
                                amount: Number(value?.e?.quantity_create),
                                quantityLeft: Number(value?.e?.quantity_left),
                                quantityReturned: Number(value?.e?.quantity_returned),
                                quantityCreate: Number(value?.e?.quantity_create),
                                discount: discount ? discount : Number(value?.e?.discount_percent),
                                priceAfter: Number(value?.e?.price_after_discount),
                                tax: tax
                                    ? tax
                                    : {
                                        label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                                        value: value?.e?.tax_id,
                                        tax_rate: value?.e?.tax_rate,
                                    },
                                totalMoney: Number(value?.e?.amount),
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
            isShow("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
        }
    };

    return (
        <React.Fragment>
            <Head>
                <title>
                    {id
                        ? dataLang?.returns_title_edit || "returns_title_edit"
                        : dataLang?.returns_title_child || "returns_title_child"}
                </title>
            </Head>
            <Container className="!h-auto">
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.returns_title || "returns_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{id
                            ? dataLang?.returns_title_edit || "returns_title_edit"
                            : dataLang?.returns_title_child || "returns_title_child"}</h6>
                    </div>
                )}
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                            {dataLang?.returns_title || "returns_title"}
                        </h2>
                        <div className="flex justify-end items-center mr-2">
                            <ButtonBack
                                onClick={() => router.push(routerReturns.home)}
                                dataLang={dataLang}
                            />
                        </div>
                    </div>

                    <div className=" w-full rounded">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2">
                                {dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}
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
                                        placeholder={dataLang?.purchase_order_system_default || "purchase_order_system_default"}
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
                                            placeholder={dataLang?.price_quote_system_default || "price_quote_system_default"}
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
                                    <SelectCore
                                        options={listBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idBranch}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        className={`${errBranch ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                        {dataLang?.import_supplier || "import_supplier"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectCore
                                        options={dataSupplier}
                                        onChange={_HandleChangeInput.bind(this, "supplier")}
                                        value={idSupplier}
                                        placeholder={dataLang?.import_supplier || "import_supplier"}
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${errSupplier ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                        {dataLang?.returns_treatment_methods || "returns_treatment_methods"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectCore
                                        options={dataDepartment}
                                        onChange={_HandleChangeInput.bind(this, "treatment")}
                                        value={idTreatment}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.returns_treatment_methods || "returns_treatment_methods"}
                                        className={`${errTreatment ? "border-red-500" : "border-transparent"
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
                                    {dataLang?.returns_point || "returns_point"}
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
                            <SelectCore
                                options={dataItems}
                                value={null}
                                onChange={_HandleAddParent.bind(this)}
                                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                placeholder={dataLang?.returns_items || "returns_items"}
                                noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                menuPortalTarget={document.body}
                                formatOptionLabel={(option) => (
                                    <div className="py-2">
                                        <div className="flex items-center ">
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
                                                        {`(ĐGSCK: ${formatMoney(option.e?.price_after_discount)}) -`}</h5>
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
                                                                Date:{" "}{option.e?.expiration_date ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
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
                                    <SelectCore
                                        classNamePrefix="customDropdowDefault"
                                        placeholder={dataLang?.returns_point || "returns_point"}
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
                                    <SelectCore
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
                            {isFetching ? (
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
                                                    <SelectCore
                                                        options={dataItems}
                                                        value={e?.item}
                                                        className=""
                                                        onChange={_HandleChangeValue.bind(this, e?.id)}
                                                        menuPortalTarget={document.body}
                                                        formatOptionLabel={(option) => (
                                                            <div className="py-2">
                                                                <div className="flex items-center ">
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
                                                                                {`(ĐGSCK: ${formatMoney(option.e?.price_after_discount)}) -`}</h5>
                                                                            <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                                {dataLang[option.e?.text_type]}
                                                                            </h5>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 italic">
                                                                            {dataProductSerial.is_enable === "1" && (
                                                                                <div className="text-[11px] text-[#667085] font-[500]">
                                                                                    Serial:{" "}{option.e?.serial ? option.e?.serial : "-"}
                                                                                </div>
                                                                            )}
                                                                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                                                        Lot:{" "}{option.e?.lot ? option.e?.lot : "-"}
                                                                                    </div>
                                                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                                                        Date:{" "}{option.e?.expiration_date ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
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
                                                                width: "150%",
                                                            }),
                                                        }}
                                                    />
                                                    <button
                                                        onClick={_HandleAddChild.bind(this, e?.id, e?.item)}
                                                        className="w-8 h-8 rounded bg-slate-100 flex flex-col justify-center items-center absolute -top-4 right-5 hover:rotate-45 hover:bg-slate-200 transition hover:scale-105 hover:text-red-500 ease-in-out"
                                                    >
                                                        <Add className="" />
                                                    </button>
                                                </div>
                                                {e?.child?.filter((e) => e?.kho == null).length >= 2 && (
                                                    <button
                                                        onClick={_HandleDeleteAllChild.bind(this, e?.id, e?.item)}
                                                        className="w-full rounded mt-1.5 px-5 py-1 overflow-hidden group bg-rose-500 relative hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-rose-400 transition-all ease-out duration-300"
                                                    >
                                                        <span className="absolute right-0 w-full h-full -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                                        <span className="relative text-xs">
                                                            Xóa {e?.child?.filter((e) => e?.kho == null).length} hàng chưa chọn kho
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
                                                                    <SelectCore
                                                                        options={dataWarehouse}
                                                                        value={ce?.kho}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "kho"
                                                                        )}
                                                                        className={`${(errWarehouse && ce?.kho == null) ||
                                                                            (errWarehouse && (ce?.kho?.label == null || ce?.kho?.warehouse_name == null))
                                                                            ? "border-red-500 border"
                                                                            : ""
                                                                            }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                                                        placeholder={dataLang?.returns_point || "returns_point"}
                                                                        menuPortalTarget={document.body}
                                                                        formatOptionLabel={(option) => {
                                                                            return (
                                                                                (option?.warehouse_name || option?.label || option?.qty) && (
                                                                                    <div className="">
                                                                                        <div className="flex gap-1">
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                {dataLang?.returns_wareshoue || "returns_wareshoue"}:
                                                                                            </h2>
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                                                                {option?.warehouse_name}
                                                                                            </h2>
                                                                                        </div>
                                                                                        <div className="flex gap-1">
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                {dataLang?.returns_wareshouePosition || "returns_wareshouePosition"}:
                                                                                            </h2>
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                                                                {option?.label}
                                                                                            </h2>
                                                                                        </div>
                                                                                        <div className="flex gap-1">
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                {dataLang?.returns_survive || "returns_survive"}:
                                                                                            </h2>
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] uppercase font-semibold">
                                                                                                {formatNumber(option?.qty)}
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
                                                                                ce?.amount === 1 ||
                                                                                ce?.amount === "" ||
                                                                                ce?.amount === null ||
                                                                                ce?.amount === 0
                                                                            }
                                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                            onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, "decrease")}
                                                                        >
                                                                            <Minus
                                                                                className="2xl:scale-100 xl:scale-100 scale-50"
                                                                                size="16"
                                                                            />
                                                                        </button>
                                                                        <InPutNumericFormat
                                                                            onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "amount")}
                                                                            value={ce?.amount || null}
                                                                            className={`${errAmount && (ce?.amount == null || ce?.amount == "" || ce?.amount == 0)
                                                                                ? "border-b border-red-500"
                                                                                : errSurvive ? "border-b border-red-500" : "border-b border-gray-200"
                                                                                }
                                                                                ${ce?.amount == null || ce?.amount == "" || ce?.amount == 0 ? "border-b border-red-500" : ""}
                                                                                appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                                            isAllowed={(values) => {
                                                                                if (!values.value) return true;
                                                                                const { floatValue } = values;
                                                                                if (floatValue > ce?.quantityLeft || floatValue > qtyHouse) {
                                                                                    isShow("error", `${props.dataLang?.returns_err_Qty || "returns_err_Qty"} ${formatNumber(ce?.quantityLeft)}`);
                                                                                }
                                                                                return floatValue <= ce?.quantityLeft;
                                                                            }}
                                                                        />
                                                                        <button
                                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                            onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, "increase")}
                                                                        >
                                                                            <Add
                                                                                className="2xl:scale-100 xl:scale-100 scale-50"
                                                                                size="16"
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    <div className="absolute top-0 right-0 p-1 cursor-pointer ">
                                                                        <PopupParent
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
                                                                                    {dataLang?.returns_sldn || "returns_sldn"}: {formatNumber(ce?.quantityCreate)}{" "}
                                                                                </span>
                                                                                <span className="font-medium text-xs">
                                                                                    {dataLang?.returns_sldt || "returns_sldt"}: {formatNumber(ce?.quantityReturned)}
                                                                                </span>
                                                                                <span className="font-medium text-xs">
                                                                                    {dataLang?.returns_slcl || "returns_slcl"}: {formatNumber(ce?.quantityLeft)}
                                                                                </span>
                                                                            </div>
                                                                        </PopupParent>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                    <InPutMoneyFormat
                                                                        className={`
                                                                        ${ce?.price == 0 && 'border-red-500' || ce?.price == "" && 'border-red-500' || ce?.price == null && 'border-red-500'}
                                                                        appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px]  text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px] focus:outline-none border-b border-gray-200 h-fit`}
                                                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "price")}
                                                                        value={ce?.price}
                                                                        isAllowed={isAllowedNumber}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                    <NumericFormat
                                                                        className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b border-gray-200"
                                                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "discount")}
                                                                        value={ce?.discount}
                                                                        isAllowed={isAllowedDiscount}
                                                                    />
                                                                </div>
                                                                <div className="col-span-1 text-right flex items-center justify-end  h-full p-0.5">
                                                                    <h3 className="px-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                        {formatMoney(Number(ce?.price) * (1 - Number(ce?.discount) / 100))}
                                                                    </h3>
                                                                </div>
                                                                <div className=" flex flex-col items-center p-1 h-full justify-center">
                                                                    <SelectCore
                                                                        options={[{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes]}
                                                                        value={ce?.tax}
                                                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "tax")}
                                                                        placeholder={dataLang?.import_from_tax || "import_from_tax"}
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
                                                                    {formatMoney(ce?.price * (1 - Number(ce?.discount) / 100) * (1 + Number(ce?.tax?.tax_rate) / 100) * Number(ce?.amount))}
                                                                </div>
                                                                <div className="col-span-1 flex items-center justify-center  h-full p-0.5">
                                                                    <input
                                                                        value={ce?.note}
                                                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "note")}
                                                                        placeholder="Ghi chú"
                                                                        type="text"
                                                                        className="  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 outline-none mb-2"
                                                                    />
                                                                </div>
                                                                <div className=" h-full p-0.5 flex flex-col items-center justify-center">
                                                                    <button
                                                                        title="Xóa"
                                                                        onClick={_HandleDeleteChild.bind(this, e?.id, ce?.id)}
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
                                    value={discount}
                                    isAllowed={isAllowedDiscount}
                                    onValueChange={_HandleChangeInput.bind(this, "discount")}
                                    className=" text-center py-1 px-2 bg-transparent font-medium w-20 focus:outline-none border-b-2 border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 ">
                            <h2>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h2>
                            <SelectCore
                                options={[{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes]}
                                onChange={_HandleChangeInput.bind(this, "tax")}
                                value={tax}
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price) *
                                                    (Number(childItem?.discount) / 100) *
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.discount / 100)) *
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.discount / 100)) *
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
                                    {formatMoney(
                                        listData?.reduce((accumulator, item) => {
                                            const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                                                const product =
                                                    Number(childItem?.price * (1 - childItem?.discount / 100)) *
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
                                onClick={() => router.push(routerReturns.home)}
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

export default PurchaseReturnsForm;
